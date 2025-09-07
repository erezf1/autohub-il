import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight, Send, Paperclip, Phone, User } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

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
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Chat Header */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3 space-x-reverse">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackClick}
              className="flex-shrink-0"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
            
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {mockChatInfo.otherPartyName.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 space-x-reverse">
                <h2 className="font-semibold text-foreground hebrew-text">
                  {mockChatInfo.otherPartyName}
                </h2>
                {mockChatInfo.isOnline && (
                  <Badge variant="secondary" className="text-xs bg-success text-success-foreground">
                    מקוון
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground hebrew-text">
                {mockChatInfo.chatSubject}
              </p>
            </div>

            <Button variant="outline" size="icon">
              <Phone className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
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
                  ? "bg-primary text-primary-foreground ml-auto"
                  : "bg-card border mr-auto"
              }`}
            >
              <p className="text-sm hebrew-text mb-1">
                {message.message}
              </p>
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs ${
                    message.senderId === "me"
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  }`}
                >
                  {message.timestamp}
                </span>
                {message.senderId === "me" && (
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-primary-foreground/70 rounded-full"></div>
                    <div className="w-1 h-1 bg-primary-foreground/70 rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <Card>
        <CardContent className="p-3">
          <div className="flex items-center space-x-2 space-x-reverse">
            <Button variant="outline" size="icon">
              <Paperclip className="h-4 w-4" />
            </Button>
            
            <Input
              placeholder="הקלד הודעה..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 hebrew-text"
            />
            
            <Button 
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatDetailScreen;