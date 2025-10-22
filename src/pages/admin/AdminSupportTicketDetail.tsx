import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight, MessageSquare, User, Clock, CheckCircle, AlertTriangle, Send, FileText, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GradientBorderContainer } from "@/components/ui/gradient-border-container";

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
          className="hebrew-text btn-hover-cyan"
        >
          <ArrowRight className="h-4 w-4 ml-1" />
          חזור לרשימת פניות
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white hebrew-text">{mockTicketData.subject}</h1>
          <p className="text-lg text-white/70 hebrew-text mt-1">פנייה #{mockTicketData.id}</p>
        </div>
        <div className="flex items-center gap-3">
          <GradientBorderContainer className="rounded-md">
            <Select value={ticketStatus} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-40 border-0 bg-black rounded-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open" className="hebrew-text">פתוח</SelectItem>
                <SelectItem value="in_progress" className="hebrew-text">בטיפול</SelectItem>
                <SelectItem value="resolved" className="hebrew-text">נפתר</SelectItem>
                <SelectItem value="closed" className="hebrew-text">סגור</SelectItem>
              </SelectContent>
            </Select>
          </GradientBorderContainer>
          <Button className="hebrew-text btn-hover-cyan text-black">
            <Eye className="h-4 w-4 ml-2" />
            צפה בשיחה המקורית
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
        <GradientBorderContainer className="rounded-md">
          <Card className="bg-black border-0 rounded-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/70 hebrew-text">סטטוס</p>
                  <div className="mt-2">
                    {getStatusBadge(ticketStatus)}
                  </div>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </GradientBorderContainer>

        <GradientBorderContainer className="rounded-md">
          <Card className="bg-black border-0 rounded-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/70 hebrew-text">עדיפות</p>
                  <div className="mt-2">
                    {getPriorityBadge(mockTicketData.priority)}
                  </div>
                </div>
                <AlertTriangle className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </GradientBorderContainer>

        <GradientBorderContainer className="rounded-md">
          <Card className="bg-black border-0 rounded-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/70 hebrew-text">קטגוריה</p>
                  <div className="mt-2">
                    {getCategoryBadge(mockTicketData.category)}
                  </div>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </GradientBorderContainer>

        <GradientBorderContainer className="rounded-md">
          <Card className="bg-black border-0 rounded-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/70 hebrew-text">נציג מטפל</p>
                  <p className="text-lg font-bold text-white hebrew-text">{mockTicketData.assignedRep}</p>
                </div>
                <User className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </GradientBorderContainer>
      </div>

      {/* Main Content - Tabs Layout */}
      <Tabs defaultValue="main" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-gray-900" dir="rtl">
          <TabsTrigger value="chat-other" className="hebrew-text data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2277ee] data-[state=active]:to-[#5be1fd] data-[state=active]:text-black">צ'אט עם הצד השני</TabsTrigger>
          <TabsTrigger value="chat-reporter" className="hebrew-text data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2277ee] data-[state=active]:to-[#5be1fd] data-[state=active]:text-black">צ'אט עם מדווח</TabsTrigger>
          <TabsTrigger value="main" className="hebrew-text data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2277ee] data-[state=active]:to-[#5be1fd] data-[state=active]:text-black">פרטי הפנייה</TabsTrigger>
        </TabsList>

        <TabsContent value="main" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Main Content - Right Panel for RTL */}
            <div className="xl:col-span-2 xl:order-2 space-y-6">
              {/* Original Request */}
              <GradientBorderContainer className="rounded-md">
                <Card className="bg-black border-0 rounded-md">
                  <CardHeader>
                    <CardTitle className="text-white hebrew-text text-right">הבקשה המקורית</CardTitle>
                  </CardHeader>
                  <CardContent dir="rtl">
                    <div className="space-y-4 text-right">
                      <div>
                        <h4 className="font-medium text-white hebrew-text mb-2">תיאור הבעיה</h4>
                        <p className="text-white/70 hebrew-text leading-relaxed">
                          {mockTicketData.description}
                        </p>
                      </div>
                      
                      {mockTicketData.relatedDeal && (
                        <div className="bg-cyan-950/30 p-4 rounded-lg">
                          <h4 className="font-medium text-white hebrew-text mb-2">עסקה קשורה</h4>
                          <div className="space-y-2">
                            <p className="text-sm"><span className="text-white/70 hebrew-text">רכב:</span> <span className="font-medium text-white hebrew-text">{mockTicketData.relatedDeal.vehicleTitle}</span></p>
                            <p className="text-sm"><span className="text-white/70 hebrew-text">ערך עסקה:</span> <span className="font-medium text-white">₪{mockTicketData.relatedDeal.dealValue.toLocaleString()}</span></p>
                            <p className="text-sm"><span className="text-white/70 hebrew-text">מזהה עסקה:</span> <span className="font-medium text-white">{mockTicketData.relatedDeal.dealId}</span></p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </GradientBorderContainer>

              {/* Support Action Summary */}
              <GradientBorderContainer className="rounded-md">
                <Card className="bg-black border-0 rounded-md">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Button className="hebrew-text btn-hover-cyan text-black">
                        <FileText className="h-4 w-4 ml-2" />
                        שמור סיכום
                      </Button>
                      <CardTitle className="text-white hebrew-text">סיכום פעולות התמיכה</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <GradientBorderContainer className="rounded-md">
                        <Textarea
                          placeholder="תאר את הפעולות שננקטו, ההחלטות שהתקבלו והפתרון שניתן..."
                          className="min-h-32 hebrew-text text-right border-0 bg-black rounded-md"
                          dir="rtl"
                        />
                      </GradientBorderContainer>
                    </div>
                  </CardContent>
                </Card>
              </GradientBorderContainer>

              {/* Original Conversation */}
              <GradientBorderContainer className="rounded-md">
                <Card className="bg-black border-0 rounded-md">
                  <CardHeader>
                    <CardTitle className="text-white hebrew-text text-right">השיחה המקורית</CardTitle>
                  </CardHeader>
                  <CardContent dir="rtl">
                    <div className="space-y-2 max-h-64 overflow-y-auto text-sm text-right">
                      {mockOriginalConversation.map((msg, index) => (
                        <div key={index} className="border-b border-gray-800 pb-2">
                          <div className="flex justify-between items-start">
                            <span className="text-xs text-white/70">{msg.time}</span>
                            <span className="font-medium text-white hebrew-text">{msg.sender}:</span>
                          </div>
                          <p className="text-white/70 hebrew-text mt-1 text-right">{msg.message}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </GradientBorderContainer>
            </div>

            {/* User Details - Left Panel for RTL */}
            <div className="xl:order-1 space-y-6">
              {/* Reporter Details */}
              <GradientBorderContainer className="rounded-md">
                <Card className="bg-black border-0 rounded-md">
                  <CardHeader>
                    <CardTitle className="text-white hebrew-text text-right">פרטי המדווח</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 flex-row-reverse">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-white hebrew-text">{mockTicketData.reporter.name}</p>
                          <p className="text-sm text-white/70 hebrew-text">{mockTicketData.reporter.business}</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-right">
                        <p className="text-white"><span className="text-white/70">דוא"ל:</span> {mockTicketData.reporter.email}</p>
                        <p className="text-white"><span className="text-white/70">טלפון:</span> {mockTicketData.reporter.phone}</p>
                      </div>
                      <Button variant="outline" className="w-full hebrew-text btn-hover-cyan">
                        <User className="h-4 w-4 ml-2" />
                        צפה בפרופיל המלא
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </GradientBorderContainer>

              {/* Reported User Details */}
              <GradientBorderContainer className="rounded-md">
                <Card className="bg-black border-0 rounded-md">
                  <CardHeader>
                    <CardTitle className="text-white hebrew-text text-right">המשתמש המדווח</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 flex-row-reverse">
                        <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-white hebrew-text">{mockTicketData.reportedUser.name}</p>
                          <p className="text-sm text-white/70 hebrew-text">{mockTicketData.reportedUser.business}</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-right">
                        <p className="text-white"><span className="text-white/70">דוא"ל:</span> {mockTicketData.reportedUser.email}</p>
                        <p className="text-white"><span className="text-white/70">טלפון:</span> {mockTicketData.reportedUser.phone}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="destructive" className="flex-1 hebrew-text text-xs">
                          השהה משתמש
                        </Button>
                        <Button variant="outline" className="flex-1 hebrew-text text-xs btn-hover-cyan">
                          צפה בפרופיל
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </GradientBorderContainer>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="chat-reporter" className="space-y-6">
          <GradientBorderContainer className="rounded-md">
            <Card className="bg-black border-0 rounded-md">
              <CardHeader>
                <CardTitle className="text-white hebrew-text">תקשורת עם המדווח</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {mockMessages.map((message) => (
                    <div key={message.id} className={`flex ${message.senderType === 'admin' ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderType === 'admin' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-cyan-950/30 text-white'
                      }`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium hebrew-text">{message.sender}</span>
                          <span className="text-xs opacity-70">{message.timestamp}</span>
                        </div>
                        <p className="text-sm hebrew-text">{message.message}</p>
                        {message.attachments.length > 0 && (
                          <div className="mt-2">
                            {message.attachments.map((attachment, index) => (
                              <Badge key={index} variant="outline" className="text-xs ml-1">
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
                  <GradientBorderContainer className="flex-1 rounded-md">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="הקלד הודעה..."
                      className="hebrew-text border-0 bg-black rounded-md"
                      rows={2}
                    />
                  </GradientBorderContainer>
                  <Button onClick={handleSendMessage} className="hebrew-text">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </GradientBorderContainer>
        </TabsContent>

        <TabsContent value="chat-other" className="space-y-6">
          <GradientBorderContainer className="rounded-md">
            <Card className="bg-black border-0 rounded-md">
              <CardHeader>
                <CardTitle className="text-white hebrew-text">תקשורת עם הצד השני</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {/* Mock conversation with the other party */}
                  <div className="flex justify-end">
                    <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-cyan-950/30">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-white hebrew-text">דני כהן</span>
                        <span className="text-xs opacity-70 text-white">2024-01-10 16:00</span>
                      </div>
                      <p className="text-sm text-white hebrew-text">שלום, קיבלתי הודעה על דיווח. אני רוצה להסביר את המצב...</p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-primary text-primary-foreground">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium hebrew-text">יעל אדמיני</span>
                        <span className="text-xs opacity-70">2024-01-10 16:15</span>
                      </div>
                      <p className="text-sm hebrew-text">שלום דני, אני מקשיבה. אנא הסבר מה קרה מנקודת המבט שלך.</p>
                    </div>
                  </div>
                </div>
                
                {/* Message Input */}
                <div className="mt-4 flex gap-2">
                  <GradientBorderContainer className="flex-1 rounded-md">
                    <Textarea
                      placeholder="הקלד הודעה לצד השני..."
                      className="hebrew-text border-0 bg-black rounded-md"
                      rows={2}
                    />
                  </GradientBorderContainer>
                  <Button className="hebrew-text">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </GradientBorderContainer>
        </TabsContent>
      </Tabs>

    </div>
  );
};

export default AdminSupportTicketDetail;