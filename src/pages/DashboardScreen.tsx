import { useState } from "react";
import { Car, MessageCircle, FileText, TrendingUp, Users, Clock, Gavel } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Mock data for dashboard
const dashboardStats = {
  activeCars: 8,
  totalChats: 23,
  newMessages: 5,
  myBids: 3,
  newAuctions: 7,
  mySearches: 4,
  newOffers: 2,
  myCarOffers: 6
};

const recentActivity = [
  {
    id: 1,
    type: "chat",
    title: "הודעה חדשה",
    description: "סוחר #234 שלח הודעה על הטויוטה קמרי",
    subtitle: "זה עתה הגיע",
    time: "לפני 10 דקות",
    isNew: true
  },
  {
    id: 2,
    type: "request",
    title: "התאמה חדשה",
    description: "נמצאה התאמה לבקשת החיפוש שלך",
    subtitle: "BMW X3 2020",
    time: "לפני שעה",
    isNew: true
  },
  {
    id: 3,
    type: "auction",
    title: "הצעה חדשה",
    description: "הצעה חדשה התקבלה למכירה הפומבית",
    subtitle: "פורשה 911 - 750,000 ₪",
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
        <Card className="card-interactive" onClick={() => navigate("/chats")}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground hebrew-text">
              צ'אטים
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 space-x-reverse">
                <MessageCircle className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold text-foreground">
                  {dashboardStats.totalChats}
                </span>
              </div>
              <div className="text-xs text-muted-foreground hebrew-text">
                {dashboardStats.newMessages} חדשות
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-interactive" onClick={() => navigate("/auctions")}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground hebrew-text">
              מכירות פומביות
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Gavel className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold text-foreground">
                  {dashboardStats.myBids}
                </span>
              </div>
              <div className="text-xs text-muted-foreground hebrew-text">
                {dashboardStats.newAuctions} חדשות
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-interactive" onClick={() => navigate("/car-search-requests")}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground hebrew-text">
              חיפושי רכבים
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 space-x-reverse">
                <FileText className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold text-foreground">
                  {dashboardStats.mySearches}
                </span>
              </div>
              <div className="text-xs text-muted-foreground hebrew-text">
                {dashboardStats.newOffers} הצעות חדשות
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-interactive" onClick={() => navigate("/profile")}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground hebrew-text">
              הרכבים שלי
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Car className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold text-foreground">
                  {dashboardStats.activeCars}
                </span>
              </div>
              <div className="text-xs text-muted-foreground hebrew-text">
                {dashboardStats.myCarOffers} הצעות חדשות
              </div>
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
                {activity.type === "auction" && <Gavel className="h-4 w-4 text-primary" />}
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
                <p className="text-sm font-medium text-foreground hebrew-text">
                  {activity.subtitle}
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

    </div>
  );
};

export default DashboardScreen;