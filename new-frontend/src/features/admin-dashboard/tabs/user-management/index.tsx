import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserForm } from "./components/user-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "./components/search-bar";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { UserTable } from "./components/user-table";
import { UserFormData } from "./types";
import { useUsers } from "./hooks/use-users";

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { users, isLoading, error, createUser, isCreating } = useUsers();

  const filteredUsers = users?.filter(
    (user) =>
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCreateUser = async (data: UserFormData) => {
    try {
      await createUser(data);
      toast({ title: "Success", description: "User created successfully" });
      setIsModalOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create user",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        Error: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
        <Button onClick={() => setIsModalOpen(true)}>Create User</Button>
      </div>

      <UserTable
        users={filteredUsers || []}
        onUserClick={(id) => navigate(`/admin/users/${id}`)}
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent aria-describedby="create-user-dialog">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
          </DialogHeader>
          <UserForm
            onSubmit={handleCreateUser}
            onCancel={() => setIsModalOpen(false)}
            isLoading={isCreating}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
