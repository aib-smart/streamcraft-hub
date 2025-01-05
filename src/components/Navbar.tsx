import { Link, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { Button } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Shield, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tv } from 'lucide-react';

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation(); // Get the current location

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
  };

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/jstreamz" className="font-semibold text-md">
        <div className="flex h-6 w-6 items-center justify-center rounded-md">
                        <Tv className="size-4" />
                    </div>
          JStreamz
        </Link>

        <div className="flex items-center gap-4">
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
              <div className="flex items-center gap-3 mr-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback>
                    <UserRound className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  {profile?.full_name || profile?.username || "User"}
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Logout
              </Button>
            </>
          ) : (
            location.pathname !== "/auth" && (
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
