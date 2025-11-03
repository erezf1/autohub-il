import { 
  FileText, Gavel, MessageCircle, Car, TrendingUp, 
  Bell, UserCheck, UserX, Ban, AlertCircle, Trash2, Eye
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GradientBorderContainer } from "@/components/ui/gradient-border-container";
import { LoadingSpinner } from "@/components/common";
import { useNavigate } from "react-router-dom";
import { useNotifications, useNotificationActions } from "@/hooks/mobile";
import { format, isToday, isYesterday, isThisWeek } from "date-fns";
import { he } from "date-fns/locale";

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "registration_approved": return UserCheck;
    case "registration_rejected": return UserX;
    case "account_suspended": return Ban;
    case "subscription_expiring": return AlertCircle;
    case "auction_outbid":
    case "auction_won":
    case "auction_ending_soon": return Gavel;
    case "iso_offer_received": return FileText;
    case "contact_details_requested":
    case "contact_details_revealed": return MessageCircle;
    case "vehicle_deleted": return Trash2;
    default: return Bell;
  }
};

const getIconColor = (type: string) => {
  switch (type) {
    case "registration_approved": return "text-green-400";
    case "registration_rejected":
    case "account_suspended": return "text-red-400";
    case "subscription_expiring":
    case "auction_ending_soon": return "text-orange-400";
    case "auction_won": return "text-emerald-400";
    case "auction_outbid": return "text-yellow-400";
    case "iso_offer_received": return "text-blue-400";
    case "contact_details_requested":
    case "contact_details_revealed": return "text-purple-400";
    case "vehicle_deleted": return "text-red-400";
    default: return "text-gray-400";
  }
};

const groupNotificationsByDate = (notifications: any[]) => {
  const groups: { [key: string]: any[] } = {
    "היום": [],
    "אתמול": [],
    "השבוע": [],
    "קודם": []
  };

  notifications.forEach(notification => {
    const date = new Date(notification.created_at);
    if (isToday(date)) {
      groups["היום"].push(notification);
    } else if (isYesterday(date)) {
      groups["אתמול"].push(notification);
    } else if (isThisWeek(date)) {
      groups["השבוע"].push(notification);
    } else {
      groups["קודם"].push(notification);
    }
  });

  // Remove empty groups
  Object.keys(groups).forEach(key => {
    if (groups[key].length === 0) {
      delete groups[key];
    }
  });

  return groups;
};

const NotificationListScreen = () => {
  const navigate = useNavigate();
  const { data: notifications, isLoading, error } = useNotifications();
  const { markAsRead, markAllAsRead } = useNotificationActions();

  const handleNotificationClick = (notification: any) => {
    // Mark as read
    if (!notification.is_read) {
      markAsRead.mutate(notification.id);
    }

    // Navigate based on action_url
    if (notification.action_url) {
      navigate(notification.action_url);
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400 hebrew-text">שגיאה בטעינת ההתראות</p>
      </div>
    );
  }

  const groupedNotifications = groupNotificationsByDate(notifications || []);

  return (
    <div className="space-y-6">
      {/* Screen Title and Actions */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground hebrew-text">התראות</h1>
        {notifications && notifications.some(n => !n.is_read) && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleMarkAllAsRead}
            className="hebrew-text"
          >
            <Eye className="h-4 w-4 ml-2" />
            סמן הכל כנקרא
          </Button>
        )}
      </div>

      {/* Empty State */}
      {(!notifications || notifications.length === 0) && (
        <div className="text-center py-12">
          <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground hebrew-text">אין התראות להציג</p>
        </div>
      )}
      
      {/* Notification Groups by Date */}
      {Object.entries(groupedNotifications).map(([date, notificationGroup]) => (
        <div key={date} className="space-y-3">
          {/* Date Header */}
          <h2 className="text-lg font-semibold text-muted-foreground hebrew-text">
            {date}
          </h2>
          
          {/* Notifications for this date */}
          <div className="space-y-2">
            {notificationGroup.map((notification) => {
              const Icon = getNotificationIcon(notification.notification_type);
              return (
                <GradientBorderContainer
                  key={notification.id}
         
                  className="rounded-md"
                >
                  <Card 
                    className="card-interactive cursor-pointer bg-black border-0"
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3 space-x-reverse">
                        {/* Icon */}
                        <div className={`p-2 rounded-full bg-gray-800 ${getIconColor(notification.notification_type)}`}>
                          <Icon className="h-5 w-5" />
                        </div>

                        {/* Notification Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              {/* Title with unread indicator */}
                              <div className="flex items-center space-x-2 space-x-reverse mb-1">
                                <h3 className="font-semibold text-white hebrew-text">
                                  {notification.title}
                                </h3>
                                {!notification.is_read && (
                                  <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0" />
                                )}
                              </div>
                              
                              {/* Description */}
                              <p className="text-sm text-gray-300 hebrew-text">
                                {notification.description}
                              </p>
                            </div>

                            {/* Timestamp */}
                            <span className="text-xs text-gray-400 flex-shrink-0 mr-2">
                              {format(new Date(notification.created_at), 'HH:mm', { locale: he })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </GradientBorderContainer>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationListScreen;