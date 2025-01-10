import { TableCell, TableRow } from "@/components/ui/table";
import { PresenceIndicator } from "./PresenceIndicator";
import { Profile } from "./types";

interface UserPresenceRowProps {
  user: {
    user_id: string;
    profiles: Profile;
  };
  isOnline: boolean;
}

export const UserPresenceRow = ({ user, isOnline }: UserPresenceRowProps) => (
  <TableRow key={user.user_id}>
    <TableCell>
      <div className="flex flex-col">
        <span className="font-medium">
          {user.profiles?.username || "No username"}
        </span>
        <span className="text-sm text-muted-foreground">
          {user.profiles?.full_name || "No name"}
        </span>
      </div>
    </TableCell>
    <TableCell>
      <PresenceIndicator isOnline={isOnline} />
    </TableCell>
    <TableCell>
      {isOnline ? "Currently Online" : "Not Available"}
    </TableCell>
  </TableRow>
);