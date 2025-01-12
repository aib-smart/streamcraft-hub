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
    <div className="container max-w-full px-4 py-6">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="h-5 w-5" />
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>
      
      <Tabs defaultValue="streams" className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-2">
            <TabsList className="flex flex-col h-auto w-full space-y-2 bg-transparent">
              <TabsTrigger 
                value="streams" 
                className="w-full justify-start px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Streams
              </TabsTrigger>
              <TabsTrigger 
                value="users" 
                className="w-full justify-start px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Users
              </TabsTrigger>
              <TabsTrigger 
                value="profiles" 
                className="w-full justify-start px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Profiles
              </TabsTrigger>
              <TabsTrigger 
                value="presence" 
                className="w-full justify-start px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Online
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="md:col-span-10">
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
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default Admin;