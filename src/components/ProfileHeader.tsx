import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { UserRound, Crown } from "lucide-react";
import { Badge } from "./ui/badge";

interface ProfileHeaderProps {
  profile: {
    full_name?: string | null;
    username?: string | null;
    avatar_url?: string | null;
  } | null;
  isPremium?: boolean;
}

const ProfileHeader = ({ profile, isPremium }: ProfileHeaderProps) => {
  return (
    <div className="flex items-center gap-6 mb-8">
      <Avatar className="h-20 w-20">
        <AvatarImage src={profile?.avatar_url} />
        <AvatarFallback>
          <UserRound className="h-12 w-12" />
        </AvatarFallback>
      </Avatar>
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">
            {profile?.full_name || "Your Name"}
          </h1>
          <Badge variant={isPremium ? "default" : "secondary"} className="flex items-center gap-1">
            {isPremium ? (
              <>
                <Crown className="h-3 w-3" />
                Premium
              </>
            ) : (
              "Free"
            )}
          </Badge>
        </div>
        <p className="text-muted-foreground">
          @{profile?.username || "username"}
        </p>
      </div>
    </div>
  );
};

export default ProfileHeader;