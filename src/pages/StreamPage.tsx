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
    return (
      <div className="container px-4 py-8">
        <div className="flex flex-col space-y-4">
          <Skeleton className="h-8 w-3/4 sm:w-1/2" />
          <Skeleton className="h-[40vh] w-full" />
          <Skeleton className="h-4 w-full sm:w-2/3" />
        </div>
      </div>
    );
  }

  if (!stream) {
    return (
      <div className="container px-4 py-8 text-center">
        Stream not found
      </div>
    );
  }

  return (
    <div className="container py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">{stream.title}</h1>
        {stream.stream_url && (
          <div className="aspect-video mb-4">
            <VideoPlayer url={stream.stream_url} />
          </div>
        )}
        {stream.description && (
          <p className="text-base sm:text-lg text-muted-foreground">{stream.description}</p>
        )}
      </div>
    </div>
  );
};

export default StreamPage;