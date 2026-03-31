import { CardContent } from "@/components/ui/card";

export default function TopUsersList({ users, loading }: { users: any[]; loading?: boolean }) {
  return (
      <CardContent className="p-4">
        <h3 className="font-semibold">Most Active Users</h3>
        {loading ? <div>Loading...</div> : (
          <ul className="space-y-2">
            {users.map((u: any, i: number) => ( 
              // tries to show name, falls back to user_id, then unknown
              <li key={i} className="flex justify-between">
                <span>{u?.email ?? u?.user_id ?? 'Unknown'}</span>
                <span className="font-medium">{u?.donated_count ?? 0}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
  );
}