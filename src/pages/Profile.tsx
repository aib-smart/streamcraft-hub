import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, UserRound, Settings, History, PlayCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

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
        <div className="flex items-center gap-6 mb-8">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback>
              <UserRound className="h-12 w-12" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {profile?.full_name || "Your Name"}
            </h1>
            <p className="text-muted-foreground">
              @{profile?.username || "username"}
            </p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
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
                    <Settings className="mr-2 h-4 w-4" />
                  )}
                  {isEditing ? "Save Profile" : "Edit Profile"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Manage your account settings and preferences here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Watch History</CardTitle>
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;