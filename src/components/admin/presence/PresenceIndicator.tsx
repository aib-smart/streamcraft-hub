import { Badge } from "@/components/ui/badge";

interface PresenceIndicatorProps {
  isOnline: boolean;
}

export const PresenceIndicator = ({ isOnline }: PresenceIndicatorProps) => (
  <Badge variant={isOnline ? "success" : "secondary"}>
    {isOnline ? "Online" : "Offline"}
  </Badge>
);