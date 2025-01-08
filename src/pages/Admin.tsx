import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserManagement from "@/components/admin/UserManagement";
import ProfileManagement from "@/components/admin/ProfileManagement";
import StreamManagement from "@/components/admin/StreamManagement";
import { Shield } from "lucide-react";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: userRole } = useQuery({
    queryKey: ["userRole"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();
      
      return roleData?.role;
    },
  });

  useEffect(() => {
    if (userRole && userRole !== "admin") {
      toast({
        title: "Unauthorized",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [userRole, navigate, toast]);

  if (!userRole || userRole !== "admin") {
    return null;
  }

  return (
    <div className="container py-8">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>
      
      <Tabs defaultValue="streams" className="w-full">
        <TabsList>
          <TabsTrigger value="streams">Stream Management</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="profiles">Profile Management</TabsTrigger>
        </TabsList>
        <TabsContent value="streams">
          <StreamManagement />
        </TabsContent>
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
        <TabsContent value="profiles">
          <ProfileManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;