import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, User, FileText, Car, Gavel, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GradientBorderContainer } from "@/components/ui/gradient-border-container";
import { useAdminNotifications, useAdminNotificationActions, useAdminUnreadCount } from "@/hooks/admin";
import { LoadingSpinner } from "@/components/common";
import { format } from "date-fns";
import type { AdminNotification } from "@/hooks/admin/useAdminNotifications";

const getNotificationRoute = (notification: AdminNotification) => {
  const { related_entity_type, related_entity_id } = notification;
  
  if (!related_entity_type || !related_entity_id) return null;
  
  switch (related_entity_type) {
    case 'user': return `/admin/users/${related_entity_id}`;
    case 'vehicle': return `/admin/vehicles/${related_entity_id}`;
    case 'auction': return `/admin/auctions/${related_entity_id}`;
    case 'ticket': return `/admin/support/${related_entity_id}`;
    default: return null;
  }
};

const getTypeIcon = (notificationType: string) => {
  if (notificationType.includes('user') || notificationType.includes('verification')) {
    return <User className="h-5 w-5 text-blue-500" />;
  }
  if (notificationType.includes('vehicle')) {
    return <Car className="h-5 w-5 text-green-500" />;
  }
  if (notificationType.includes('auction')) {
    return <Gavel className="h-5 w-5 text-purple-500" />;
  }
  if (notificationType.includes('report') || notificationType.includes('ticket')) {
    return <AlertTriangle className="h-5 w-5 text-red-500" />;
  }
  if (notificationType.includes('payment')) {
    return <FileText className="h-5 w-5 text-orange-500" />;
  }
  return <Bell className="h-5 w-5 text-gray-500" />;
};

const AdminNotifications = () => {
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();
  const { data: notifications, isLoading } = useAdminNotifications();
  const { data: unreadCount } = useAdminUnreadCount();
  const { markAsRead, markAllAsRead } = useAdminNotificationActions();

  if (isLoading) return <LoadingSpinner />;

  const getFilteredNotifications = () => {
    let filtered = notifications || [];
    
    switch (activeTab) {
      case "unread":
        filtered = filtered.filter(n => !n.is_read);
        break;
      case "users":
        filtered = filtered.filter(n => 
          n.notification_type.includes('user') || 
          n.notification_type.includes('verification')
        );
        break;
      case "reports":
        filtered = filtered.filter(n => 
          n.notification_type.includes('report') || 
          n.notification_type.includes('ticket')
        );
        break;
      default:
        break;
    }
    
    return filtered;
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">גבוהה</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="text-xs">בינונית</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-xs">נמוכה</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{priority}</Badge>;
    }
  };

  const handleNotificationClick = (notification: AdminNotification) => {
    if (!notification.is_read) {
      markAsRead.mutate(notification.id);
    }
    
    const route = getNotificationRoute(notification);
    if (route) {
      navigate(route);
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `לפני ${diffInMinutes} דקות`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `לפני ${hours} שעות`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `לפני ${days} ימים`;
    }
  };

  const filteredNotifications = getFilteredNotifications();
  const userNotifications = notifications?.filter(n => 
    n.notification_type.includes('user') || 
    n.notification_type.includes('verification')
  ).length || 0;
  
  const reportNotifications = notifications?.filter(n => 
    n.notification_type.includes('report') || 
    n.notification_type.includes('ticket')
  ).length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold hebrew-text text-white">עדכונים</h1>
          <p className="text-lg text-muted-foreground hebrew-text mt-1">
            התראות ועדכונים מהמערכת
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="hebrew-text">
            <Bell className="h-4 w-4 ml-1" />
            {unreadCount || 0} לא נקראו
          </Badge>
          <Button 
            onClick={() => markAllAsRead.mutate()} 
            variant="outline" 
            className="hebrew-text btn-hover-cyan"
            disabled={!unreadCount}
          >
            <CheckCircle className="h-4 w-4 ml-2" />
            סמן הכל כנקרא
          </Button>
        </div>
      </div>

      {/* Notifications Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-900">
          <TabsTrigger value="all" className="hebrew-text text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2277ee] data-[state=active]:to-[#5be1fd] data-[state=active]:text-black">
            הכל ({notifications?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="unread" className="hebrew-text text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2277ee] data-[state=active]:to-[#5be1fd] data-[state=active]:text-black">
            לא נקראו ({unreadCount || 0})
          </TabsTrigger>
          <TabsTrigger value="users" className="hebrew-text text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2277ee] data-[state=active]:to-[#5be1fd] data-[state=active]:text-black">
            משתמשים ({userNotifications})
          </TabsTrigger>
          <TabsTrigger value="reports" className="hebrew-text text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2277ee] data-[state=active]:to-[#5be1fd] data-[state=active]:text-black">
            דיווחים ({reportNotifications})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <GradientBorderContainer className="rounded-md">
            <div className="bg-black border-0 rounded-md">
              <div className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right hebrew-text text-white">סוג</TableHead>
                      <TableHead className="text-right hebrew-text text-white">תיאור</TableHead>
                      <TableHead className="text-right hebrew-text text-white">עדיפות</TableHead>
                      <TableHead className="text-right hebrew-text text-white">זמן</TableHead>
                      <TableHead className="text-right hebrew-text text-white">סטטוס</TableHead>
                      <TableHead className="text-right hebrew-text w-12 text-white"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredNotifications.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex flex-col items-center gap-2">
                            <Bell className="h-8 w-8 text-muted-foreground" />
                            <p className="text-muted-foreground hebrew-text">אין עדכונים להצגה</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredNotifications.map((notification) => (
                        <TableRow 
                          key={notification.id}
                          className={`cursor-pointer hover:bg-muted/50 ${!notification.is_read ? 'bg-cyan-950/50' : ''}`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getTypeIcon(notification.notification_type)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className={`font-medium hebrew-text ${!notification.is_read ? 'text-white' : 'text-muted-foreground'}`}>
                                {notification.title}
                              </p>
                              <p className={`text-sm text-muted-foreground hebrew-text mt-1 ${!notification.is_read ? 'font-semibold' : ''}`}>
                                {notification.description}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getPriorityBadge(notification.priority)}
                          </TableCell>
                          <TableCell className="hebrew-text text-white">
                            <div className="flex flex-col">
                              <span className="text-sm">{formatTimeAgo(notification.created_at)}</span>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(notification.created_at), 'dd/MM/yyyy HH:mm')}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {notification.is_read ? (
                              <Badge variant="outline" className="text-xs hebrew-text">
                                <CheckCircle className="w-3 h-3 ml-1" />
                                נקרא
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs hebrew-text">
                                <Clock className="w-3 h-3 ml-1" />
                                חדש
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-center">
                              {!notification.is_read && (
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </GradientBorderContainer>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminNotifications;
