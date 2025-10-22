import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Send, Paperclip, Phone, User } from "lucide-react";
import { SuperArrowsIcon } from "@/components/common/SuperArrowsIcon";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { GradientBorderContainer } from "@/components/ui/gradient-border-container";

// Mock data for chat messages
const mockMessages = [
  {
    id: 1,
    senderId: "other",
    senderName: "דוד כהן",
    message: "שלום, אני מעוניין ברכב הטויוטה קמרי שלך",
    timestamp: "14:30",
    isRead: true
  },
  {
    id: 2,
    senderId: "me",
    senderName: "אני",
    message: "שלום! כן, הרכב זמין. איזה מידע נוסף אתה צריך?",
    timestamp: "14:35",
    isRead: true
  },
  {
    id: 3,
    senderId: "other",
    senderName: "דוד כהן",
    message: "כמה קילומטרים יש על הרכב? ומה מצב המנוע?",
    timestamp: "14:40",
    isRead: true
  },
  {
    id: 4,
    senderId: "me",
    senderName: "אני",
    message: "120,000 ק״מ בדיוק, מנוע חדש החלפתי לפני 6 חודשים. יש לי את כל הטיפולים מהסוכנות",
    timestamp: "14:42",
    isRead: true
  },
  {
    id: 5,
    senderId: "other",
    senderName: "דוד כהן",
    message: "נשמע מעולה! אפשר לקבוע פגישה לראות את הרכב?",
    timestamp: "14:45",
    isRead: true
  }, 
  {
    id: 6,
    senderId: "me",
    senderName: "אני",
    message: "בוודאי! מתי נוח לך להיפגש?",
    timestamp: "14:47",
    isRead: true
  },
  {
    id: 7,
    senderId: "other",
    senderName: "דוד כהן",
    message: "מה דעתך על מחר בשעה 17:00?",
    timestamp: "14:50",
    isRead: true

  },
  {
    id: 8,
    senderId: "me",
    senderName: "אני",
    message: "מחר בשעה 17:00 מצוין. נתראה אז!",
    timestamp: "14:52",
    isRead: true
  },
  {
    id: 9,
    senderId: "other",
    senderName: "דוד כהן",
    message: "תודה רבה! להתראות מחר.",
    timestamp: "14:55",
    isRead: false
  }

];

// Mock chat info
const mockChatInfo = {
  id: "123",
  otherPartyName: "דוד כהן",
  otherPartyPhone: "050-1234567",
  chatSubject: "טויוטה קמרי 2020",
  vehicleId: "456",
  isOnline: true
};

const ChatDetailScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In real app, send message via API
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  const handleBackClick = () => {
    navigate("/mobile/chats");
  };

  return (
    <div className="fixed inset-0 top-16 left-0 right-0 bottom-16 flex flex-col" dir="rtl">
      <div className="container max-w-md mx-auto px-4 h-full flex flex-col">
        {/* Chat Header - Fixed */}
        <div className="flex-shrink-0 pt-4 pb-4">
          <GradientBorderContainer className="rounded-md">
            <Card className="bg-black border-0">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div 
                    onClick={handleBackClick}
                    className="h-6 w-6 cursor-pointer flex items-center justify-center transition-all duration-200 flex-shrink-0"
                  >
                    <SuperArrowsIcon className="h-full w-full hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] transition-all duration-200" />
                  </div>
                  
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {mockChatInfo.otherPartyName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <h2 className="font-semibold text-white hebrew-text">
                        {mockChatInfo.otherPartyName}
                      </h2>
                      {mockChatInfo.isOnline && (
                        <Badge variant="secondary" className="text-xs bg-success text-success-foreground">
                          מקוון
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-300 hebrew-text">
                      {mockChatInfo.chatSubject}
                    </p>
                  </div>

                  <Button variant="outline" size="icon" className="border-gray-600 text-white hover:bg-gray-800">
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </GradientBorderContainer>
        </div>

        {/* Messages Container - Scrollable Only */}
        <div className="flex-1 overflow-y-auto space-y-3 px-1">
          {mockMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.senderId === "me" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`max-w-[75%] p-3 rounded-lg ${
                  message.senderId === "me"
                    ? "bg-black border border-gray-700 text-white ml-auto"
                    : "bg-gray-800 border border-gray-600 text-white mr-auto"
                }`}
              >
                <p className="text-sm hebrew-text mb-1">
                  {message.message}
                </p>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs ${
                      message.senderId === "me"
                        ? "text-gray-300"
                        : "text-gray-400"
                    }`}
                  >
                    {message.timestamp}
                  </span>
                  {message.senderId === "me" && (
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                      <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input - Fixed at bottom */}
        <div className="flex-shrink-0 pt-4 pb-4">
          <GradientBorderContainer className="rounded-md">
            <Card className="bg-black border-0">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Button variant="outline" size="icon" className="border-gray-600 text-white hover:bg-gray-800">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  
                  <Input
                    placeholder="הקלד הודעה..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1 hebrew-text bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                    dir="rtl"
                  />
                  
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    size="icon"
                    className="hebrew-text"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </GradientBorderContainer>
        </div>
      </div>
    </div>
  );
};

export default ChatDetailScreen;