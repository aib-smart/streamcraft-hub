import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

type UserPresence = {
  user_id: string;
  online_at: string;
};

const UserPresence = () => {
  const { user } = useAuth();
  const [presenceState, setPresenceState] = useState<Record<string, UserPresence[]>>({});

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
        const newState = channel.presenceState<UserPresence>();
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

  const isUserOnline = (userId: string) => {
    return Object.values(presenceState).some(presences =>
      presences.some(presence => presence.user_id === userId)
    );
  };

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
            <TableHead>Status</TableHead>
            <TableHead>Last Seen</TableHead>
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
              <TableCell>
                <Badge
                  variant={isUserOnline(user.user_id) ? "success" : "secondary"}
                >
                  {isUserOnline(user.user_id) ? "Online" : "Offline"}
                </Badge>
              </TableCell>
              <TableCell>
                {isUserOnline(user.user_id)
                  ? "Currently Online"
                  : "Not Available"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserPresence;