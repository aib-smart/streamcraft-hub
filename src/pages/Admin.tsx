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
    <div className="container max-w-full px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <Shield className="h-5 w-5" />
        <h1 className="text-lg sm:text-2xl font-bold">Admin Dashboard</h1>
      </div>
      
      <Tabs defaultValue="streams" className="w-full space-y-4">
        <TabsList className="w-full h-auto flex flex-wrap gap-2 bg-transparent p-0 sm:p-1 sm:bg-muted">
          <TabsTrigger 
            value="streams" 
            className="flex-1 sm:flex-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Streams
          </TabsTrigger>
          <TabsTrigger 
            value="users" 
            className="flex-1 sm:flex-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Users
          </TabsTrigger>
          <TabsTrigger 
            value="profiles" 
            className="flex-1 sm:flex-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Profiles
          </TabsTrigger>
          <TabsTrigger 
            value="presence" 
            className="flex-1 sm:flex-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Online
          </TabsTrigger>
        </TabsList>
        <TabsContent value="streams" className="mt-2 sm:mt-4">
          <StreamManagement />
        </TabsContent>
        <TabsContent value="users" className="mt-2 sm:mt-4">
          <UserManagement />
        </TabsContent>
        <TabsContent value="profiles" className="mt-2 sm:mt-4">
          <ProfileManagement />
        </TabsContent>
        <TabsContent value="presence" className="mt-2 sm:mt-4">
          <UserPresence />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;