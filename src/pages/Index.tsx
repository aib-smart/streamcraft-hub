import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";

interface OnlineUser {
  user_id: string;
  online_at: string;
}

const Index = () => {
  const [onlineUsers, setOnlineUsers] = useState<Record<string, OnlineUser[]>>({});

  const { data: streams, isLoading, error } = useQuery({
    queryKey: ["streams"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("streams")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw new Error(error.message);
      return data || [];
    },
  });

  const { data: profiles } = useQuery({
    queryKey: ["online-profiles", Object.keys(onlineUsers)],
    queryFn: async () => {
      const userIds = Object.values(onlineUsers)
        .flat()
        .map(user => user.user_id);

      if (userIds.length === 0) return [];

      const { data } = await supabase
        .from("profiles")
        .select("id, username, avatar_url, full_name")
        .in("id", userIds);

      return data || [];
    },
    enabled: Object.keys(onlineUsers).length > 0,
  });

  useEffect(() => {
    const channel = supabase.channel('online-users')
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState<OnlineUser>();
        console.log('Presence state updated:', newState);
        setOnlineUsers(newState);
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
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-red-500">
        <p>Error loading streams: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
              A Better Streaming <span className="text-primary">'Xperience!</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Hand-picked professional content, designed for everyone.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg">
                <Link to="/streams">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Online Users Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-background/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Online Users</h2>
          <div className="flex flex-wrap gap-4">
            {profiles?.map((profile) => (
              <div
                key={profile.id}
                className="flex items-center gap-2 bg-card p-3 rounded-lg"
              >
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile.avatar_url || undefined} />
                    <AvatarFallback>
                      <UserRound className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white" />
                </div>
                <span className="text-sm font-medium">
                  {profile.full_name || profile.username || "Anonymous"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Streams</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {streams.length > 0 ? (
              streams.map((stream) => (
                <div key={stream.id} className="bg-card rounded-lg shadow-lg overflow-hidden">
                  <div className="aspect-video bg-muted" />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{stream.title}</h3>
                    <p className="text-muted-foreground mb-4">
                      Experience amazing content from our curated collection.
                    </p>
                    <p className="text-lg font-semibold text-primary mb-4">Free</p>
                    <Link to={`/streams/${stream.id}`}>
                      <Button className="w-full">Watch Now</Button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p>No streams available at the moment.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;