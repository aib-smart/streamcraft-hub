import { Bell } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useNotificationSettings } from "@/hooks/useNotificationSettings";

const NotificationSettings = () => {
  const { settings, updateSettings } = useNotificationSettings();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bell className="h-5 w-5 text-primary" />
          Notification Preferences
        </CardTitle>
        <CardDescription>
          Manage how you want to receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
              <span>Email notifications</span>
              <span className="font-normal text-sm text-muted-foreground">
                Receive updates about your account activity
              </span>
            </Label>
            <Switch
              id="email-notifications"
              checked={settings?.email_notifications ?? true}
              onCheckedChange={(checked) =>
                updateSettings.mutate({ email_notifications: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
              <span>Push notifications</span>
              <span className="font-normal text-sm text-muted-foreground">
                Receive push notifications in the browser
              </span>
            </Label>
            <Switch
              id="push-notifications"
              checked={settings?.push_notifications ?? true}
              onCheckedChange={(checked) =>
                updateSettings.mutate({ push_notifications: checked })
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;