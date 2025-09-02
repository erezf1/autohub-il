import { MessageCircle, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

// Mock data for chat list
const chatList = [
  {
    id: 1,
    otherPartyName: "סוחר #345",
    chatSubject: "נושא: המכירה שלך: 342",
    lastMessage: "האם הרכב עדיין זמין למכירה?",
    timestamp: "10:45",
    unreadCount: 2,
    avatar: null
  },
  {
    id: 2,
    otherPartyName: "אוטו-דיל",
    chatSubject: "נושא: הבקשה שלך: 6449",
    lastMessage: "יש לי רכב שמתאים בדיוק למה שאתה מחפש",
    timestamp: "אתמול",
    unreadCount: 0,
    avatar: null
  },
  {
    id: 3,
    otherPartyName: "סוחר #127",
    chatSubject: "נושא: מכירה פומבית: אאודי A6",
    lastMessage: "מה הבעיה המכנית שאתה מזכיר?",
    timestamp: "אתמול",
    unreadCount: 5,
    avatar: null
  },
  {
    id: 4,
    otherPartyName: "רכב-טק",
    chatSubject: "נושא: המכירה שלך: 891",
    lastMessage: "אני מעוניין לראות את הרכב היום",
    timestamp: "03/01",
    unreadCount: 1,
    avatar: null
  }
];

const ChatListScreen = () => {
  const navigate = useNavigate();

  const handleChatClick = (chatId: number) => {
    navigate(`/chat/${chatId}`);
  };

  return (
    <div className="space-y-4">
      {/* Screen Title */}
      <h1 className="text-2xl font-bold text-foreground hebrew-text">צ'אטים</h1>
      
      {/* Chat List */}
      <div className="space-y-3">
        {chatList.map((chat) => (
          <Card 
            key={chat.id} 
            className="card-interactive cursor-pointer"
            onClick={() => handleChatClick(chat.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-3 space-x-reverse">
                {/* Avatar */}
                <Avatar className="h-12 w-12 flex-shrink-0">
                  <AvatarImage src={chat.avatar || ""} />
                  <AvatarFallback>
                    <User className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>

                {/* Chat Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    {/* Other Party Name */}
                    <h3 className="font-semibold text-foreground hebrew-text truncate">
                      {chat.otherPartyName}
                    </h3>
                    
                    {/* Timestamp */}
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {chat.timestamp}
                    </span>
                  </div>

                  {/* Chat Subject */}
                  <p className="text-sm text-muted-foreground hebrew-text mb-2">
                    {chat.chatSubject}
                  </p>

                  {/* Last Message and Unread Badge */}
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-foreground hebrew-text truncate flex-1">
                      {chat.lastMessage}
                    </p>
                    
                    {chat.unreadCount > 0 && (
                      <Badge variant="destructive" className="mr-2 notification-badge">
                        {chat.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ChatListScreen;
