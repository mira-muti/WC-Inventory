import { useState, useMemo } from "react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { startOfMonth, endOfMonth, startOfYear, endOfYear, startOfDay, endOfDay, startOfWeek, endOfWeek } from "date-fns";
import { useAdminOverview } from "../hooks/useAdminOverview";
import MetricCard from "../components/MetricCard";
import TopItemsList from "../components/TopItemsList";
import TopUsersList from "../components/TopUsersList";
import { Card, CardContent } from "@/components/ui/card";


/**
 * Defines the timeframes that the user can request analytics from
 */
const PERIODS = [
  { id: "daily", label: "Today", getRange: () => ({start: startOfDay(new Date()), end: endOfDay(new Date())})},
  { id: "weekly", label: "This Week", getRange: () => ({start: startOfWeek(new Date()), end: endOfWeek(new Date())})},
  { id: "monthly", label: "This Month", getRange: () => ({start: startOfMonth(new Date()), end: endOfMonth(new Date())})},
  { id: "yearly", label: "This Year", getRange: () => ({start: startOfYear(new Date()), end: endOfYear(new Date())})},
]

/**
 * AdminOverview Component: sets up the
 * state management for selecting and calculating a time period.
 * Uses useMemo to avoid uneccessary recalculations on re-renders
 */
const AdminOverview: React.FC = () => {
  const [periodId, setPeriodId] = useState(PERIODS[0].id);
  const period = useMemo(() => {
    const p = PERIODS.find(x => x.id === periodId)!;
    const range = p.getRange();
    return { id: p.id, ...range };
}, [periodId]);

const { donatedBoxes, donatedItems, stockTotals, topItems, topUsers } = useAdminOverview(period);

/**
 * Component Return (JSX/TSX)
 *
 * This returns the JSX (or TSX in TypeScript) that defines what the component renders.
 * TypeScript verifies that our JSX is valid and that we're using state correctly.
 */
return (
  <div className="admin-overview">
    {/* Component Header */}

    <div className="mx-auto max-w-7xl bg-gray-50">
      <Card className="p-6">
        {/* Main Grid: 2 Columns */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="flex flex-col space-y-6">
            <Select value={periodId} onValueChange={setPeriodId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PERIODS.map(p => <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>)}
              </SelectContent>
            </Select>
            {/* Left Column, First Row */}
            <div>
              <h2 className="text-xl font-semibold mb-2">Donated</h2>
              <div className="flex gap-3">
                <Card className="flex-1 p-6 text-center text-2xl">
                    <CardContent className="p-4">
                      <MetricCard value={donatedBoxes.data ?? "--"} loading={donatedBoxes.isLoading} />
                      <p className="text-base">boxes</p>
                    </CardContent>
                </Card>
                <Card className="flex-1 p-6 text-center text-2xl">
                    <CardContent className="p-4">
                      <MetricCard value={donatedItems.data ?? "--"} loading={donatedItems.isLoading} />
                      <p className="text-base">items</p>
                    </CardContent>
                </Card>
              </div>
            </div>
            {/* Left Column, Second Row */}
            <div>
              <h2 className="text-xl font-semibold mb-2">In Stock</h2>
              <div className="flex gap-3">
                <Card className="flex-1 p-6 text-center text-2xl">
                  <CardContent className="p-4">
                    <MetricCard value={stockTotals.data?.totalBoxes ?? "--"} loading={stockTotals.isLoading} />
                    <p className="text-base">boxes</p>
                  </CardContent>
                </Card>
                <Card className="flex-1 p-6 text-center text-2xl">
                  <CardContent className="p-4">
                    <MetricCard value={stockTotals.data?.totalItems ?? "--"} loading={stockTotals.isLoading} />
                    <p className="text-base">items</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          {/* Right Column */}
          <div className="flex flex-col gap-4">
            <Card className="flex-1">
                <TopItemsList items={topItems.data ?? []} loading={topItems.isLoading} />
            </Card>
            <Card className="flex-1">
                <TopUsersList users={topUsers.data ?? []} loading={topUsers.isLoading} />
            </Card>
          </div>
        </div>
      </Card>
    </div>
    </div>
  );
};

/**
 * Export the component so it can be imported elsewhere
 * This makes our component available to other files that import it
 */
export default AdminOverview;