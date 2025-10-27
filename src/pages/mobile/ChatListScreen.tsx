import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GradientBorderContainer } from "@/components/ui/gradient-border-container";
import { useNavigate } from "react-router-dom";
import { useConversations } from "@/hooks/mobile/useConversations";
import { LoadingSpinner } from "@/components/common";
import { format, isToday, isYesterday } from "date-fns";
import { he } from "date-fns/locale";

const ChatListScreen = () => {
  const navigate = useNavigate();
  const { data: conversations, isLoading } = useConversations();

  const handleChatClick = (chatId: string) => {
    navigate(`/mobile/chat/${chatId}`);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return 'אתמול';
    } else {
      return format(date, 'dd/MM', { locale: he });
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      {/* Screen Title */}
      <h1 className="text-2xl font-bold text-foreground hebrew-text">צ'אטים</h1>
      
      {/* Chat List */}
      <div className="space-y-3">
        {conversations?.length === 0 ? (
          <p className="text-center text-muted-foreground hebrew-text py-8">
            אין שיחות פעילות
          </p>
        ) : (
          conversations?.map((chat) => (
            <GradientBorderContainer
              key={chat.id}
              className="rounded-md flex-1"
            >
              <Card 
                className="card-interactive cursor-pointer bg-black border-0"
                onClick={() => handleChatClick(chat.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start">
                    {/* Chat Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        {/* Other Party Name */}
                        <h3 className="font-semibold text-white hebrew-text truncate">
                          {chat.otherParty.business_name}
                        </h3>
                        
                        {/* Timestamp */}
                        <span className="text-xs text-gray-300 flex-shrink-0">
                          {formatTimestamp(chat.lastMessageAt)}
                        </span>
                      </div>

                      {/* Chat Subject */}
                      <p className="text-sm text-gray-300 hebrew-text mb-2">
                        נושא: {chat.entity.title}
                        {chat.entity.subtitle && ` - ${chat.entity.subtitle}`}
                      </p>

                      {/* Last Message and Unread Badge */}
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-white hebrew-text truncate flex-1">
                          {chat.lastMessage || 'אין הודעות'}
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
            </GradientBorderContainer>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatListScreen;
