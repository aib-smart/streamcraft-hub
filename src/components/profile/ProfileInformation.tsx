import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Settings } from "lucide-react";

interface ProfileInformationProps {
  profile: any;
  isEditing: boolean;
  editedProfile: {
    full_name: string;
    username: string;
    country: string;
  };
  setEditedProfile: (profile: any) => void;
  handleEditToggle: () => void;
  updateProfileMutation: any;
}

const ProfileInformation = ({
  profile,
  isEditing,
  editedProfile,
  setEditedProfile,
  handleEditToggle,
  updateProfileMutation,
}: ProfileInformationProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Profile Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={isEditing ? editedProfile.full_name : profile?.full_name || ""}
              onChange={(e) =>
                setEditedProfile({
                  ...editedProfile,
                  full_name: e.target.value,
                })
              }
              readOnly={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={isEditing ? editedProfile.username : profile?.username || ""}
              onChange={(e) =>
                setEditedProfile({
                  ...editedProfile,
                  username: e.target.value,
                })
              }
              readOnly={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={isEditing ? editedProfile.country : profile?.country || ""}
              onChange={(e) =>
                setEditedProfile({
                  ...editedProfile,
                  country: e.target.value,
                })
              }
              readOnly={!isEditing}
            />
          </div>
        </div>
        <Button
          variant="outline"
          className="mt-4"
          onClick={handleEditToggle}
          disabled={updateProfileMutation.isPending}
        >
          {updateProfileMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Settings className="h-4 w-4 mr-2" />
          )}
          {isEditing ? "Save Profile" : "Edit Profile"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfileInformation;