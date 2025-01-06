import React from "react";
import Image from "@/components/Image";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
// import { Loader2 } from "lucide-react";

const Home = () => {
  const { data: featuredStreams, isLoading } = useQuery({
    queryKey: ["featuredStreams"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("streams")
        .select("*")
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="py-6 flex-grow">
      {/* Hero Section */}
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 xl:gap-16 items-center">
          {/* Left Column - Text Content */}
          <div>
            <h1 className="text-[22px] sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground mb-5 text-center md:text-left">
              A Better Streaming 'Xperience!
            </h1>
            <p className="mt-1 text-[15px] md:text-lg lg:text-xl text-muted-foreground text-center md:text-left mb-6">
              Hand-picked professional content, designed for everyone.
            </p>

            <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4">
              <Link to="/streams">
                <Button size="lg">
                  Browse Streams
                  <svg
                    className="ml-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column - Image Section */}
          <div className="relative w-full h-64 md:h-80 lg:h-[500px] rounded-md overflow-hidden">
            <Image
              className="w-full h-full object-cover rounded-md"
              src="https://images.unsplash.com/photo-1665686377065-08ba896d16fd"
              alt="Streaming Experience"
              loading="lazy"
            />
            <div className="absolute inset-0 -z-[1] bg-gradient-to-tr from-gray-200 via-white/0 to-white/0 size-full rounded-md mt-4 -mb-4 me-4 -ms-4 lg:mt-6 lg:-mb-6 lg:me-6 lg:-ms-6 dark:from-neutral-800 dark:via-neutral-900/0 dark:to-neutral-900/0"></div>
          </div>
        </div>
      </div>

      {/* Featured Streams Section */}
      {/* <div className="container mx-auto px-4 lg:px-8 mt-16">
        <h2 className="text-2xl font-bold mb-8">Featured Streams</h2>
        {isLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredStreams?.map((stream) => (
              <Link
                key={stream.id}
                to={`/stream/${stream.id}`}
                className="group relative overflow-hidden rounded-lg bg-card transition-all hover:shadow-lg"
              >
                <div className="aspect-video w-full overflow-hidden">
                  <Image
                    src={stream.thumbnail_url || "/placeholder.svg"}
                    alt={stream.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{stream.title}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {stream.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
        <div className="mt-8 text-center">
          <Link to="/streams">
            <Button variant="outline" size="lg">
              View All Streams
            </Button>
          </Link>
        </div>
      </div> */}
    </div>
  );
};

export default Home;