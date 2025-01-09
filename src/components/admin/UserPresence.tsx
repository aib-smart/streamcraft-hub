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
import { RealtimePresenceState } from "@supabase/supabase-js";

type UserPresence = {
  user_id: string;
  online_at: string;
};

type PresenceState = RealtimePresenceState<UserPresence>;

const UserPresence = () => {
  const [presenceState, setPresenceState] = useState<PresenceState>({});

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
    // Subscribe to presence channel
    const channel = supabase.channel('online-users')
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        setPresenceState(newState as PresenceState);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: (await supabase.auth.getUser()).data.user?.id,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const isUserOnline = (userId: string) => {
    return Object.values(presenceState).some(presences =>
      presences.some(presence => presence.user_id === userId)
    );
  };

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
                  variant={isUserOnline(user.user_id) ? "default" : "secondary"}
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