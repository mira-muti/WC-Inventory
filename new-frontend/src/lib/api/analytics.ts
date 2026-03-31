import { supabase } from "../supabaseClient";

export const analyticsAPI = {
    donatedBoxesCount: async ({ startDate, endDate }: { startDate?: string; endDate?: string }) => {
        // Count distinct box_ids from box_movements where action = 'Donated' within date range
        let q = supabase.from("box_movements").select("box_id", { count: "exact" }).eq("action", "Donated");
        if (startDate) q = q.gte("moved_at", startDate);
        if (endDate) q = q.lte("moved_at", endDate);

        const { count, error } = await q;
        if (error) throw new Error(error.message);

        return count ?? 0;        
    },

    donatedItemsCount: async ({ startDate, endDate }: { startDate?: string; endDate?: string }) => {
        // Get donated boxes in the date range
        let q = supabase.from("box_movements").select("box_id, moved_at").eq("action", "Donated");
        if (startDate) q = q.gte("moved_at", startDate);
        if (endDate) q = q.lte("moved_at", endDate);
        const { data: movements, error } = await q;

        if (error) throw new Error(error.message);
        
        // Get box IDs
        const boxIds = (movements ?? []).map((m: any) => m.box_id).filter(Boolean);
        if (boxIds.length === 0) return 0; // no donated boxes

        // Get box contents for those boxes
        const { data: contents, error: contentsError } = await supabase
            .from("box_contents")
            .select("quantity")
            .in("box_id", boxIds);
        
        if (contentsError) throw new Error(contentsError.message);

        // Sum quantities
        const total = (contents ?? []).reduce((sum: number, row: any) => sum + (row.quantity ?? 0), 0);
        return total ?? 0;
    },

    stockTotals: async () => {
        // Get all boxes
        const { data: boxes, error: boxesError } = await supabase
            .from("boxes")
            .select("box_id, location_id, status");
        
        if (boxesError) throw new Error(boxesError.message);

        // Remove donated boxes from total
        const inStockBoxes = (boxes ?? []).filter((b: any) => b.location_id !== null && b.status !== "Donated");
        const totalBoxes = inStockBoxes.length;

        // Get items
        const { data: contents, error: contentsError } = await supabase
            .from("box_contents")
            .select("quantity, box_id");
        if (contentsError) throw new Error(contentsError.message);

        // sum all items in in-stock boxes
        const inStockBoxIds = new Set(inStockBoxes.map((b: any) => b.box_id));
        const totalItems = (contents ?? []).reduce((sum: number, row: any) => {
            return inStockBoxIds.has(row.box_id) ? sum + (row.quantity ?? 0) : sum;
        }, 0);

        return { totalBoxes, totalItems };
    },

    topItems: async ({ limit, startDate, endDate }: { limit?: number; startDate?: string; endDate?: string }) => {
        // Get donated boxes in the date range
        let q = supabase.from("box_movements").select("box_id, moved_at").eq("action", "Donated");
        if (startDate) q = q.gte("moved_at", startDate);
        if (endDate) q = q.lte("moved_at", endDate);

        const { data: movements, error } = await q;
        if (error) throw new Error(error.message);

        const boxIds = (movements ?? []).map((m: any) => m.box_id).filter(Boolean);
        if (boxIds.length === 0) return [];

        // Get box contents for those boxes and join with categories
        const { data: contents, error: contentsError } = await supabase
            .from("box_contents")
            .select("category_id, quantity")
            .in("box_id", boxIds);
        
        if (contentsError) throw new Error(contentsError.message);

        // Get category details
        const categoryIds = [...new Set((contents ?? []).map((c: any) => c.category_id))];
        const { data: categories, error: categoriesError } = await supabase
            .from("categories")
            .select("category_id, name")
            .in("category_id", categoryIds);
        
        if (categoriesError) throw new Error(categoriesError.message);
        
        const categoryMap = new Map(categories?.map(c => [c.category_id, c.name]) ?? []);

        // Sum quantities by category
        const totals: Record<string, number> = {};
        (contents ?? []).forEach((row: any) => {
            const cat = row.category_id ?? "unknown";
            totals[cat] = (totals[cat] || 0) + (row.quantity ?? 0);
        });

        const items = Object.entries(totals)
            .map(([category_id, total]) => ({ 
                category_id, 
                category_name: categoryMap.get(category_id) || category_id,
                total 
            }))
            .sort((a, b) => b.total - a.total)
            .slice(0, limit);
        return items;

    },

    topUsers: async ({ limit, startDate, endDate }: { limit?: number; startDate?: string; endDate?: string }) => {
        // Get donated boxes in the date range
        let q = supabase.from("box_movements").select("moved_by, moved_at");
        if (startDate) q = q.gte("moved_at", startDate);
        if (endDate) q = q.lte("moved_at", endDate);
        q = q.eq("action", "Donated");

        const { data, error } = await q;
        if (error) throw new Error(error.message);

        // Count donations by user
        const counts: Record<string, number> = {}; // [user_id, count]
        (data ?? []).forEach((row: any) => {
            const user = row.moved_by ?? "unknown";
            counts[user] = (counts[user] || 0) + 1;
        });

        // Create array of user IDs
        const userIds = Object.keys(counts); 

        // Get user details
        const { data: userDetails, error: usersError } = await supabase 
            .from("user_view")
            .select("id, email")
            .in("id", userIds);
        
        if (usersError) throw new Error(usersError.message);

        // create new map with [id: name]
        const userMap = new Map(userDetails?.map(u => [u.id, u.email]) ?? []);

        const users = Object.entries(counts)
            .map(([userId, donatedCount]) => {
                // tries to find name, falls back to "User [userId]"
                const userEmail = userMap.get(userId) ?? `User ${userId}`;
                return { user_id: userId, email: userEmail, donated_count: donatedCount };
            })
            .sort((a, b) => b.donated_count - a.donated_count)
            .slice(0, limit ?? 5);

        return users;
    }
}