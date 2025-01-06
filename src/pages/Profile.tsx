import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import ProfileHeader from "@/components/ProfileHeader";
import ProfileInformation from "@/components/profile/ProfileInformation";
import AccountSettings from "@/components/profile/AccountSettings";
import WatchHistory from "@/components/profile/WatchHistory";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    full_name: "",
    username: "",
    country: "",
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();
      setEditedProfile({
        full_name: data?.full_name || "",
        username: data?.username || "",
        country: data?.country || "",
      });
      return data;
    },
    enabled: !!user,
  });

  const { data: isPremium } = useQuery({
    queryKey: ["isPremium", user?.id],
    queryFn: async () => {
      // This is a placeholder. In a real app, you would check the user's premium status
      return false;
    },
    enabled: !!user,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updatedProfile: typeof editedProfile) => {
      const { error } = await supabase
        .from("profiles")
        .update(updatedProfile)
        .eq("id", user?.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating profile:", error);
    },
  });

  const handleEditToggle = () => {
    if (isEditing) {
      updateProfileMutation.mutate(editedProfile);
    } else {
      setIsEditing(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container py-8 fade-in">
      <div className="max-w-4xl mx-auto">
        <ProfileHeader profile={profile} isPremium={isPremium} />

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="settings">Account Settings</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileInformation
              profile={profile}
              isEditing={isEditing}
              editedProfile={editedProfile}
              setEditedProfile={setEditedProfile}
              handleEditToggle={handleEditToggle}
              updateProfileMutation={updateProfileMutation}
            />
          </TabsContent>

          <TabsContent value="settings">
            <AccountSettings />
          </TabsContent>

          <TabsContent value="history">
            <WatchHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;