import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserView } from "@/types/user";
import { useMemo, useState } from "react";

interface UserTableProps {
  users: UserView[];
  onUserClick: (userId: string) => void;
}

export function UserTable({ users, onUserClick }: UserTableProps) {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      // Only sort by is_active; everything else stays in order
      if (sortOrder === "asc") {
        return Number(b.is_active) - Number(a.is_active);
      } else {
        return Number(a.is_active) - Number(b.is_active);
      }
    });
  }, [users, sortOrder]);

  const toggleSort = () =>
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));

  const sortIndicator = sortOrder === "asc" ? "↑" : "↓";

  if (!users.length) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No users found
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-white px-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Account Creation</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              className="cursor-pointer hover:bg-muted"
              onClick={() => onUserClick(user.id!)}
            >
              <TableCell>{user.name ?? "N/A"}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                {user.created_at ? format(new Date(user.created_at), "PP") : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
