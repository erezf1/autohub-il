import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, User, FileText, Car, Gavel, AlertTriangle, CheckCircle, Clock, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { GradientBorderContainer } from "@/components/ui/gradient-border-container";

// Mock notifications data
const mockNotifications = [
  {
    id: "n1",
    type: "user",
    icon: User,
    title: "משתמש חדש הצטרף",
    description: "אברהם כהן (כהן מוטורס) נרשם למערכת וממתין לאישור",
    timestamp: "2024-01-10 15:30",
    isRead: false,
    priority: "medium",
    relatedEntity: { type: "user", id: "u123" },
    category: "users"
  },
  {
    id: "n2",
    type: "report",
    icon: AlertTriangle,
    title: "דיווח חדש התקבל",
    description: "שרה לוי דיווחה על התנהגות לא הולמת של דני כהן",
    timestamp: "2024-01-10 14:20",
    isRead: false,
    priority: "high",
    relatedEntity: { type: "ticket", id: "t789" },
    category: "reports"
  },
  {
    id: "n3",
    type: "auction",
    icon: Gavel,
    title: "מכירה פומבית הסתיימה",
    description: "פורשה 911 2019 נמכרה תמורת ₪450,000 למשה לוי",
    timestamp: "2024-01-10 12:00",
    isRead: true,
    priority: "low",
    relatedEntity: { type: "auction", id: "a123" },
    category: "auctions"
  },
  {
    id: "n4",
    type: "vehicle",
    icon: Car,
    title: "רכב חדש נוסף",
    description: "BMW X5 2023 נוסף על ידי רונן אוטו",
    timestamp: "2024-01-10 11:45",
    isRead: true,
    priority: "low",
    relatedEntity: { type: "vehicle", id: "v456" },
    category: "vehicles"
  },
  {
    id: "n5",
    type: "system",
    icon: CheckCircle,
    title: "עדכון מערכת הושלם",
    description: "הגדרות האבטחה עודכנו בהצלחה",
    timestamp: "2024-01-10 10:30",
    isRead: true,
    priority: "low",
    relatedEntity: { type: "system", id: "sys1" },
    category: "system"
  },
  {
    id: "n6",
    type: "user",
    icon: User,
    title: "בקשת שחזור סיסמה",
    description: "יוסי גרין ביקש לשחזר את הסיסמה שלו",
    timestamp: "2024-01-10 09:15",
    isRead: false,
    priority: "medium",
    relatedEntity: { type: "user", id: "u789" },
    category: "users"
  },
  {
    id: "n7",
    type: "payment",
    icon: AlertTriangle,
    title: "תשלום נכשל",
    description: "תשלום עבור תוכנית פרימיום של משה מוטורס נכשל",
    timestamp: "2024-01-10 08:45",
    isRead: true,
    priority: "high",
    relatedEntity: { type: "payment", id: "p123" },
    category: "reports"
  },
  {
    id: "n8",
    type: "vehicle",
    icon: Car,
    title: "רכב הוסר מהמערכת",
    description: "טויוטה קמרי 2021 הוסר על ידי דוד לוי",
    timestamp: "2024-01-09 16:20",
    isRead: true,
    priority: "low",
    relatedEntity: { type: "vehicle", id: "v789" },
    category: "vehicles"
  },
  {
    id: "n9",
    type: "auction",
    icon: Gavel,
    title: "מכירה פומבית חדשה",
    description: "אאודי A4 2020 הוכנס למכירה פומבית על ידי רונן אוטו",
    timestamp: "2024-01-09 14:10",
    isRead: true,
    priority: "medium",
    relatedEntity: { type: "auction", id: "a456" },
    category: "auctions"
  },
  {
    id: "n10",
    type: "user",
    icon: User,
    title: "משתמש אושר",
    description: "חשבון של דני כהן (כהן אוטו) אושר בהצלחה",
    timestamp: "2024-01-09 13:30",
    isRead: true,
    priority: "low",
    relatedEntity: { type: "user", id: "u456" },
    category: "users"
  }
];

const AdminNotifications = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const getFilteredNotifications = () => {
    let filtered = mockNotifications;
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(notification =>
        notification.title.includes(searchTerm) ||
        notification.description.includes(searchTerm)
      );
    }
    
    // Filter by tab
    switch (activeTab) {
      case "unread":
        filtered = filtered.filter(n => !n.isRead);
        break;
      case "users":
        filtered = filtered.filter(n => n.category === "users");
        break;
      case "reports":
        filtered = filtered.filter(n => n.category === "reports");
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

  const getTypeIcon = (type: string, IconComponent: any) => {
    const iconColors = {
      user: "text-blue-500",
      report: "text-red-500",
      auction: "text-purple-500",
      vehicle: "text-green-500",
      system: "text-gray-500",
      payment: "text-orange-500"
    };
    
    return <IconComponent className={`h-5 w-5 ${iconColors[type as keyof typeof iconColors] || "text-gray-500"}`} />;
  };

  const handleNotificationClick = (notification: any) => {
    // Mark as read (in real app, this would update the backend)
    console.log("Marking as read:", notification.id);
    
    // Navigate to related entity
    const { relatedEntity } = notification;
    switch (relatedEntity.type) {
      case 'user':
        navigate(`/admin/users/${relatedEntity.id}`);
        break;
      case 'ticket':
        navigate(`/admin/support/${relatedEntity.id}`);
        break;
      case 'auction':
        navigate(`/admin/auctions/${relatedEntity.id}`);
        break;
      case 'vehicle':
        navigate(`/admin/vehicles/${relatedEntity.id}`);
        break;
      default:
        console.log("Unknown entity type:", relatedEntity.type);
    }
  };

  const markAllAsRead = () => {
    console.log("Marking all notifications as read");
    // In real app, this would update the backend
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
  const unreadCount = mockNotifications.filter(n => !n.isRead).length;

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
            {unreadCount} לא נקראו
          </Badge>
          <Button onClick={markAllAsRead} variant="outline" className="hebrew-text btn-hover-cyan">
            <CheckCircle className="h-4 w-4 ml-2" />
            סמן הכל כנקרא
          </Button>
        </div>
      </div>


      {/* Notifications Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-900">
          <TabsTrigger value="all" className="hebrew-text text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2277ee] data-[state=active]:to-[#5be1fd] data-[state=active]:text-black">
            הכל ({mockNotifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread" className="hebrew-text text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2277ee] data-[state=active]:to-[#5be1fd] data-[state=active]:text-black">
            לא נקראו ({unreadCount})
          </TabsTrigger>
          <TabsTrigger value="users" className="hebrew-text text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2277ee] data-[state=active]:to-[#5be1fd] data-[state=active]:text-black">
            משתמשים ({mockNotifications.filter(n => n.category === "users").length})
          </TabsTrigger>
          <TabsTrigger value="reports" className="hebrew-text text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2277ee] data-[state=active]:to-[#5be1fd] data-[state=active]:text-black">
            דיווחים ({mockNotifications.filter(n => n.category === "reports").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <GradientBorderContainer className="rounded-md">
            <Card className="bg-black border-0 rounded-md">
              <CardContent className="p-0">
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
                        className={`cursor-pointer hover:bg-muted/50 ${!notification.isRead ? 'bg-cyan-950/50' : ''}`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(notification.type, notification.icon)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className={`font-medium hebrew-text ${!notification.isRead ? 'text-white' : 'text-muted-foreground'}`}>
                              {notification.title}
                            </p>
                            <p className={`text-sm text-muted-foreground hebrew-text mt-1 ${!notification.isRead ? 'font-semibold' : ''}`}>
                              {notification.description}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getPriorityBadge(notification.priority)}
                        </TableCell>
                        <TableCell className="hebrew-text text-white">
                          <div className="flex flex-col">
                            <span className="text-sm">{formatTimeAgo(notification.timestamp)}</span>
                            <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {notification.isRead ? (
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
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          </GradientBorderContainer>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminNotifications;