import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { useMutation } from '@tanstack/react-query';

export const useWatchHistory = (streamId: string) => {
  const { user } = useAuth();

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

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (user && streamId) {
      recordWatch();
    }
  }, [user, streamId]);

  return { recordWatch };
};