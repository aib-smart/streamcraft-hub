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
      <h1 className="text-4xl font-bold mb-4">{stream.title}</h1>
      <div className="mb-6">
        <p className="text-xl text-muted-foreground">{stream.description}</p>
      </div>

      {/* Styled Video Player */}
      <div className="relative mb-8 overflow-hidden rounded-xl bg-black shadow-lg">
        {/* <div className="absolute inset-0 bg-black/50 z-10 flex justify-center items-center">
          <Button className="text-white bg-primary hover:bg-primary-dark shadow-md">Watch Now</Button>
        </div> */}
        <iframe
          src={`${stream.stream_url}?autoplay=1`}  // Dynamic stream URL
          className="w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[90vh] rounded-md"
          frameBorder="0"
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      </div>

      {/* <Button variant="secondary" size="lg">
        Watch Stream
      </Button> */}
    </div>
  );
};

export default StreamDetail;
