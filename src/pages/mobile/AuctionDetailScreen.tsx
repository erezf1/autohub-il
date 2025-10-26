import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Car, Gavel, Users, Star, Loader2, ChevronRight, MessageCircle } from "lucide-react";
import { openOrCreateChat } from '@/utils/mobile/chatHelpers';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GradientBorderContainer } from "@/components/ui/gradient-border-container";
import { GradientSeparator } from "@/components/ui/gradient-separator";
import { VehicleSpecsCard, LoadingSpinner } from "@/components/common";
import { useAuctions, usePlaceBid, useConversationForEntity } from "@/hooks/mobile";
import { useAuth } from "@/contexts/AuthContext";

// Mock auction data
const mockAuction = {
  id: "789",
  seller: {
    name: "יוסי אברהם",
    rating: 4.9,
    auctionsCount: 12
  },
  status: "פעיל"
};

const AuctionDetailScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bidAmount, setBidAmount] = useState("");
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Fetch auction data
  const { useAuctionById, useAuctionBidHistory } = useAuctions();
  const { data: auction, isLoading } = useAuctionById(id);
  const { data: bidHistory = [], isLoading: bidHistoryLoading } = useAuctionBidHistory(id);
  const placeBidMutation = usePlaceBid();
  
  // Check if conversation exists for this auction
  const { data: existingConversationId } = useConversationForEntity({
    otherUserId: auction?.creator_id,
    entityType: 'auction',
    entityId: id
  });
  
  // Helper function to anonymize names
  const anonymizeName = (name: string) => {
    if (!name || name.length < 2) return 'משתמש';
    return `${name.charAt(0)}***${name.charAt(name.length - 1)}`;
  };

  // Countdown timer
  useEffect(() => {
    if (!auction?.auction_end_time) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const endTime = new Date(auction.auction_end_time).getTime();
      const distance = endTime - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [auction?.auction_end_time]);

  const handleBack = () => {
    navigate("/mobile/bids");
  };

  const handlePlaceBid = () => {
    if (!auction || !bidAmount) return;
    
    const currentHighest = auction.current_highest_bid || auction.starting_price;
    const bidValue = parseInt(bidAmount);
    
    if (bidValue <= currentHighest) {
      return;
    }

    placeBidMutation.mutate({
      auctionId: auction.id,
      bidAmount: bidValue
    }, {
      onSuccess: () => {
        setBidAmount("");
      }
    });
  };

  const handleMessageSeller = async () => {
    if (!auction || !auction.creator_id || !id) return;
    
    try {
      // If conversation exists, navigate directly
      if (existingConversationId) {
        navigate(`/mobile/chat/${existingConversationId}`);
        return;
      }

      // Otherwise create new conversation
      const conversationId = await openOrCreateChat({
        otherUserId: auction.creator_id,
        entityType: 'auction',
        entityId: id
      });
      navigate(`/mobile/chat/${conversationId}`);
    } catch (error) {
      console.error('Error opening chat:', error);
    }
  };

  if (isLoading || !auction) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  const vehicle = auction.vehicle;
  const make = vehicle?.make;
  const model = vehicle?.model;
  const currentBid = auction.current_highest_bid || auction.starting_price;
  const isOwner = auction.creator_id === user?.id;

  return (
    <div className="container max-w-md mx-auto px-4 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="text-white"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold text-white hebrew-text">מכירה פומבית</h1>
        <Badge variant="default" className="hebrew-text">
          {isOwner ? 'המכרז שלך' : 'פעיל'}
        </Badge>
      </div>

      {isOwner ? (
        <>
          {/* Info Message for Own Auction */}
          <GradientBorderContainer className="rounded-md">
            <Card className="bg-black border-0 rounded-md">
              <CardContent className="p-6">
                <div className="text-center space-y-2">
                  <Gavel className="h-12 w-12 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground hebrew-text">
                    זהו המכרז שלך. המתינו להצעות מסוחרים אחרים.
                  </p>
                </div>
              </CardContent>
            </Card>
          </GradientBorderContainer>

          {/* Auction Summary Card */}
          <GradientBorderContainer className="rounded-md">
            <Card className="bg-black border-0 rounded-md">
              <CardHeader>
                <CardTitle className="text-2xl hebrew-text text-center">
                  {make?.name_hebrew} {model?.name_hebrew} {vehicle?.year}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Highest Bid */}
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground hebrew-text">הצעה הגבוהה ביותר</p>
                  <p className="text-3xl font-bold text-white hebrew-text">
                    ₪{currentBid.toLocaleString()}
                  </p>
                </div>

                <GradientSeparator />

                {/* Countdown Timer */}
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground hebrew-text">זמן נותר</p>
                  <div className="flex items-center justify-center gap-2" dir="ltr">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{String(timeLeft.hours).padStart(2, '0')}</div>
                      <div className="text-xs text-muted-foreground">שעות</div>
                    </div>
                    <span className="text-2xl font-bold text-white">:</span>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{String(timeLeft.minutes).padStart(2, '0')}</div>
                      <div className="text-xs text-muted-foreground">דקות</div>
                    </div>
                    <span className="text-2xl font-bold text-white">:</span>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{String(timeLeft.seconds).padStart(2, '0')}</div>
                      <div className="text-xs text-muted-foreground">שניות</div>
                    </div>
                  </div>
                </div>

                <GradientSeparator />

                {/* Bid Count */}
                <div className="flex justify-center gap-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground hebrew-text">הצעות</span>
                    </div>
                    <p className="text-xl font-bold text-white">{bidHistory?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </GradientBorderContainer>

          {/* Bid History */}
          <GradientBorderContainer className="rounded-md">
            <Card className="bg-black border-0 rounded-md">
              <CardHeader>
                <CardTitle className="text-xl hebrew-text">היסטוריית הצעות</CardTitle>
              </CardHeader>
              <CardContent>
                {bidHistoryLoading ? (
                  <LoadingSpinner />
                ) : bidHistory && bidHistory.length > 0 ? (
                  <div className="space-y-3">
                    {bidHistory.map((bid: any, index: number) => (
                      <div key={bid.id} className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                            ${index === 0 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-muted text-muted-foreground'}`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-white font-medium hebrew-text">{anonymizeName(bid.dealer_name || 'משתמש')}</p>
                            <p className="text-xs text-muted-foreground hebrew-text">
                              {new Date(bid.created_at).toLocaleString('he-IL')}
                            </p>
                          </div>
                        </div>
                        <div className="text-left">
                          <p className="text-white font-bold hebrew-text">₪{bid.bid_amount.toLocaleString()}</p>
                          {index === 0 && (
                            <Badge variant="default" className="text-xs hebrew-text">
                              מוביל
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground hebrew-text">עדיין אין הצעות</p>
                )}
              </CardContent>
            </Card>
          </GradientBorderContainer>

          {/* Vehicle Details & Image Combined */}
          <GradientBorderContainer className="rounded-md">
            <Card className="bg-black border-0 rounded-md">
              <CardHeader>
                <CardTitle className="text-xl hebrew-text text-center">פרטי הרכב</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Vehicle Image */}
                <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden">
                  {vehicle?.images?.[0] ? (
                    <img 
                      src={vehicle.images[0]} 
                      alt={`${make?.name_hebrew} ${model?.name_hebrew}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Car className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <GradientSeparator />

                {/* Technical Specs */}
                <VehicleSpecsCard rows={[
                  { col1: { label: "שנה", value: vehicle?.year }, col2: { label: "ק״מ", value: vehicle?.kilometers?.toLocaleString() } },
                  { col1: { label: "גיר", value: vehicle?.transmission }, col2: { label: "דלק", value: vehicle?.fuel_type } },
                  { col1: { label: "צבע", value: vehicle?.color }, col2: { label: "מנוע", value: vehicle?.engine_size, unit: "סמ״ק" } }
                ]} />

                {/* Description */}
                {vehicle?.description && (
                  <>
                    <GradientSeparator />
                    <div>
                      <h3 className="text-sm font-semibold text-white hebrew-text mb-2">תיאור</h3>
                      <p className="text-muted-foreground hebrew-text text-sm">{vehicle.description}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </GradientBorderContainer>
        </>
      ) : (
        <>
          {/* Vehicle Details & Image Combined */}
          <GradientBorderContainer className="rounded-md">
            <Card className="bg-black border-0 rounded-md">
              <CardHeader>
                <CardTitle className="text-2xl hebrew-text text-center">
                  {make?.name_hebrew} {model?.name_hebrew} {vehicle?.year}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Vehicle Image */}
                <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden">
                  {vehicle?.images?.[0] ? (
                    <img 
                      src={vehicle.images[0]} 
                      alt={`${make?.name_hebrew} ${model?.name_hebrew}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Car className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <GradientSeparator />

                {/* Technical Specs */}
                <VehicleSpecsCard rows={[
                  { col1: { label: "שנה", value: vehicle?.year }, col2: { label: "ק״מ", value: vehicle?.kilometers?.toLocaleString() } },
                  { col1: { label: "גיר", value: vehicle?.transmission }, col2: { label: "דלק", value: vehicle?.fuel_type } },
                  { col1: { label: "צבע", value: vehicle?.color }, col2: { label: "מנוע", value: vehicle?.engine_size, unit: "סמ״ק" } }
                ]} />

                {/* Description */}
                {vehicle?.description && (
                  <>
                    <GradientSeparator />
                    <div>
                      <h3 className="text-sm font-semibold text-white hebrew-text mb-2">תיאור</h3>
                      <p className="text-muted-foreground hebrew-text text-sm">{vehicle.description}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </GradientBorderContainer>

          {/* Auction Summary Card */}
          <GradientBorderContainer className="rounded-md">
            <Card className="bg-black border-0 rounded-md">
              <CardHeader>
                <CardTitle className="text-xl hebrew-text">מצב המכרז</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Highest Bid */}
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground hebrew-text">הצעה נוכחית</p>
                  <p className="text-3xl font-bold text-white hebrew-text">
                    ₪{currentBid.toLocaleString()}
                  </p>
                </div>

                <GradientSeparator />

                {/* Countdown Timer */}
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground hebrew-text">זמן נותר</p>
                  <div className="flex items-center justify-center gap-2" dir="ltr">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{String(timeLeft.hours).padStart(2, '0')}</div>
                      <div className="text-xs text-muted-foreground">שעות</div>
                    </div>
                    <span className="text-2xl font-bold text-white">:</span>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{String(timeLeft.minutes).padStart(2, '0')}</div>
                      <div className="text-xs text-muted-foreground">דקות</div>
                    </div>
                    <span className="text-2xl font-bold text-white">:</span>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{String(timeLeft.seconds).padStart(2, '0')}</div>
                      <div className="text-xs text-muted-foreground">שניות</div>
                    </div>
                  </div>
                </div>

                <GradientSeparator />

                {/* Stats */}
                <div className="flex justify-center gap-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground hebrew-text">הצעות</span>
                    </div>
                    <p className="text-xl font-bold text-white">{bidHistory?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </GradientBorderContainer>

          {/* Bidding Interface */}
          <GradientBorderContainer className="rounded-md">
            <Card className="bg-black border-0 rounded-md">
              <CardHeader>
                <CardTitle className="text-xl hebrew-text">הגש הצעה</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  onClick={handleMessageSeller}
                  className="w-full gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  שלח הודעה למוכר
                </Button>
                
                <div className="space-y-2">
                  <Label htmlFor="bidAmount" className="text-white hebrew-text">
                    סכום ההצעה (₪)
                  </Label>
                  <Input
                    id="bidAmount"
                    type="number"
                    placeholder={`מינימום ₪${(currentBid + 1000).toLocaleString()}`}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="bg-muted border-0 text-right hebrew-text"
                    dir="rtl"
                  />
                  <p className="text-xs text-muted-foreground hebrew-text">
                    ההצעה הבאה חייבת להיות גבוהה מ-₪{currentBid.toLocaleString()} לפחות ב-₪1,000
                  </p>
                </div>

                <Button
                  className="w-full hebrew-text"
                  size="lg"
                  onClick={handlePlaceBid}
                  disabled={placeBidMutation.isPending}
                >
                  {placeBidMutation.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin ml-2" />
                  ) : (
                    <Gavel className="h-5 w-5 ml-2" />
                  )}
                  הגש הצעה
                </Button>
              </CardContent>
            </Card>
          </GradientBorderContainer>

          {/* Bid History */}
          <GradientBorderContainer className="rounded-md">
            <Card className="bg-black border-0 rounded-md">
              <CardHeader>
                <CardTitle className="text-xl hebrew-text">היסטוריית הצעות</CardTitle>
              </CardHeader>
              <CardContent>
                {bidHistoryLoading ? (
                  <LoadingSpinner />
                ) : bidHistory && bidHistory.length > 0 ? (
                  <div className="space-y-3">
                    {bidHistory.map((bid: any, index: number) => (
                      <div key={bid.id} className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                            ${index === 0 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-muted text-muted-foreground'}`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-white font-medium hebrew-text">{anonymizeName(bid.dealer_name || 'משתמש')}</p>
                            <p className="text-xs text-muted-foreground hebrew-text">
                              {new Date(bid.created_at).toLocaleString('he-IL')}
                            </p>
                          </div>
                        </div>
                        <div className="text-left">
                          <p className="text-white font-bold hebrew-text">₪{bid.bid_amount.toLocaleString()}</p>
                          {index === 0 && (
                            <Badge variant="default" className="text-xs hebrew-text">
                              מוביל
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground hebrew-text">עדיין אין הצעות</p>
                )}
              </CardContent>
            </Card>
          </GradientBorderContainer>

          {/* Seller Info - Simplified */}
          <GradientBorderContainer className="rounded-md">
            <Card className="bg-black border-0 rounded-md">
              <CardHeader>
                <CardTitle className="text-xl hebrew-text">פרטי המוכר</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {mockAuction.seller.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold hebrew-text">{mockAuction.seller.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(mockAuction.seller.rating)
                                ? 'fill-yellow-500 text-yellow-500'
                                : 'fill-muted text-muted'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground hebrew-text">
                        ({mockAuction.seller.rating.toFixed(1)})
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </GradientBorderContainer>
        </>
      )}
    </div>
  );
};

export default AuctionDetailScreen;
