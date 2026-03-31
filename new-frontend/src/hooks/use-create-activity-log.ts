import { activityLogApi } from "@/lib/api/activity-log"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useCreateActivityLog = () => {
    const queryClient = useQueryClient()
  
    return useMutation({
      mutationFn: activityLogApi.createActivityLog,
      onSuccess: () => {
        // Invalidates activity logs
        queryClient.invalidateQueries({ queryKey: ['activity-logs'] })
      }
    })
  }
  