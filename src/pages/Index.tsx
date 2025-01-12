import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { data: streams, isLoading, error } = useQuery({
    queryKey: ["streams"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("streams")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw new Error(error.message);
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

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-red-500">
        <p>Error loading streams: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
              A Better Streaming <span className="text-primary">'Xperience!</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Hand-picked professional content, designed for everyone.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg">
                <Link to="/streams">Explore</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Streams</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {streams.length > 0 ? (
              streams.map((stream) => (
                <div key={stream.id} className="bg-card rounded-lg shadow-lg overflow-hidden">
                  <div className="aspect-video bg-muted" />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{stream.title}</h3>
                    <p className="text-muted-foreground mb-4">
                      Experience amazing content from our curated collection.
                    </p>
                    <p className="text-lg font-semibold text-primary mb-4">Free</p>
                    <Link to={`/streams/${stream.id}`}>
                      <Button className="w-full">Watch Now</Button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p>No streams available at the moment.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;