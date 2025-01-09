import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const WatchHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: watchHistory, isLoading } = useQuery({
    queryKey: ["watchHistory", user?.id],
    queryFn: async () => {
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
        .eq("user_id", user?.id)
        .order("watched_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Watch History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-32 h-20" />
                  <div>
                    <Skeleton className="h-4 w-48 mb-2" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Watch History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {watchHistory && watchHistory.length > 0 ? (
            watchHistory.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-2 border-b"
              >
                <div className="flex items-center gap-4">
                  <div className="w-32 h-20 bg-muted rounded overflow-hidden">
                    {item.stream?.thumbnail_url && (
                      <img
                        src={item.stream.thumbnail_url}
                        alt={item.stream?.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{item.stream?.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Watched {format(new Date(item.watched_at), "PPp")}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/stream/${item.stream?.id}`)}
                >
                  <PlayCircle className="h-4 w-4" />
                </Button>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-4">
              No watch history available
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WatchHistory;