import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, X, Play } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      navigate("/auth");
    }
  };

  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <Play className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold">JStreams</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {user ? (
              <>
                <Link to="/streams" className="text-foreground hover:text-primary px-3 py-2 rounded-md">
                  Streams
                </Link>
                <Link to="/profile" className="text-foreground hover:text-primary px-3 py-2 rounded-md">
                  Profile
                </Link>
                <Button variant="default" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <Button variant="default" onClick={() => navigate("/auth")}>
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-primary focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {user ? (
              <>
                <Link
                  to="/streams"
                  className="block px-3 py-2 rounded-md text-foreground hover:text-primary"
                >
                  Streams
                </Link>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-foreground hover:text-primary"
                >
                  Profile
                </Link>
                <Button variant="default" className="w-full mt-2" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                variant="default"
                className="w-full mt-2"
                onClick={() => navigate("/auth")}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;