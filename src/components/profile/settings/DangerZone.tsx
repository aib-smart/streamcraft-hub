import { useState } from "react";
import { Trash, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const DangerZone = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmed) return;

    setLoading(true);
    toast({
      title: "Not implemented",
      description: "Account deletion is not yet implemented",
      variant: "destructive",
    });
    setLoading(false);
  };

  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-destructive">
          <Trash className="h-5 w-5" />
          Delete Account
        </CardTitle>
        <CardDescription>
          Permanently delete your account and all associated data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            This action cannot be undone. All your data will be permanently removed.
          </AlertDescription>
        </Alert>
        <Button
          variant="destructive"
          onClick={handleDeleteAccount}
          disabled={loading}
          className="w-full"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Delete Account
        </Button>
      </CardContent>
    </Card>
  );
};

export default DangerZone;