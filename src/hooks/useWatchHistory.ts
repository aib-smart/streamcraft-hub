import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

export const useWatchHistory = (streamId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { mutate: recordWatch } = useMutation({
    mutationFn: async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('watch_history')
        .upsert(
          {
            user_id: user.id,
            stream_id: streamId,
            watched_at: new Date().toISOString(),
          },
          {
            onConflict: 'user_id,stream_id',
          }
        );

      if (error) {
        toast({
          title: "Error",
          description: "Failed to record watch history",
          variant: "destructive",
        });
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchHistory'] });
    },
  });

  useEffect(() => {
    if (user && streamId) {
      recordWatch();
    }
  }, [user, streamId]);

  return { recordWatch };
};