import { TableCell, TableRow } from "@/components/ui/table";
import { Database } from "@/integrations/supabase/types";
import { format } from "date-fns";
import { PresenceIndicator } from "./PresenceIndicator";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface UserPresenceRowProps {
  user: {
    user_id: string;
    profiles: Profile;
  };
  isOnline: boolean;
}

export const UserPresenceRow = ({ user, isOnline }: UserPresenceRowProps) => {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2">
          <span>{user.profiles.username || "Anonymous"}</span>
        </div>
      </TableCell>
      <TableCell>
        <PresenceIndicator isOnline={isOnline} />
      </TableCell>
      <TableCell className="text-muted-foreground">
        {format(new Date(), "PPp")}
      </TableCell>
    </TableRow>
  );
};