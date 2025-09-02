import { FileText, Gavel, MessageCircle, Car, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

// Mock data for notifications
const notificationsByDate = {
  "היום": [
    {
      id: 1,
      type: "iso_match",
      icon: FileText,
      title: "התאמה חדשה לבקשתך",
      description: "טויוטה קורולה, 2020",
      isUnread: true,
      timestamp: "לפני 2 שעות"
    },
    {
      id: 2,
      type: "auction_bid",
      icon: Gavel,
      title: "הצעה חדשה במכירה פומבית",
      description: "פורשה 911 - הצעה של 445,000 ₪",
      isUnread: true,
      timestamp: "לפני 4 שעות"
    },
    {
      id: 3,
      type: "message",
      icon: MessageCircle,
      title: "הודעה חדשה",
      description: "סוחר #345 שלח לך הודעה",
      isUnread: false,
      timestamp: "לפני 6 שעות"
    }
  ],
  "אתמול": [
    {
      id: 4,
      type: "car_sold",
      icon: TrendingUp,
      title: "הרכב שלך נמכר!",
      description: "מזדה CX-5 2019 נמכרה בהצלחה",
      isUnread: false,
      timestamp: "אתמול 15:30"
    },
    {
      id: 5,
      type: "auction_ending",
      icon: Gavel,
      title: "מכירה פומבית מסתיימת בקרוב",
      description: "BMW X3 - נותרו 2 שעות",
      isUnread: false,
      timestamp: "אתמול 10:15"
    }
  ],
  "השבוע": [
    {
      id: 6,
      type: "iso_match",
      icon: FileText,
      title: "5 התאמות חדשות",
      description: "לבקשת חיפוש: רכבי יוקרה",
      isUnread: false,
      timestamp: "02/01/2024"
    }
  ]
};

const getIconColor = (type: string) => {
  switch (type) {
    case "iso_match":
      return "text-primary";
    case "auction_bid":
    case "auction_ending":
      return "text-auction";
    case "message":
      return "text-accent";
    case "car_sold":
      return "text-success";
    default:
      return "text-muted-foreground";
  }
};

const NotificationListScreen = () => {
  const navigate = useNavigate();

  const handleNotificationClick = (notification: any) => {
    // Navigate to relevant screen based on notification type
    switch (notification.type) {
      case "iso_match":
        navigate("/iso-requests");
        break;
      case "auction_bid":
      case "auction_ending":
        navigate("/auctions");
        break;
      case "message":
        navigate("/chats");
        break;
      case "car_sold":
        navigate("/profile");
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Screen Title */}
      <h1 className="text-2xl font-bold text-foreground hebrew-text">התראות</h1>
      
      {/* Notification Groups by Date */}
      {Object.entries(notificationsByDate).map(([date, notifications]) => (
        <div key={date} className="space-y-3">
          {/* Date Header */}
          <h2 className="text-lg font-semibold text-muted-foreground hebrew-text">
            {date}
          </h2>
          
          {/* Notifications for this date */}
          <div className="space-y-2">
            {notifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <Card 
                  key={notification.id}
                  className="card-interactive cursor-pointer"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3 space-x-reverse">
                      {/* Icon */}
                      <div className={`p-2 rounded-full bg-muted ${getIconColor(notification.type)}`}>
                        <Icon className="h-5 w-5" />
                      </div>

                      {/* Notification Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            {/* Title with unread indicator */}
                            <div className="flex items-center space-x-2 space-x-reverse mb-1">
                              <h3 className="font-semibold text-foreground hebrew-text">
                                {notification.title}
                              </h3>
                              {notification.isUnread && (
                                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                              )}
                            </div>
                            
                            {/* Description */}
                            <p className="text-sm text-muted-foreground hebrew-text">
                              {notification.description}
                            </p>
                          </div>

                          {/* Timestamp */}
                          <span className="text-xs text-muted-foreground flex-shrink-0 mr-2">
                            {notification.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationListScreen;