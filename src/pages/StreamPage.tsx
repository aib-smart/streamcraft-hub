import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useWatchHistory } from "@/hooks/useWatchHistory";
import VideoPlayer from "@/components/VideoPlayer";
import { Skeleton } from "@/components/ui/skeleton";

const StreamPage = () => {
  const { id } = useParams();
  const { addToHistory } = useWatchHistory();

  const { data: stream, isLoading } = useQuery({
    queryKey: ["stream", id],
    queryFn: async () => {
      const { data } = await supabase
        .from("streams")
        .select("*")
        .eq("id", id)
        .single();
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return <div className="flex items-center space-x-4"> 
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
      <Skeleton className="h-12 w-12 rounded-full" />
      </div>
      <div className="space-y-2">
      <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    </div>;
  }

  if (!stream) {
    return <div>Stream not found</div>;
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">{stream.title}</h1>
        {stream.stream_url && (
          <div className="aspect-video mb-4">
            <VideoPlayer url={stream.stream_url} />
          </div>
        )}
        {stream.description && (
          <p className="text-muted-foreground">{stream.description}</p>
        )}
      </div>
    </div>
  );
};

export default StreamPage;