import { CardContent } from "@/components/ui/card";

export default function TopItemsList({ items, loading }: { items: any[]; loading?: boolean }) {
  return (
      <CardContent className="p-4">
        <h3 className="font-semibold">Most Donated Items</h3>
        {loading ? <div>Loading...</div> : (
          <ul className="space-y-2">
            {items.map((it: any, i: number) => (
              <li key={i} className="flex justify-between">
                <span>{it.category_name || it.category_id}</span>
                <span className="font-medium">{it.total ?? 0}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
  );
}