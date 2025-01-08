import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer";

const StreamPage = () => {
  const { id } = useParams();

  const { data: stream, isLoading, error } = useQuery({
    queryKey: ["stream", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("streams")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !stream) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-red-500">
        <p>Error loading stream: {error ? error.message : "Stream not found"}</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">{stream.title}</h1>
            <p className="text-xl text-muted-foreground mb-8">{stream.description}</p>
          </div>

          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            {stream.stream_url && (
              <VideoPlayer url={stream.stream_url} />
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default StreamPage;