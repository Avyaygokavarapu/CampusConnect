import { AppLayout } from "@/components/layout/AppLayout";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Profile() {
  const { user, logoutMutation } = useUser();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (!user) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
          <p className="text-muted-foreground">Please log in to view your profile.</p>
          <Button onClick={() => window.location.href = "/login"}>Log In</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <Avatar className="h-16 w-16">
              <AvatarImage src={`https://avatar.vercel.sh/${user.username}`} />
              <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <CardTitle className="text-2xl">{user.username}</CardTitle>
              <span className="text-muted-foreground text-sm">{user.email}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col p-4 bg-secondary/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Joined</span>
                <span className="font-medium">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
              <div className="flex flex-col p-4 bg-secondary/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="font-medium text-green-600">Active</span>
              </div>
            </div>
            
            <Button 
              variant="destructive" 
              className="w-full flex items-center gap-2 mt-6"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="w-4 h-4" />
              {logoutMutation.isPending ? "Logging out..." : "Logout"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
