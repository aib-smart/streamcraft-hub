import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Loader2 } from "lucide-react";

const StreamForm = () => {
  const queryClient = useQueryClient();
  const [newStream, setNewStream] = useState({
    title: "",
    description: "",
    stream_url: "",
    channel_name: "",
    thumbnail_url: "",
  });

  const addStreamMutation = useMutation({
    mutationFn: async (streamData: typeof newStream) => {
      const { data, error } = await supabase.from("streams").insert([streamData]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["streams"] });
      setNewStream({ title: "", description: "", stream_url: "", channel_name: "", thumbnail_url: "" });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addStreamMutation.mutate(newStream);
  };

  return (
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
            <label htmlFor="thumbnail" className="text-sm font-medium">
              Thumbnail URL
            </label>
            <Input
              id="thumbnail"
              value={newStream.thumbnail_url}
              onChange={(e) =>
                setNewStream({ ...newStream, thumbnail_url: e.target.value })
              }
              placeholder="https://example.com/thumbnail.jpg"
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
  );
};

export default StreamForm;