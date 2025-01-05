import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const StreamDetail = () => {
  const { streamId } = useParams<{ streamId: string }>();
  const [stream, setStream] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStream = async () => {
      try {
        const { data, error } = await supabase
          .from("streams")
          .select("*")
          .eq("id", streamId)
          .single();

        if (error) {
          throw new Error(error.message);
        }

        setStream(data);
        setIsLoading(false);
      } catch (error: any) {
        console.error("Error fetching stream data:", error);
        setIsLoading(false);
      }
    };

    if (streamId) {
      fetchStream();
    }
  }, [streamId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!stream) {
    return <div>Stream not found</div>;
  }

  return (
    <div className="container py-8 fade-in">
      <h1 className="text-4xl font-bold mb-8">{stream.title}</h1>
      <div className="mb-6">
        <p className="text-xl text-muted-foreground">{stream.description}</p>
      </div>

      {/* Video Embed */}
      <div className="aspect-video mb-6">
      <iframe
        src={stream.embed_url} // Assuming each stream has a unique embed URL
        className="w-full h-full"
        frameBorder="0"
        allowFullScreen
        />
      </div>

      <Button variant="secondary" size="lg">
        Watch Stream
      </Button>
    </div>
  );
};

export default StreamDetail;
