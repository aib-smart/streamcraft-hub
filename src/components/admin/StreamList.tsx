import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Loader2, Trash2, Pencil, X, Check } from "lucide-react";

interface Stream {
  id: string;
  title: string;
  description?: string;
  channel_name: string;
  thumbnail_url?: string;
  stream_url?: string;
}

interface StreamListProps {
  streams: Stream[];
}

const StreamList = ({ streams }: StreamListProps) => {
  const queryClient = useQueryClient();
  const [editingStream, setEditingStream] = useState<Stream | null>(null);

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

  const updateStreamMutation = useMutation({
    mutationFn: async (stream: Stream) => {
      const { error } = await supabase
        .from("streams")
        .update({
          title: stream.title,
          description: stream.description,
          channel_name: stream.channel_name,
          thumbnail_url: stream.thumbnail_url,
          stream_url: stream.stream_url,
        })
        .eq("id", stream.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["streams"] });
      setEditingStream(null);
      toast({
        title: "Success",
        description: "Stream updated successfully",
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

  const handleEdit = (stream: Stream) => {
    setEditingStream(stream);
  };

  const handleCancelEdit = () => {
    setEditingStream(null);
  };

  const handleSaveEdit = () => {
    if (editingStream) {
      updateStreamMutation.mutate(editingStream);
    }
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
              {editingStream?.id === stream.id ? (
                <div className="space-y-2">
                  <Input
                    value={editingStream.title}
                    onChange={(e) =>
                      setEditingStream({
                        ...editingStream,
                        title: e.target.value,
                      })
                    }
                    placeholder="Title"
                  />
                  <Input
                    value={editingStream.channel_name}
                    onChange={(e) =>
                      setEditingStream({
                        ...editingStream,
                        channel_name: e.target.value,
                      })
                    }
                    placeholder="Channel Name"
                  />
                  <Input
                    value={editingStream.thumbnail_url || ""}
                    onChange={(e) =>
                      setEditingStream({
                        ...editingStream,
                        thumbnail_url: e.target.value,
                      })
                    }
                    placeholder="Thumbnail URL"
                  />
                  <Input
                    value={editingStream.stream_url || ""}
                    onChange={(e) =>
                      setEditingStream({
                        ...editingStream,
                        stream_url: e.target.value,
                      })
                    }
                    placeholder="Stream URL"
                  />
                  <Textarea
                    value={editingStream.description || ""}
                    onChange={(e) =>
                      setEditingStream({
                        ...editingStream,
                        description: e.target.value,
                      })
                    }
                    placeholder="Description"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                      className="flex-1"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveEdit}
                      disabled={updateStreamMutation.isPending}
                      className="flex-1"
                    >
                      {updateStreamMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4 mr-2" />
                      )}
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-grow">
                    <h3 className="font-medium truncate">{stream.title}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {stream.channel_name}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(stream)}
                      className="flex-1"
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteStreamMutation.mutate(stream.id)}
                      disabled={deleteStreamMutation.isPending}
                      className="flex-1"
                    >
                      {deleteStreamMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 mr-2" />
                      )}
                      Delete
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StreamList;