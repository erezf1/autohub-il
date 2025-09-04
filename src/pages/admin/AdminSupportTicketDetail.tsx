import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight, MessageSquare, User, Clock, CheckCircle, AlertTriangle, Send, FileText, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock ticket data
const mockTicketData = {
  id: "t789",
  subject: "דיווח על התנהגות לא הולמת",
  description: "המשתמש שלח הודעות לא הולמות ולא מקצועיות במהלך משא ומתן על רכב",
  reporter: {
    name: "שרה לוי",
    business: "לוי מוטורס",
    email: "sarah@levi-motors.co.il",
    phone: "054-123-4567",
    userId: "u123"
  },
  reportedUser: {
    name: "דני כהן", 
    business: "כהן אוטו",
    email: "danny@kohen-auto.co.il",
    phone: "052-987-6543",
    userId: "u456"
  },
  assignedRep: "יעל אדמיני",
  status: "in_progress",
  priority: "medium",
  category: "behavior",
  createdDate: "2024-01-08 14:30",
  lastUpdate: "2024-01-10 11:20",
  responseTime: "תוך 4 שעות",
  relatedDeal: {
    vehicleTitle: "טויוטה קמרי 2021",
    dealId: "d123",
    dealValue: 125000
  }
};

const mockMessages = [
  {
    id: "m1",
    sender: "שרה לוי",
    senderType: "reporter",
    message: "שלום, אני רוצה לדווח על התנהגות לא הולמת של המשתמש דני כהן במהלך המשא ומתן על הקמרי שלי.",
    timestamp: "2024-01-08 14:30",
    attachments: []
  },
  {
    id: "m2", 
    sender: "יעל אדמיני",
    senderType: "admin",
    message: "שלום שרה, תודה על הפנייה. אני בוחנת את הנושא ואחזור אליך בהקדם. האם יש לך צילומי מסך של השיחה?",
    timestamp: "2024-01-08 16:45",
    attachments: []
  },
  {
    id: "m3",
    sender: "שרה לוי", 
    senderType: "reporter",
    message: "כן, יש לי צילומי מסך. מצרפת אותם כאן.",
    timestamp: "2024-01-08 17:15",
    attachments: ["screenshot1.png", "screenshot2.png"]
  },
  {
    id: "m4",
    sender: "יעל אדמיני",
    senderType: "admin", 
    message: "תודה על החומר. בחנתי את השיחה המקורית ואכן היו הודעות לא הולמות. אני פונה לדני כהן לבירור.",
    timestamp: "2024-01-10 11:20",
    attachments: []
  }
];

const mockOriginalConversation = [
  { sender: "שרה לוי", message: "שלום, מעוניינת ברכב שלך", time: "14:20" },
  { sender: "דני כהן", message: "שלום, איזה מחיר את מציעה?", time: "14:22" },
  { sender: "שרה לוי", message: "אני יכולה להציע 120,000", time: "14:25" },
  { sender: "דני כהן", message: "זה מחיר מגוחך, בחייאת לא מבינה כלום ברכבים", time: "14:27" },
  { sender: "שרה לוי", message: "אין צורך להיות גס רוח", time: "14:30" },
  { sender: "דני כהן", message: "אני אגיד לך מה צריך, תלכי תלמדי קצת על רכבים ואז תחזרי", time: "14:32" }
];

const AdminSupportTicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState("");
  const [ticketStatus, setTicketStatus] = useState(mockTicketData.status);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-blue-500 text-white">פתוח</Badge>;
      case 'in_progress':
        return <Badge className="bg-warning text-warning-foreground"><Clock className="w-3 h-3 ml-1" />בטיפול</Badge>;
      case 'resolved':
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="w-3 h-3 ml-1" />נפתר</Badge>;
      case 'closed':
        return <Badge variant="outline">סגור</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 ml-1" />גבוהה</Badge>;
      case 'medium':
        return <Badge variant="secondary">בינונית</Badge>;
      case 'low':
        return <Badge variant="outline">נמוכה</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'behavior':
        return <Badge className="bg-orange-500 text-white">התנהגות</Badge>;
      case 'technical':
        return <Badge className="bg-blue-500 text-white">טכני</Badge>;
      case 'payment':
        return <Badge className="bg-green-500 text-white">תשלום</Badge>;
      case 'fraud':
        return <Badge className="bg-red-500 text-white">הונאה</Badge>;
      default:
        return <Badge variant="outline">{category}</Badge>;
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  const handleStatusChange = (newStatus: string) => {
    setTicketStatus(newStatus);
    console.log("Status changed to:", newStatus);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/admin/support')}
          className="hebrew-text"
        >
          <ArrowRight className="h-4 w-4 ml-1" />
          חזור לרשימת פניות
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold hebrew-text">{mockTicketData.subject}</h1>
          <p className="text-lg text-muted-foreground hebrew-text mt-1">פנייה #{mockTicketData.id}</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={ticketStatus} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open" className="hebrew-text">פתוח</SelectItem>
              <SelectItem value="in_progress" className="hebrew-text">בטיפול</SelectItem>
              <SelectItem value="resolved" className="hebrew-text">נפתר</SelectItem>
              <SelectItem value="closed" className="hebrew-text">סגור</SelectItem>
            </SelectContent>
          </Select>
          <Button className="hebrew-text">
            <Eye className="h-4 w-4 ml-2" />
            צפה בשיחה המקורית
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground hebrew-text">סטטוס</p>
                <div className="mt-2">
                  {getStatusBadge(ticketStatus)}
                </div>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground hebrew-text">עדיפות</p>
                <div className="mt-2">
                  {getPriorityBadge(mockTicketData.priority)}
                </div>
              </div>
              <AlertTriangle className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground hebrew-text">קטגוריה</p>
                <div className="mt-2">
                  {getCategoryBadge(mockTicketData.category)}
                </div>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground hebrew-text">נציג מטפל</p>
                <p className="text-lg font-bold hebrew-text">{mockTicketData.assignedRep}</p>
              </div>
              <User className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content - Two Panel Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Panel - Ticket Details and Chat */}
        <div className="xl:col-span-2 space-y-6">
          {/* Ticket Details */}
          <Card>
            <CardHeader>
              <CardTitle className="hebrew-text">פרטי הפנייה</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium hebrew-text mb-2">תיאור הבעיה</h4>
                  <p className="text-muted-foreground hebrew-text leading-relaxed">
                    {mockTicketData.description}
                  </p>
                </div>
                
                {mockTicketData.relatedDeal && (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium hebrew-text mb-2">עסקה קשורה</h4>
                    <div className="space-y-2">
                      <p className="text-sm"><span className="font-medium">רכב:</span> <span className="hebrew-text">{mockTicketData.relatedDeal.vehicleTitle}</span></p>
                      <p className="text-sm"><span className="font-medium">ערך עסקה:</span> ₪{mockTicketData.relatedDeal.dealValue.toLocaleString()}</p>
                      <p className="text-sm"><span className="font-medium">מזהה עסקה:</span> {mockTicketData.relatedDeal.dealId}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground hebrew-text">תאריך פתיחה:</span>
                    <p className="font-medium">{mockTicketData.createdDate}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground hebrew-text">עדכון אחרון:</span>
                    <p className="font-medium">{mockTicketData.lastUpdate}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chat with Reporter */}
          <Card>
            <CardHeader>
              <CardTitle className="hebrew-text">תקשורת עם המדווח</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {mockMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.senderType === 'admin' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.senderType === 'admin' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium hebrew-text">{message.sender}</span>
                        <span className="text-xs opacity-70">{message.timestamp}</span>
                      </div>
                      <p className="text-sm hebrew-text">{message.message}</p>
                      {message.attachments.length > 0 && (
                        <div className="mt-2">
                          {message.attachments.map((attachment, index) => (
                            <Badge key={index} variant="outline" className="text-xs mr-1">
                              {attachment}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Message Input */}
              <div className="mt-4 flex gap-2">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="הקלד הודעה..."
                  className="flex-1 hebrew-text"
                  rows={2}
                />
                <Button onClick={handleSendMessage} className="hebrew-text">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - User Details and Original Conversation */}
        <div className="space-y-6">
          {/* Reporter Details */}
          <Card>
            <CardHeader>
              <CardTitle className="hebrew-text">פרטי המדווח</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium hebrew-text">{mockTicketData.reporter.name}</p>
                    <p className="text-sm text-muted-foreground hebrew-text">{mockTicketData.reporter.business}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p><span className="text-muted-foreground">דוא"ל:</span> {mockTicketData.reporter.email}</p>
                  <p><span className="text-muted-foreground">טלפון:</span> {mockTicketData.reporter.phone}</p>
                </div>
                <Button variant="outline" className="w-full hebrew-text">
                  <User className="h-4 w-4 ml-2" />
                  צפה בפרופיל המלא
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Reported User Details */}
          <Card>
            <CardHeader>
              <CardTitle className="hebrew-text">המשתמש המדווח</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium hebrew-text">{mockTicketData.reportedUser.name}</p>
                    <p className="text-sm text-muted-foreground hebrew-text">{mockTicketData.reportedUser.business}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p><span className="text-muted-foreground">דוא"ל:</span> {mockTicketData.reportedUser.email}</p>
                  <p><span className="text-muted-foreground">טלפון:</span> {mockTicketData.reportedUser.phone}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 hebrew-text text-xs">
                    צפה בפרופיל
                  </Button>
                  <Button variant="destructive" className="flex-1 hebrew-text text-xs">
                    השהה משתמש
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Original Conversation Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="hebrew-text">השיחה המקורית</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto text-sm">
                {mockOriginalConversation.map((msg, index) => (
                  <div key={index} className="border-b pb-2">
                    <div className="flex justify-between items-start">
                      <span className="font-medium hebrew-text">{msg.sender}:</span>
                      <span className="text-xs text-muted-foreground">{msg.time}</span>
                    </div>
                    <p className="text-muted-foreground hebrew-text mt-1">{msg.message}</p>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 hebrew-text">
                <FileText className="h-4 w-4 ml-2" />
                צפה בשיחה המלאה
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminSupportTicketDetail;