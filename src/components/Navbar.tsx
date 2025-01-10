import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { Button } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Shield, UserRound, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tv } from 'lucide-react';
import { ThemeToggle } from "./ThemeToggle";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const { data: isAdmin } = useQuery({
    queryKey: ["isAdmin", user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();
      return data?.role === "admin";
    },
    enabled: !!user,
  });

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from("profiles")
        .select("username, full_name, avatar_url")
        .eq("id", user.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/jstreamz" className="font-semibold text-lg flex items-center gap-3 hover:text-primary transition-colors">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white p-1">
            <Tv className="h-5 w-5" />
          </div>
          <span className="text-xl md:text-2xl text-foreground">JStreamz</span>
        </Link>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="ghost" size="sm">
                    <Shield className="h-4 w-4 mr-2" />
                    Admin
                  </Button>
                </Link>
              )}
              <HoverCard>
                <HoverCardTrigger asChild>
                  <button
                    onClick={handleProfileClick}
                    className="flex items-center gap-3 mr-2 hover:opacity-80 hover:bg-white/20 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url} />
                      <AvatarFallback>
                        <UserRound className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                      {profile?.full_name || profile?.username || "User"}
                    </div>
                  </button>
                </HoverCardTrigger>
                <HoverCardContent className="w-48">
                  <div className="space-y-2">
                    <button
                      onClick={handleProfileClick}
                      className="flex items-center gap-2 text-sm hover:text-primary transition-colors w-full text-left"
                    >
                      <UserRound className="h-4 w-4" />
                      Account Settings
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 text-sm text-destructive hover:text-destructive/80 transition-colors w-full text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </>
          ) : (
            location.pathname !== "/auth" && location.pathname !== "/" && (
              <Link to="/auth">
                <Button size="sm">Sign In</Button>
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
