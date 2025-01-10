import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserPresenceRow } from "./UserPresenceRow";
import { Profile } from "./types";

interface UserPresenceTableProps {
  users: Array<{
    user_id: string;
    profiles: Profile;
  }>;
  presenceState: Record<string, Array<{ user_id: string }>>;
}

export const UserPresenceTable = ({ users, presenceState }: UserPresenceTableProps) => {
  const isUserOnline = (userId: string) => {
    return Object.values(presenceState).some((presences) =>
      presences.some((presence) => presence.user_id === userId)
    );
  };

  return (
    <div className="rounded-md border mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Seen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <UserPresenceRow
              key={user.user_id}
              user={user}
              isOnline={isUserOnline(user.user_id)}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};