import { useNavigate } from "react-router-dom";
import { GradientBorderContainer } from "@/components/ui/gradient-border-container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Car, MessageSquare, TrendingUp, Plus, FileText } from "lucide-react";
import { useDashboardStats } from "@/hooks/admin/useDashboardStats";
import { useAdminNotifications } from "@/hooks/admin/useAdminNotifications";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: notifications, isLoading: notificationsLoading } = useAdminNotifications();

  const handleStatsClick = (link: string, filter?: string) => {
    if (filter) {
      navigate(`${link}?status=${filter}`);
    } else {
      navigate(link);
    }
  };

  const handleNotificationClick = (notification: any) => {
    // Navigate based on related entity type
    if (notification.related_entity_type === 'user') {
      navigate(`/admin/users/${notification.related_entity_id}`);
    } else if (notification.related_entity_type === 'vehicle') {
      navigate(`/admin/vehicles/${notification.related_entity_id}`);
    } else if (notification.related_entity_type === 'auction') {
      navigate(`/admin/auctions/${notification.related_entity_id}`);
    } else if (notification.related_entity_type === 'support_ticket') {
      navigate(`/admin/support-tickets/${notification.related_entity_id}`);
    }
  };

  const getPriorityBadge = (priority: string) => {
    const variants: { [key: string]: "default" | "destructive" | "outline" | "secondary" } = {
      high: "destructive",
      medium: "secondary",
      low: "outline",
    };
    return <Badge variant={variants[priority] || "default"}>{priority}</Badge>;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <Users className="h-4 w-4" />;
      case 'vehicle':
        return <Car className="h-4 w-4" />;
      case 'auction':
        return <TrendingUp className="h-4 w-4" />;
      case 'support_ticket':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  // Get only the 5 most recent notifications
  const recentNotifications = notifications?.slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-background p-6" dir="rtl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">לוח בקרה</h1>
        <p className="text-muted-foreground">סקירה כללית של פעילות המערכת</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Users Stats */}
        {statsLoading ? (
          <Card className="p-6">
            <Skeleton className="h-32 w-full" />
          </Card>
        ) : (
          <GradientBorderContainer
            onClick={() => handleStatsClick("/admin/users")}
            className="cursor-pointer hover:scale-105 transition-transform"
          >
            <Card className="p-6 h-full">
              <div className="flex items-center justify-between mb-4">
                <Users className="h-8 w-8 text-primary" />
                <Badge variant="outline">{stats?.users.new || 0} חדשים</Badge>
              </div>
              <h3 className="text-2xl font-bold mb-2">{stats?.users.total || 0}</h3>
              <p className="text-muted-foreground mb-3">סוחרים רשומים</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatsClick("/admin/users", "pending");
                  }}
                >
                  ממתינים לאישור ({stats?.users.pending || 0})
                </Button>
              </div>
            </Card>
          </GradientBorderContainer>
        )}

        {/* Vehicles Stats */}
        {statsLoading ? (
          <Card className="p-6">
            <Skeleton className="h-32 w-full" />
          </Card>
        ) : (
          <GradientBorderContainer
            onClick={() => handleStatsClick("/admin/vehicles")}
            className="cursor-pointer hover:scale-105 transition-transform"
          >
            <Card className="p-6 h-full">
              <div className="flex items-center justify-between mb-4">
                <Car className="h-8 w-8 text-primary" />
                <Badge variant="outline">{stats?.vehicles.new || 0} חדשים</Badge>
              </div>
              <h3 className="text-2xl font-bold mb-2">{stats?.vehicles.total || 0}</h3>
              <p className="text-muted-foreground mb-3">רכבים פעילים</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/admin/vehicles?boosted=true");
                  }}
                >
                  מקודמים ({stats?.boosted.total || 0})
                </Button>
              </div>
            </Card>
          </GradientBorderContainer>
        )}

        {/* Support Tickets Stats */}
        {statsLoading ? (
          <Card className="p-6">
            <Skeleton className="h-32 w-full" />
          </Card>
        ) : (
          <GradientBorderContainer
            onClick={() => handleStatsClick("/admin/support-tickets")}
            className="cursor-pointer hover:scale-105 transition-transform"
          >
            <Card className="p-6 h-full">
              <div className="flex items-center justify-between mb-4">
                <MessageSquare className="h-8 w-8 text-primary" />
                <Badge variant="outline">{stats?.support.new || 0} חדשים</Badge>
              </div>
              <h3 className="text-2xl font-bold mb-2">{stats?.support.total || 0}</h3>
              <p className="text-muted-foreground mb-3">פניות תמיכה</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatsClick("/admin/support-tickets", "open");
                  }}
                >
                  פתוחות ({stats?.support.pending || 0})
                </Button>
              </div>
            </Card>
          </GradientBorderContainer>
        )}
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Notifications */}
        <GradientBorderContainer>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">התראות אחרונות</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/admin/notifications")}
              >
                צפה בהכל
              </Button>
            </div>
            <div className="space-y-4">
              {notificationsLoading ? (
                <>
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </>
              ) : recentNotifications.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">אין התראות חדשות</p>
              ) : (
                recentNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 rounded-lg border cursor-pointer hover:bg-accent transition-colors ${
                      !notification.is_read ? "bg-accent/50" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">
                          {getNotificationIcon(notification.related_entity_type || "default")}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-sm">{notification.title}</h3>
                            {!notification.is_read && (
                              <Badge variant="secondary" className="text-xs">חדש</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{notification.description}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {formatDistanceToNow(new Date(notification.created_at), {
                              addSuffix: true,
                              locale: ar,
                            })}
                          </p>
                        </div>
                      </div>
                      {getPriorityBadge(notification.priority)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </GradientBorderContainer>

        {/* Quick Actions */}
        <GradientBorderContainer>
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">פעולות מהירות</h2>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-24 flex flex-col gap-2"
                onClick={() => navigate("/admin/add-vehicle")}
              >
                <Plus className="h-6 w-6" />
                <span>הוסף רכב</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col gap-2"
                onClick={() => navigate("/admin/auctions/add")}
              >
                <TrendingUp className="h-6 w-6" />
                <span>צור מכרז</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col gap-2"
                onClick={() => navigate("/admin/reports")}
              >
                <FileText className="h-6 w-6" />
                <span>צפה בדוחות</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col gap-2"
                onClick={() => navigate("/admin/users")}
              >
                <Users className="h-6 w-6" />
                <span>נהל משתמשים</span>
              </Button>
            </div>
          </Card>
        </GradientBorderContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;
