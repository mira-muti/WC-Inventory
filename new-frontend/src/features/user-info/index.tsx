import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { activityLogApi } from "@/lib/api/activity-log";
import { queryKeys } from "@/lib/api/queryKeys";
import { userApi } from "@/lib/api/users";
import { BoxMovementView } from "@/types/activity-log";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useUsers } from "../admin-dashboard/tabs/user-management/hooks/use-users";

const UserInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const { deleteUser, isDeleting, banUser, isBanning, unbanUser, isUnbanning } =
    useUsers();

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: queryKeys.users.detail(id!),
    queryFn: () => userApi.getUser(id!),
  });

  const { data: userActivity, isLoading: activityLoading } = useQuery({
    queryKey: queryKeys.activityLog.byUser(id!),
    queryFn: () => activityLogApi.getActivityLogByUserId(id!),
  });

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      navigate("/admin/users");
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete user",
      );
    }
  };

  const handleBanUser = async (userId: string) => {
    try {
      await banUser(userId);
      toast.success("User successfully banned");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to ban user",
      );
    }
  };
  const handleUnbanUser = async (userId: string) => {
    try {
      await unbanUser(userId);
      toast.success("User successfully unbanned");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to unban user",
      );
    }
  };

  if (userLoading || activityLoading) return <div>Loading...</div>;
  if (!user) return <div>User with that id doesn't exist</div>;

  const userId = user.id ?? null;
  if (!userId) return <div>Invalid user record (missing id)</div>;

  const isActive = !!user.is_active;

  return (
    <Card className="max-w mx-auto">
      <CardHeader>
        <CardTitle>Manage Permissions & Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <label className="font-semibold">Name: </label>
              <p>{user.name ?? "N/A"}</p>
            </div>
            <div className="mb-4">
              <label className="font-semibold">Email: </label>
              <p>{user.email ?? "N/A"}</p>
            </div>
            <div className="mb-4">
              <label className="font-semibold">Created on:</label>
              <p>
                {user.created_at
                  ? format(new Date(user.created_at), "PP")
                  : "-"}
              </p>
            </div>
            <div className="mb-4">
              <label className="font-semibold">Account Status:</label>
              {/* <Select
                value={statusValue}
                onValueChange={onChangeAccountStatus}
                disabled={isBanning || isUnbanning}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select> */}
              <div className="flex gap-3">
                <Button
                  variant={isActive ? "outline" : "default"}
                  disabled={isBanning || isUnbanning}
                  onClick={() =>
                    isActive ? handleBanUser(userId) : handleUnbanUser(userId)
                  }
                >
                  {isActive
                    ? isBanning
                      ? "Disabling..."
                      : "Disable"
                    : isUnbanning
                      ? "Enabling..."
                      : "Enable"}
                </Button>
                {/* <Button
                  variant="destructive"
                  disabled={isDeleting}
                  onClick={() => handleDeleteUser(userId)}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button> */}

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={isDeleting}>
                      {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this user?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the user account and all associated data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700"
                        disabled={isDeleting}
                        onClick={() => handleDeleteUser(userId)}
                      >
                        {isDeleting ? "Deleting..." : "Confirm delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-semibold mb-4">
              Role:{" "}
              {user?.role
                ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                : "Unknown"}
            </h2>

            <div className="space-y-2"></div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="font-semibold mb-4">Activity:</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Box</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Note</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userActivity && userActivity.length > 0 ? (
                userActivity.map((movement: BoxMovementView) => (
                  <TableRow key={movement.box_movement_id}>
                    <TableCell>
                      {movement.from_location_name} {"->"}{" "}
                      {movement.to_location_name}
                    </TableCell>
                    <TableCell>{movement.box_name}</TableCell>
                    <TableCell>
                      {format(new Date(movement.moved_at!), "PP")}
                    </TableCell>
                    <TableCell>{movement.note}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4}>No activity found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInfo;
