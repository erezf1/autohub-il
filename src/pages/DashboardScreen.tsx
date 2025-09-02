import { useState } from "react";
import { Car, MessageCircle, FileText, TrendingUp, Users, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Mock data for dashboard
const dashboardStats = {
  activeCars: 8,
  totalChats: 23,
  activeRequests: 4,
  thisWeekSales: 2
};

const recentActivity = [
  {
    id: 1,
    type: "chat",
    title: "הודעה חדשה",
    description: "סוחר #234 שלח הודעה על הטויוטה קמרי",
    time: "לפני 10 דקות",
    isNew: true
  },
  {
    id: 2,
    type: "request",
    title: "התאמה חדשה",
    description: "נמצאה התאמה לבקשת החיפוש שלך - BMW X3",
    time: "לפני שעה",
    isNew: true
  },
  {
    id: 3,
    type: "sale",
    title: "מכירה הושלמה",
    description: "הונדה סיוויק 2019 נמכרה בהצלחה",
    time: "אתמול",
    isNew: false
  }
];

const DashboardScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground hebrew-text">
          ברוך הבא לאוטו-נט
        </h1>
        <p className="text-muted-foreground hebrew-text">
          פלטפורמת הסוחרים המובילה
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="card-interactive" onClick={() => navigate("/profile")}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground hebrew-text">
              רכבים פעילים
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Car className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold text-foreground">
                {dashboardStats.activeCars}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-interactive" onClick={() => navigate("/chats")}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground hebrew-text">
              צ'אטים פעילים
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center space-x-2 space-x-reverse">
              <MessageCircle className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold text-foreground">
                {dashboardStats.totalChats}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-interactive" onClick={() => navigate("/car-search-requests")}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground hebrew-text">
              בקשות חיפוש
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center space-x-2 space-x-reverse">
              <FileText className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold text-foreground">
                {dashboardStats.activeRequests}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-interactive">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground hebrew-text">
              מכירות השבוע
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center space-x-2 space-x-reverse">
              <TrendingUp className="h-5 w-5 text-success" />
              <span className="text-2xl font-bold text-foreground">
                {dashboardStats.thisWeekSales}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="hebrew-text text-foreground">פעילות אחרונה</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 space-x-reverse">
              <div className="flex-shrink-0 mt-1">
                {activity.type === "chat" && <MessageCircle className="h-4 w-4 text-primary" />}
                {activity.type === "request" && <FileText className="h-4 w-4 text-primary" />}
                {activity.type === "sale" && <TrendingUp className="h-4 w-4 text-success" />}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-foreground hebrew-text">
                    {activity.title}
                  </h4>
                  {activity.isNew && (
                    <Badge variant="destructive" className="text-xs">
                      חדש
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground hebrew-text">
                  {activity.description}
                </p>
                <div className="flex items-center mt-2">
                  <Clock className="h-3 w-3 text-muted-foreground ml-1" />
                  <span className="text-xs text-muted-foreground">
                    {activity.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          onClick={() => navigate("/add")}
          className="h-12 hebrew-text"
        >
          הוסף רכב חדש
        </Button>
        <Button 
          variant="outline"
          onClick={() => navigate("/car-search-requests")}
          className="h-12 hebrew-text"
        >
          צור בקשת חיפוש
        </Button>
      </div>
    </div>
  );
};

export default DashboardScreen;