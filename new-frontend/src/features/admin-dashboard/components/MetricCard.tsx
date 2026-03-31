export default function MetricCard({ value, loading }: { value: React.ReactNode; loading?: boolean }) {
  return (
        <div className="text-2xl font-bold mt-2">{loading ? "..." : value}</div>
  );
}