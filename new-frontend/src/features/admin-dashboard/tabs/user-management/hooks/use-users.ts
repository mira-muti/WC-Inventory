import { userApi } from "@/lib/api/users";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useUsers() {
  const queryClient = useQueryClient();

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: userApi.getUsers,
  });

  const createUserMutation = useMutation({
    mutationFn: userApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: userApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const banUserMutation = useMutation({
    mutationFn: userApi.banUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
  const unbanUserMutation = useMutation({
    mutationFn: userApi.unbanUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return {
    users: usersQuery.data,
    isLoading: usersQuery.isLoading,
    error: usersQuery.error,

    //create user
    createUser: createUserMutation.mutateAsync,
    isCreating: createUserMutation.isPending,

    // delete user
    deleteUser: deleteUserMutation.mutateAsync,
    isDeleting: deleteUserMutation.isPending,

    //ban user
    banUser: banUserMutation.mutateAsync,
    isBanning: banUserMutation.isPending,

    //unban user
    unbanUser: unbanUserMutation.mutateAsync,
    isUnbanning: unbanUserMutation.isPending,
  };
}
