import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { UserCog, Loader2 } from "lucide-react";

type UserRole = "admin" | "sub_admin" | "user";

const UserManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [updating, setUpdating] = useState<string | null>(null);

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data: users } = await supabase
        .from("user_roles")
        .select(`
          *,
          profiles (*)
        `);
      return users;
    },
  });

  const updateRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: UserRole }) => {
      setUpdating(userId);
      const { error } = await supabase
        .from("user_roles")
        .update({ role })
        .eq("user_id", userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
      console.error("Error updating role:", error);
    },
    onSettled: () => {
      setUpdating(null);
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="rounded-md border mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.user_id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">
                    {user.profiles?.username || "No username"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {user.profiles?.full_name || "No name"}
                  </span>
                </div>
              </TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Select
                    value={user.role}
                    onValueChange={(value: UserRole) =>
                      updateRole.mutate({ userId: user.user_id, role: value })
                    }
                    disabled={updating === user.user_id}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="sub_admin">Sub Admin</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                  {updating === user.user_id && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserManagement;