import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="fade-in">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
              A Better Streaming <span className="text-primary">'Xperience!</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Hand-picked professional content, designed for everyone.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg">
                <Link to="/streams">Get Started</Link>
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
            {['Nature Live', 'Tech Talk', 'Cooking TV'].map((stream) => (
              <div key={stream} className="bg-card rounded-lg shadow-lg overflow-hidden">
                <div className="aspect-video bg-muted" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{stream}</h3>
                  <p className="text-muted-foreground mb-4">
                    Experience amazing content from our curated collection.
                  </p>
                  <Button className="w-full">Watch Now</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;