import { UserFormData } from "@/features/admin-dashboard/tabs/user-management/types";
import { UserView } from "@/types/user";
import { supabase } from "../supabaseClient";
import { cryptoUtils } from "@/lib/crypto";

export const userApi = {
  getUsers: async () => {
    const { data, error } = await supabase
      .from("user_view")
      .select()
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data as UserView[];
  },

  getUser: async (userId: string) => {
    const { data, error } = await supabase
      .from("user_view")
      .select()
      .eq("id", userId)
      .single();

    if (error) throw new Error(error.message);
    return data as UserView;
  },

  createUser: async (
    userData: UserFormData,
  ): Promise<{ user: UserFormData; message: string }> => {
    const encrypted = cryptoUtils.encrypt(userData.password);

    // TODO - Permissions Check
    const { data, error } = await supabase.functions.invoke("create-user", {
      body: {
        email: userData.email,
        password: encrypted,
        role: userData.role,
        name: userData.name,
      },
    });
    if (error) {
      throw new Error(error.message);
    }

    // `data` should contain { user, message }
    return data;
  },

  deleteUser: async (
    userId: string,
  ): Promise<{ ok: boolean; message: string; userId: string }> => {
    // TODO - Permissions Check (e.g., ensure current user is admin OR is self)

    const { data, error } = await supabase.functions.invoke("delete-user", {
      body: { userId },
    });

    if (error) throw new Error(error.message);

    // data is expected to be: { ok: true, message: 'User deleted successfully', userId }
    return data;
  },

  banUser: async (userId: string) => {
    const { data, error } = await supabase.functions.invoke("ban-user", {
      body: {
        userId,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  unbanUser: async (userId: string) => {
    const { data, error } = await supabase.functions.invoke("unban-user", {
      body: {
        userId,
      },
    });

    if (error) {
      throw new Error(error.message);
    }
    return data;
  },
};
