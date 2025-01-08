import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Loader2, Trash2 } from "lucide-react";

interface Stream {
  id: string;
  title: string;
  channel_name: string;
  thumbnail_url?: string;
}

interface StreamListProps {
  streams: Stream[];
}

const StreamList = ({ streams }: StreamListProps) => {
  const queryClient = useQueryClient();

  const deleteStreamMutation = useMutation({
    mutationFn: async (streamId: string) => {
      const { error } = await supabase
        .from("streams")
        .delete()
        .eq("id", streamId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["streams"] });
      toast({
        title: "Success",
        description: "Stream deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getChannelInitials = (channelName: string) => {
    return channelName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Streams</CardTitle>
        <CardDescription>View and manage existing streams</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {streams?.map((stream) => (
            <div
              key={stream.id}
              className="flex flex-col p-4 border rounded-lg space-y-4"
            >
              <div className="aspect-video bg-muted rounded-md overflow-hidden">
                {stream.thumbnail_url ? (
                  <img
                    src={stream.thumbnail_url}
                    alt={stream.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10">
                    <span className="text-4xl font-bold text-primary/40">
                      {getChannelInitials(stream.channel_name || stream.title)}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <h3 className="font-medium truncate">{stream.title}</h3>
                <p className="text-sm text-muted-foreground truncate">
                  {stream.channel_name}
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteStreamMutation.mutate(stream.id)}
                disabled={deleteStreamMutation.isPending}
                className="w-full"
              >
                {deleteStreamMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Delete Stream
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StreamList;