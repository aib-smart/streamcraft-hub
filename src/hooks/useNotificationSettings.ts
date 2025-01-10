import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface NotificationSettings {
  email_notifications: boolean;
  push_notifications: boolean;
}

export const useNotificationSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["notificationSettings", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("notification_settings")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const updateSettings = useMutation({
    mutationFn: async (newSettings: Partial<NotificationSettings>) => {
      if (!user) throw new Error("User not authenticated");
      const { error } = await supabase
        .from("notification_settings")
        .update(newSettings)
        .eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificationSettings", user?.id] });
      toast({
        title: "Success",
        description: "Notification settings updated",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update notification settings",
        variant: "destructive",
      });
      console.error("Notification settings error:", error);
    },
  });

  return {
    settings,
    isLoading,
    updateSettings,
  };
};