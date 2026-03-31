import { activityLogApi } from "@/lib/api/activity-log"
import { useQuery } from "@tanstack/react-query"

export const useActivityLogs = () => {
    return useQuery({
      queryKey: ['activity-logs'],
      queryFn: activityLogApi.getActivityLogs
    })
  }
  