import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Play, Clock, Users } from "lucide-react";

const Streams = () => {
  const { data: streams, isLoading } = useQuery({
    queryKey: ["streams"],
    queryFn: async () => {
      // This is a placeholder query - you'll need to create a streams table
      const { data } = await supabase
        .from("streams")
        .select("*")
        .order("created_at", { ascending: false });
      return data || [];
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container py-8 fade-in">
      <h1 className="text-4xl font-bold mb-8">Browse Streams</h1>
      
      {/* Featured Stream */}
      <div className="mb-12 relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-500 to-blue-500">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Featured Stream</h2>
          <p className="text-lg mb-6 max-w-2xl">
            Join our most popular stream and experience amazing content curated just for you.
          </p>
          <Button size="lg" variant="secondary">
            <Play className="mr-2 h-4 w-4" /> Watch Now
          </Button>
        </div>
      </div>

      {/* Stream Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {["Tech Talk", "Nature Live", "Cooking Show", "Gaming Stream", "Music Live", "Art Studio"].map((stream) => (
          <Card key={stream} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{stream}</CardTitle>
              <CardDescription>Live now</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-md mb-4" />
              <div className="flex items-center text-sm text-muted-foreground gap-4">
                <span className="flex items-center">
                  <Users className="mr-1 h-4 w-4" />
                  1.2k viewers
                </span>
                <span className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  2h 15m
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Play className="mr-2 h-4 w-4" /> Join Stream
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Streams;