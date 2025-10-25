import { Car, MessageCircle, FileText, Gavel, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useDashboardStats } from "@/hooks/mobile/useDashboardStats";
import { useProfile } from "@/hooks/mobile/useProfile";
import { GradientBorderContainer } from "@/components/ui/gradient-border-container";

const DashboardScreen = () => {
  const navigate = useNavigate();
  const { data: stats, isLoading } = useDashboardStats();
  const { profile, userStatus } = useProfile();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show pending approval message if user is not active
  if (userStatus === 'pending') {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4 py-12">
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <MessageCircle className="h-8 w-8 text-yellow-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground hebrew-text">
            בקשת ההרשמה שלך ממתינה לאישור
          </h1>
          <p className="text-muted-foreground hebrew-text max-w-md mx-auto">
            צוות ההנהלה בוחן את פרטיך. תקבל הודעה ברגע שהחשבון יאושר.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground hebrew-text">
          ברוך הבא {profile?.full_name ? `, ${profile.full_name}` : ''}
        </h1>
        <p className="text-muted-foreground hebrew-text">
          {profile?.business_name || 'פלטפורמת הסוחרים המובילה'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <GradientBorderContainer
          className="rounded-md flex-1"
        >
          <Card className="card-interactive border-0 bg-black rounded-md" onClick={() => navigate("/mobile/chats")}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white hebrew-text">
                צ'אטים
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold text-white">
                    {stats?.totalChats || 0}
                  </span>
                </div>
                {stats?.newMessages ? (
                  <div className="text-xs text-white hebrew-text">
                    {stats.newMessages} חדשות
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </GradientBorderContainer>

        <GradientBorderContainer
          className="rounded-md flex-1"
        >
          <Card className="card-interactive border-0 bg-black rounded-md" onClick={() => navigate("/mobile/auctions")}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white hebrew-text">
                מכירות פומביות
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Gavel className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold text-white">
                    {stats?.myBids || 0}
                  </span>
                </div>
                {stats?.newAuctions ? (
                  <div className="text-xs text-white hebrew-text">
                    {stats.newAuctions} חדשות
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </GradientBorderContainer>

        <GradientBorderContainer
          className="rounded-md flex-1"
        >
          <Card className="card-interactive border-0 bg-black rounded-md" onClick={() => navigate("/mobile/required-cars")}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white hebrew-text">
                חיפושי רכבים
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold text-white">
                    {stats?.mySearches || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </GradientBorderContainer>

        <GradientBorderContainer
          className="rounded-md flex-1"
        >
          <Card className="card-interactive border-0 bg-black rounded-md" onClick={() => navigate("/mobile/my-vehicles")}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white hebrew-text">
                הרכבים שלי
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Car className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold text-white">
                    {stats?.activeCars || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </GradientBorderContainer>
      </div>
    </div>
  );
};

export default DashboardScreen;