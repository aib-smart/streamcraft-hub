import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useWatchHistory } from "@/hooks/useWatchHistory";
import VideoPlayer from "@/components/VideoPlayer";

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
    return <div>Loading...</div>;
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