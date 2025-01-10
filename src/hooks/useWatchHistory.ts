import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useWatchHistory = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: watchHistory, isLoading } = useQuery({
    queryKey: ["watchHistory", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("watch_history")
        .select(`
          *,
          stream:streams(
            id,
            title,
            thumbnail_url,
            stream_url
          )
        `)
        .eq("user_id", user.id)
        .order("watched_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const addToHistory = useMutation({
    mutationFn: async ({ streamId, duration }: { streamId: string; duration: number }) => {
      if (!user) throw new Error("User not authenticated");
      const { error } = await supabase
        .from("watch_history")
        .insert({
          user_id: user.id,
          stream_id: streamId,
          watch_duration: duration,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchHistory", user?.id] });
      toast({
        title: "Success",
        description: "Watch history updated",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update watch history",
        variant: "destructive",
      });
      console.error("Watch history error:", error);
    },
  });

  const clearHistory = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("User not authenticated");
      const { error } = await supabase
        .from("watch_history")
        .delete()
        .eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchHistory", user?.id] });
      toast({
        title: "Success",
        description: "Watch history cleared",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to clear watch history",
        variant: "destructive",
      });
      console.error("Clear history error:", error);
    },
  });

  return {
    watchHistory,
    isLoading,
    addToHistory,
    clearHistory,
  };
};