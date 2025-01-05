import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Play, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const StreamDetail = () => {
  const { id } = useParams(); // Getting the stream ID from the URL
  const { data: stream, isLoading, isError, error } = useQuery({
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

  if (isError) {
    return <div>Error loading stream: {error.message}</div>;
  }

  return (
    <div className="container py-8 fade-in">
      <h1 className="text-4xl font-bold mb-8">{stream.title}</h1>

      <div className="mb-12 relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-500 to-blue-500">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Now Playing</h2>
          <p className="text-lg mb-6 max-w-2xl">{stream.description}</p>
          <Button size="lg" variant="secondary">
            <Play className="mr-2 h-4 w-4" /> Watch Now
          </Button>
        </div>
      </div>

      <div className="flex items-center text-sm text-muted-foreground gap-4">
        <span className="flex items-center">
          <Users className="mr-1 h-4 w-4" />
          {stream.viewer_count} viewers
        </span>
        <span className="flex items-center">
          <Clock className="mr-1 h-4 w-4" />
          {stream.duration} minutes
        </span>
      </div>
    </div>
  );
};

export default StreamDetail;
