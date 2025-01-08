import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Loader2, Trash2 } from "lucide-react";

const StreamManagement = () => {
  const queryClient = useQueryClient();
  const [newStream, setNewStream] = useState({
    title: "",
    description: "",
    stream_url: "",
    channel_name: "",
  });

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

  const addStreamMutation = useMutation({
    mutationFn: async (streamData: typeof newStream) => {
      const { data, error } = await supabase.from("streams").insert([streamData]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["streams"] });
      setNewStream({ title: "", description: "", stream_url: "", channel_name: "" });
      toast({
        title: "Success",
        description: "Stream added successfully",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addStreamMutation.mutate(newStream);
  };

  const getChannelInitials = (channelName: string) => {
    return channelName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Add New Stream</CardTitle>
          <CardDescription>Create a new stream for users to watch</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                value={newStream.title}
                onChange={(e) =>
                  setNewStream({ ...newStream, title: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label htmlFor="channel" className="text-sm font-medium">
                Channel Name
              </label>
              <Input
                id="channel"
                value={newStream.channel_name}
                onChange={(e) =>
                  setNewStream({ ...newStream, channel_name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                value={newStream.description}
                onChange={(e) =>
                  setNewStream({ ...newStream, description: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="stream_url" className="text-sm font-medium">
                Stream URL
              </label>
              <Input
                id="stream_url"
                value={newStream.stream_url}
                onChange={(e) =>
                  setNewStream({ ...newStream, stream_url: e.target.value })
                }
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              disabled={addStreamMutation.isPending}
              className="w-full"
            >
              {addStreamMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Add Stream
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Streams</CardTitle>
          <CardDescription>View and manage existing streams</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {streams?.map((stream) => (
              <div
                key={stream.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    {getChannelInitials(stream.channel_name || stream.title)}
                  </div>
                  <div>
                    <h3 className="font-medium">{stream.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {stream.channel_name}
                    </p>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => deleteStreamMutation.mutate(stream.id)}
                  disabled={deleteStreamMutation.isPending}
                >
                  {deleteStreamMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StreamManagement;