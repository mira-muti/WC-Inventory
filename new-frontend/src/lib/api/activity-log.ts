import { BoxMovementInsert, BoxMovementView } from "@/types/activity-log";
import { supabase } from "../supabaseClient";
import * as Sentry from "@sentry/react";

export type APIError = {
  message: string;
  status: number;
};

type SupabaseResponse<T> = {
  data: T | null;
  error: any;
};

/**
 * DEMO -- TESTING OUT FOR NOW.
 * A helper that handles a Supabase promise with consistent error checking and Sentry reporting.
 */
async function handleRequest<T>(
  thenable: PromiseLike<SupabaseResponse<T>>,
  context: { location: string; extra?: Record<string, any> },
  fallbackMessage: string,
): Promise<T> {
  try {
    const { data, error } = await thenable;
    if (error) {
      const apiError: APIError = { message: error.message, status: 400 };
      Sentry.captureException(apiError, {
        extra: { ...context.extra, location: context.location },
      });
      throw apiError;
    }
    if (data === null) {
      const apiError: APIError = { message: fallbackMessage, status: 500 };
      Sentry.captureException(apiError, {
        extra: { ...context.extra, location: context.location },
      });
      throw apiError;
    }
    return data;
  } catch (err) {
    if ((err as APIError).status) {
      Sentry.captureException(err, {
        extra: { ...context.extra, location: context.location },
      });
      throw err;
    }
    const apiError: APIError = { message: fallbackMessage, status: 500 };
    Sentry.captureException(apiError, {
      extra: {
        ...context.extra,
        location: context.location,
        originalError: err,
      },
    });
    throw apiError;
  }
}

export const activityLogApi = {
  /**
   * Create a new activity log entry.
   */
  createActivityLog: async (actionData: BoxMovementInsert) => {
    const promise = supabase
      .from("box_movements")
      .insert(actionData)
      .select("*")
      .single();
    return handleRequest(
      promise,
      { location: "createActivityLog", extra: { actionData } },
      "Failed to create activity log",
    );
  },

  /**
   * Get activity logs for a specific user.
   */
  getActivityLogByUserId: async (userId: string) => {
    const thenable = supabase
      .from("box_movements_view")
      .select("*")
      .eq("moved_by_user_id", userId)
      .order("moved_at", { ascending: false });
    const data = await handleRequest(
      thenable,
      { location: "getActivityLogByUserId", extra: { userId } },
      "Failed to fetch user activity logs",
    );
    return data as BoxMovementView[];
  },

  /**
   * Get all activity logs.
   */
  getActivityLogs: async () => {
    const thenable = supabase
      .from("box_movements_view")
      .select("*")
      .order("moved_at", { ascending: false });
    const data = await handleRequest(
      thenable,
      { location: "getActivityLogs" },
      "Failed to fetch activity logs",
    );
    return data as BoxMovementView[];
  },
};
