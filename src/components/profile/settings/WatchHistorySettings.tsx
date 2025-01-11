import { CreditCard, ShieldAlert } from "lucide-react";
import { useWatchHistory } from "@/hooks/useWatchHistory";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const WatchHistorySettings = () => {
  const { clearHistory } = useWatchHistory();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <CreditCard className="h-5 w-5 text-primary" />
          Watch History
        </CardTitle>
        <CardDescription>
          Manage your watch history and preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Watch History</AlertTitle>
          <AlertDescription>
            Clear your watch history to remove all watched content records
          </AlertDescription>
        </Alert>
        <Button
          variant="outline"
          onClick={() => clearHistory.mutate()}
          className="w-full"
        >
          Clear Watch History
        </Button>
      </CardContent>
    </Card>
  );
};

export default WatchHistorySettings;