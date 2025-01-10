import { cn } from "@/lib/utils";

interface PresenceIndicatorProps {
  isOnline: boolean;
}

export const PresenceIndicator = ({ isOnline }: PresenceIndicatorProps) => {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "h-2 w-2 rounded-full",
          isOnline ? "bg-green-500" : "bg-gray-300"
        )}
      />
      <span className="text-sm text-muted-foreground">
        {isOnline ? "Online" : "Offline"}
      </span>
    </div>
  );
};