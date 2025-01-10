import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { UserPresenceTable } from "./presence/UserPresenceTable";

const UserPresence = () => {
  const { user } = useAuth();
  const [presenceState, setPresenceState] = useState<Record<string, Array<{ user_id: string }>>>({});

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

  useEffect(() => {
    if (!user) return;

    const channel = supabase.channel('online-users', {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState<{ user_id: string }>();
        console.log('Presence state updated:', newState);
        setPresenceState(newState);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          const presenceTrackStatus = await channel.track({
            user_id: user.id,
            online_at: new Date().toISOString(),
          });
          console.log('Presence track status:', presenceTrackStatus);
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <UserPresenceTable users={users || []} presenceState={presenceState} />;
};

export default UserPresence;