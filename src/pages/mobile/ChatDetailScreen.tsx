import { ArrowRight, Send, User, Info, Check, X } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatMessages, useSendMessage } from "@/hooks/mobile/useChatMessages";
import { useConversation, useRequestReveal, useApproveReveal, useRejectReveal } from "@/hooks/mobile/useConversations";
import { LoadingSpinner } from "@/components/common";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { toast } from "sonner";

const ChatDetailScreen = () => {
  const [newMessage, setNewMessage] = useState("");
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: conversation, isLoading: loadingConversation, error: conversationError } = useConversation(chatId!);
  const { data: messages, isLoading: loadingMessages } = useChatMessages(chatId!);
  const sendMessageMutation = useSendMessage();
  const requestRevealMutation = useRequestReveal();
  const approveRevealMutation = useApproveReveal();
  const rejectRevealMutation = useRejectReveal();

  const handleSendMessage = () => {
    if (newMessage.trim() && chatId) {
      sendMessageMutation.mutate(
        { conversationId: chatId, messageContent: newMessage.trim() },
        {
          onSuccess: () => setNewMessage(""),
          onError: () => toast.error("שליחת ההודעה נכשלה")
        }
      );
    }
  };

  const handleBackClick = () => {
    navigate("/mobile/chats");
  };

  const handleRequestReveal = () => {
    if (chatId) {
      requestRevealMutation.mutate(chatId, {
        onSuccess: () => toast.success("בקשה לחשיפת פרטים נשלחה"),
        onError: () => toast.error("שליחת הבקשה נכשלה")
      });
    }
  };

  const handleApproveReveal = () => {
    if (chatId) {
      approveRevealMutation.mutate(chatId, {
        onSuccess: () => toast.success("הבקשה אושרה והפרטים נחשפו"),
        onError: () => toast.error("אישור הבקשה נכשל")
      });
    }
  };

  const handleRejectReveal = () => {
    if (chatId) {
      rejectRevealMutation.mutate(chatId, {
        onSuccess: () => toast.success("הבקשה נדחתה"),
        onError: () => toast.error("דחיית הבקשה נכשלה")
      });
    }
  };

  if (loadingConversation) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (conversationError || !conversation) {
    return (
      <div className="container max-w-md mx-auto px-4 py-8" dir="rtl">
        <Card className="bg-black border-0">
          <CardContent className="p-6 text-center">
            <p className="text-white hebrew-text mb-4">השיחה לא נמצאה</p>
            <Button onClick={handleBackClick} variant="outline">
              חזרה לרשימת שיחות
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const showRevealRequest = conversation.details_reveal_requested_by && 
    conversation.details_reveal_requested_by !== user?.id &&
    !conversation.is_details_revealed;

  const canRequestReveal = !conversation.details_reveal_requested_by && 
    !conversation.is_details_revealed;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Chat Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 space-x-reverse flex-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackClick}
              className="flex-shrink-0"
            >
              <ArrowRight className="h-5 w-5" />
            </Button>

            <Avatar className="h-10 w-10">
              <AvatarImage src={conversation.otherParty.profile_picture_url || ""} />
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-foreground hebrew-text truncate">
                {conversation.otherParty.displayName}
              </h2>
              <p className="text-xs text-muted-foreground hebrew-text truncate">
                נושא: {conversation.vehicle_listings ? 
                  `${conversation.vehicle_listings.make?.name_hebrew} ${conversation.vehicle_listings.model?.name_hebrew}` :
                  conversation.auctions ?
                  `מכרז - ${conversation.auctions.vehicle.make?.name_hebrew}` :
                  conversation.iso_requests?.title || 'שיחה'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Reveal Details UI */}
        {showRevealRequest && (
          <Card className="mt-3 bg-amber-500/10 border-amber-500/20">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Info className="h-4 w-4 text-amber-500" />
                  <span className="text-sm hebrew-text text-foreground">
                    {conversation.otherParty.displayName} מבקש לחשוף פרטי קשר
                  </span>
                </div>
                <div className="flex space-x-2 space-x-reverse">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleRejectReveal}
                    className="h-8"
                  >
                    <X className="h-4 w-4 ml-1" />
                    דחה
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleApproveReveal}
                    className="h-8"
                  >
                    <Check className="h-4 w-4 ml-1" />
                    אשר
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {canRequestReveal && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRequestReveal}
            className="mt-3 w-full hebrew-text"
          >
            <Info className="h-4 w-4 ml-2" />
            בקש לחשוף פרטי קשר
          </Button>
        )}

        {conversation.is_details_revealed && (
          <Card className="mt-3 bg-green-500/10 border-green-500/20">
            <CardContent className="p-3">
              <p className="text-sm text-green-600 hebrew-text text-center">
                פרטי הקשר נחשפו - {conversation.otherParty.business_name}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages?.length === 0 ? (
            <p className="text-center text-muted-foreground hebrew-text py-8">
              אין הודעות בשיחה
            </p>
          ) : (
            messages?.map((message) => {
              const isOwnMessage = message.senderId === user?.id;

              return (
                <div
                  key={message.id}
                  className={`flex ${isOwnMessage ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`flex items-start space-x-2 space-x-reverse max-w-[75%] ${
                      isOwnMessage ? "" : "flex-row-reverse space-x-reverse"
                    }`}
                  >
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={message.senderAvatar || ""} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <Card
                        className={`${
                          isOwnMessage
                            ? "bg-primary/10 border-primary/20"
                            : "bg-secondary/50 border-secondary"
                        }`}
                      >
                        <CardContent className="p-3">
                          {message.messageType === 'text' ? (
                            <p
                              className={`text-sm hebrew-text ${
                                isOwnMessage ? "text-primary" : "text-foreground"
                              }`}
                            >
                              {message.messageContent}
                            </p>
                          ) : message.messageType === 'image' ? (
                            <img 
                              src={message.messageContent} 
                              alt="תמונה" 
                              className="max-w-full rounded"
                            />
                          ) : (
                            <p className="text-sm hebrew-text text-muted-foreground">
                              הודעת {message.messageType === 'voice' ? 'קול' : 'מערכת'}
                            </p>
                          )}
                        </CardContent>
                      </Card>

                      <div
                        className={`flex items-center mt-1 space-x-1 ${
                          isOwnMessage ? "justify-start" : "justify-end"
                        }`}
                      >
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(message.createdAt), 'HH:mm')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 bg-card border-t border-border">
        <div className="flex items-center space-x-2 space-x-reverse">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="הקלד הודעה..."
            className="flex-1 hebrew-text"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />

          <Button
            onClick={handleSendMessage}
            size="icon"
            className="flex-shrink-0"
            disabled={!newMessage.trim() || sendMessageMutation.isPending}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatDetailScreen;
