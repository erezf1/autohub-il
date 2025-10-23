import { Users, Car, Gavel, HelpCircle, TrendingUp, Clock, Activity, AlertTriangle, FileBarChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { GradientBorderContainer } from "@/components/ui/gradient-border-container";
import { GradientSeparator } from "@/components/ui/gradient-separator";
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
  },
  {
    title: "בוסטים פעילים",
    icon: TrendingUp,
    total: 45,
    new: 7,
    pending: 0,
    link: "/admin/vehicles?filter=boosted"
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
    <div className="space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground hebrew-text">דשבורד</h1>
            <p className="text-lg text-muted-foreground hebrew-text mt-2">מבט כללי על המערכת</p>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-success" />
            <span className="text-sm text-success hebrew-text">המערכת פעילה</span>
          </div>
        </div>

        {/* Stats Grid - Desktop Optimized */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-8">
          {statsData.map((stat) => (
            <GradientBorderContainer key={stat.title} className="rounded-md">
              <Card className="bg-black border-0 rounded-md cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between text-xl">
                    <span className="hebrew-text text-white">{stat.title}</span>
                    <stat.icon className="h-6 w-6 text-primary" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div 
                      className="text-4xl font-bold text-primary cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => handleStatsClick(stat.link)}
                    >
                      {stat.total.toLocaleString()}
                    </div>
                    
                    <GradientSeparator />
                    
                    <div className="flex items-center gap-6">
                      <div 
                        className="flex items-center gap-2 text-sm cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleStatsClick(stat.link, 'new')}
                      >
                        <TrendingUp className="h-4 w-4 text-success" />
                        <span className="text-success hebrew-text font-medium">{stat.new} חדשים</span>
                      </div>
                      
                      {stat.pending > 0 && (
                        <div 
                          className="flex items-center gap-2 text-sm cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => handleStatsClick(stat.link, 'pending')}
                        >
                          <Clock className="h-4 w-4 text-warning" />
                          <span className="text-warning hebrew-text font-medium">{stat.pending} ממתינים</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </GradientBorderContainer>
          ))}
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Recent Notifications - Larger Card */}
          <GradientBorderContainer className="rounded-md xl:col-span-2">
            <Card className="bg-black border-0 rounded-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl hebrew-text text-white">התראות אחרונות</CardTitle>
                  <Button variant="outline" className="hebrew-text btn-hover-cyan">
                    צפה בהכל
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentNotifications.map((notification, index) => (
                    <div key={notification.id}>
                      <div 
                        className="flex items-center justify-between p-4 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                        onClick={() => handleNotificationClick(notification.link)}
                      >
                        <div className="flex-1">
                          <p className="font-medium hebrew-text text-white">{notification.message}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <Badge variant="secondary" className="hebrew-text">
                              {notification.type === 'pending' && 'ממתין לאישור'}
                              {notification.type === 'report' && 'דיווח'}
                              {notification.type === 'auction' && 'מכירה פומבית'}
                              {notification.type === 'info' && 'מידע'}
                              {notification.type === 'system' && 'מערכת'}
                            </Badge>
                            <span className="text-sm text-muted-foreground hebrew-text">{notification.time}</span>
                          </div>
                        </div>
                      </div>
                      {index < recentNotifications.length - 1 && <GradientSeparator className="my-4" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </GradientBorderContainer>

          {/* Quick Actions */}
          <GradientBorderContainer className="rounded-md">
            <Card className="bg-black border-0 rounded-md">
              <CardHeader>
                <CardTitle className="text-xl hebrew-text text-white">פעולות מהירות</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hebrew-text btn-hover-cyan"
                    onClick={() => navigate('/admin/users')}
                  >
                    <Users className="ml-2 h-4 w-4" />
                    ניהול משתמשים
                  </Button>
                  <GradientSeparator />
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hebrew-text btn-hover-cyan"
                    onClick={() => navigate('/admin/vehicles')}
                  >
                    <Car className="ml-2 h-4 w-4" />
                    הוסף רכב חדש
                  </Button>
                  <GradientSeparator />
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hebrew-text btn-hover-cyan"
                    onClick={() => navigate('/admin/auctions')}
                  >
                    <Gavel className="ml-2 h-4 w-4" />
                    צור מכירה פומבית
                  </Button>
                  <GradientSeparator />
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hebrew-text btn-hover-cyan"
                    onClick={() => navigate('/admin/reports')}
                  >
                    <FileBarChart className="ml-2 h-4 w-4" />
                    צפה בדוחות
                  </Button>
                </div>
              </CardContent>
            </Card>
          </GradientBorderContainer>
        </div>
      </div>
  );
};

export default AdminDashboard;