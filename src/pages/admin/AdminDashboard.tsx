import { Users, Car, Gavel, HelpCircle, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const statsData = [
  {
    title: "משתמשים",
    icon: Users,
    total: 2456,
    new: 12,
    pending: 5,
    link: "/admin/users"
  },
  {
    title: "רכבים",
    icon: Car,
    total: 8934,
    new: 34,
    pending: 0,
    link: "/admin/vehicles"
  },
  {
    title: "מכירות פומביות",
    icon: Gavel,
    total: 156,
    new: 8,
    pending: 0,
    link: "/admin/auctions"
  },
  {
    title: "פניות תמיכה",
    icon: HelpCircle,
    total: 89,
    new: 15,
    pending: 23,
    link: "/admin/support"
  }
];

const recentNotifications = [
  {
    id: 1,
    message: "סוחר חדש 'אוטו גל' ממתין לאישור",
    time: "לפני 5 דקות",
    type: "pending",
    link: "/admin/users/pending"
  },
  {
    id: 2,
    message: "דיווח חדש נגד סוחר #345",
    time: "לפני 12 דקות", 
    type: "report",
    link: "/admin/support/345"
  },
  {
    id: 3,
    message: "מכירה פומבית 'פורשה 911 2022' הסתיימה",
    time: "לפני 23 דקות",
    type: "auction",
    link: "/admin/auctions/123"
  },
  {
    id: 4,
    message: "35 רישומים חדשים היום",
    time: "לפני שעה",
    type: "info",
    link: "/admin/users"
  },
  {
    id: 5,
    message: "עדכון הגדרות מערכת בוצע",
    time: "לפני שעתיים",
    type: "system",
    link: "/admin/settings"
  }
];

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleStatsClick = (link: string, filter?: string) => {
    if (filter) {
      navigate(`${link}?filter=${filter}`);
    } else {
      navigate(link);
    }
  };

  const handleNotificationClick = (link: string) => {
    navigate(link);
  };

  return (
    <div className="space-y-6 min-h-full">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-foreground hebrew-text">דשבורד</h1>
        <p className="text-muted-foreground hebrew-text mt-1">מבט כללי על המערכת</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat) => (
          <Card key={stat.title} className="card-interactive cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-lg">
                <span className="hebrew-text">{stat.title}</span>
                <stat.icon className="h-5 w-5 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div 
                  className="text-2xl font-bold text-primary cursor-pointer hover:underline"
                  onClick={() => handleStatsClick(stat.link)}
                >
                  {stat.total.toLocaleString()}
                </div>
                
                <div className="flex items-center gap-4">
                  <div 
                    className="flex items-center gap-1 text-sm cursor-pointer hover:underline"
                    onClick={() => handleStatsClick(stat.link, 'new')}
                  >
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-green-500 hebrew-text">{stat.new} חדשים</span>
                  </div>
                  
                  {stat.pending > 0 && (
                    <div 
                      className="flex items-center gap-1 text-sm cursor-pointer hover:underline"
                      onClick={() => handleStatsClick(stat.link, 'pending')}
                    >
                      <Clock className="h-3 w-3 text-orange-500" />
                      <span className="text-orange-500 hebrew-text">{stat.pending} ממתינים</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="hebrew-text">התראות אחרונות</CardTitle>
            <Button variant="outline" size="sm" className="hebrew-text">
              צפה בהכל
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentNotifications.map((notification) => (
              <div 
                key={notification.id}
                className="flex items-center justify-between p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => handleNotificationClick(notification.link)}
              >
                <div className="flex-1">
                  <p className="text-sm font-medium hebrew-text">{notification.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {notification.type === 'pending' && 'ממתין לאישור'}
                      {notification.type === 'report' && 'דיווח'}
                      {notification.type === 'auction' && 'מכירה פומבית'}
                      {notification.type === 'info' && 'מידע'}
                      {notification.type === 'system' && 'מערכת'}
                    </Badge>
                    <span className="text-xs text-muted-foreground hebrew-text">{notification.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;