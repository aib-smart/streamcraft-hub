import NotificationSettings from "./settings/NotificationSettings";
import PasswordSettings from "./settings/PasswordSettings";
import WatchHistorySettings from "./settings/WatchHistorySettings";
import DangerZone from "./settings/DangerZone";

const AccountSettings = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
      <NotificationSettings />
      <PasswordSettings />
      <WatchHistorySettings />
      <DangerZone />
    </div>
  );
};

export default AccountSettings;