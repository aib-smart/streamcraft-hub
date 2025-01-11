import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserManagement from "@/components/admin/UserManagement";
import ProfileManagement from "@/components/admin/ProfileManagement";
import StreamManagement from "@/components/admin/StreamManagement";
import UserPresence from "@/components/admin/UserPresence";
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
    <div className="container px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="h-5 w-5 sm:h-6 sm:w-6" />
        <h1 className="text-xl sm:text-2xl font-bold">Admin Dashboard</h1>
      </div>
      
      <Tabs defaultValue="streams" className="w-full">
        <TabsList className="w-full flex-wrap justify-start">
          <TabsTrigger value="streams" className="flex-grow sm:flex-grow-0">Stream Management</TabsTrigger>
          <TabsTrigger value="users" className="flex-grow sm:flex-grow-0">User Management</TabsTrigger>
          <TabsTrigger value="profiles" className="flex-grow sm:flex-grow-0">Profile Management</TabsTrigger>
          <TabsTrigger value="presence" className="flex-grow sm:flex-grow-0">Online Users</TabsTrigger>
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
        <TabsContent value="presence">
          <UserPresence />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;