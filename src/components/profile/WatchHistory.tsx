import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";

const WatchHistory = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Watch History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            "Tech Talk #45",
            "Nature Live: Forest Edition",
            "Cooking Show: Italian Night",
          ].map((stream) => (
            <div
              key={stream}
              className="flex items-center justify-between py-2 border-b"
            >
              <div className="flex items-center gap-4">
                <div className="w-32 h-20 bg-muted rounded" />
                <div>
                  <h3 className="font-medium">{stream}</h3>
                  <p className="text-sm text-muted-foreground">
                    Watched 2 days ago
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <PlayCircle className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WatchHistory;