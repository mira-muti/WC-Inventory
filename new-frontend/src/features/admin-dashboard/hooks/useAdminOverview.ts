import { useQuery } from "@tanstack/react-query";
import { analyticsAPI } from "@/lib/api/analytics";
import { formatISO } from "date-fns";

export function useAdminOverview(period: { id: string; start?: Date; end?: Date }) {
  const startDate = period.start ? formatISO(period.start) : undefined;
  const endDate = period.end ? formatISO(period.end) : undefined;
  // const endDate = period.end ? formatISO(new Date(period.end.getTime() + 1000)) : undefined;

  return {
    donatedBoxes: useQuery({ queryKey: ['admin', 'donatedBoxes', period.id], queryFn: () => analyticsAPI.donatedBoxesCount({ startDate, endDate }) }),
    donatedItems: useQuery({ queryKey: ['admin', 'donatedItems', period.id], queryFn: () => analyticsAPI.donatedItemsCount({ startDate, endDate }) }),
    stockTotals: useQuery({ queryKey: ['admin', 'stockTotals', period.id], queryFn: () => analyticsAPI.stockTotals() }),
    topItems: useQuery({ queryKey: ['admin', 'topItems', period.id], queryFn: () => analyticsAPI.topItems({ limit: 5, startDate, endDate }) }),
    topUsers: useQuery({ queryKey: ['admin', 'topUsers', period.id], queryFn: () => analyticsAPI.topUsers({ limit: 5, startDate, endDate }) }),
  };
}