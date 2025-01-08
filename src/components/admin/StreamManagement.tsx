import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import StreamForm from "./StreamForm";
import StreamList from "./StreamList";

const StreamManagement = () => {
  const { data: streams, isLoading } = useQuery({
    queryKey: ["streams"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("streams")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <StreamForm />
      <StreamList streams={streams || []} />
    </div>
  );
};

export default StreamManagement;