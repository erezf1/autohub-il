import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Car, Gavel, Clock, Users, Eye, TrendingUp } from "lucide-react";
import { SuperArrowsIcon } from "@/components/common/SuperArrowsIcon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GradientBorderContainer } from "@/components/ui/gradient-border-container";
import { GradientSeparator } from "@/components/ui/gradient-separator";
import { DealerCard, VehicleSpecsCard, LoadingSpinner } from "@/components/common";
import { useAuctions, usePlaceBid } from "@/hooks/mobile";
import { useAuth } from "@/contexts/AuthContext";

// Mock auction data
const mockAuction = {
  id: "789",
  title: "פורשה 911 2019",
  currentBid: 750000,
  startingPrice: 650000,
  reservePrice: 800000,
  hasReserveMet: false,
  timeRemaining: {
    days: 0,
    hours: 2,
    minutes: 35,
    seconds: 42
  },
  totalBids: 28,
  watchers: 156,
  views: 2341,
  vehicle: {
    year: 2019,
    kilometers: 35000,
    transmission: "ידנית",
    fuelType: "בנזין",
    engineSize: "3.0L",
    color: "כחול מטאלי",
    description: "פורשה 911 במצב יוצא דופן. רכב אספנות שמור במוסך מקורה. כל הטיפולים במוסך מורשה."
  },
  bidHistory: [
    {
      id: 1,
      bidder: "ד***ן כ***",
      amount: 750000,
      timestamp: "לפני דקה",
      isWinning: true
    },
    {
      id: 2,
      bidder: "מ***ה ל***",
      amount: 740000,
      timestamp: "לפני 3 דקות",
      isWinning: false
    },
    {
      id: 3,
      bidder: "א***ל ר***",
      amount: 730000,
      timestamp: "לפני 8 דקות",
      isWinning: false
    },
    {
      id: 4,
      bidder: "י***ב ק***",
      amount: 720000,
      timestamp: "לפני 12 דקות",
      isWinning: false
    }
  ],
  seller: {
    name: "יוסי אברהם",
    rating: 4.9,
    auctionsCount: 12
  },
  status: "פעיל",
  endTime: new Date(Date.now() + 2 * 60 * 60 * 1000 + 35 * 60 * 1000) // 2:35 from now
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
  const { data: bidHistory = [] } = useAuctionBidHistory(id);
  const { mutate: placeBidMutation, isPending: isPlacingBid } = usePlaceBid();

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

  const handleBackClick = () => {
    navigate("/mobile/bids");
  };

  const handlePlaceBid = () => {
    if (!auction || !bidAmount) return;
    
    const currentHighest = auction.current_highest_bid || auction.starting_price;
    const bidValue = parseInt(bidAmount);
    
    if (bidValue <= currentHighest) {
      return;
    }

    placeBidMutation({
      auctionId: auction.id,
      bidAmount: bidValue
    }, {
      onSuccess: () => {
        setBidAmount("");
      }
    });
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
  const seller = auction.creator;
  const currentBid = auction.current_highest_bid || auction.starting_price;
  const suggestedBid = currentBid + 10000;
  const hasReserveMet = auction.reserve_price ? currentBid >= auction.reserve_price : true;

  return (
    <div className="container max-w-md mx-auto px-4 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div 
            onClick={handleBackClick}
            className="h-6 w-6 cursor-pointer flex items-center justify-center transition-all duration-200"
          >
            <SuperArrowsIcon className="h-full w-full hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] transition-all duration-200" />
          </div>
          <h1 className="text-2xl font-bold text-foreground hebrew-text">
            מכירה פומבית
          </h1>
        </div>
        <Badge variant="default" className="hebrew-text">
          {auction.creator_id === user?.id ? 'המכרז שלך' : mockAuction.status}
        </Badge>
      </div>

      {/* Vehicle Details Card - MOVED TO TOP */}
      <GradientBorderContainer className="rounded-md">
        <Card className="bg-black border-0 rounded-md">
          <CardHeader>
            <CardTitle className="text-2xl hebrew-text text-center">
              {make?.name_hebrew} {model?.name_hebrew} {vehicle?.year}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const specsRows = [];
              
              if (vehicle?.kilometers || vehicle?.engine_size) {
                specsRows.push([
                  vehicle?.kilometers && { label: "קילומטראז'", value: vehicle.kilometers.toLocaleString() },
                  vehicle?.engine_size && { label: "נפח מנוע", value: vehicle.engine_size.toString(), unit: "סמ״ק" }
                ].filter(Boolean));
              }
              
              if (vehicle?.transmission || vehicle?.fuel_type) {
                specsRows.push([
                  vehicle?.transmission && { label: "תיבת הילוכים", value: vehicle.transmission },
                  vehicle?.fuel_type && { label: "סוג דלק", value: vehicle.fuel_type }
                ].filter(Boolean));
              }
              
              if (vehicle?.previous_owners) {
                specsRows.push([
                  { label: "בעלים קודמים", value: vehicle.previous_owners.toString() }
                ]);
              }
              
              return specsRows.length > 0 ? (
                <VehicleSpecsCard rows={specsRows} />
              ) : null;
            })()}
          </CardContent>
        </Card>
      </GradientBorderContainer>

      {/* Vehicle Image */}
      <GradientBorderContainer className="rounded-md">
        <Card className="bg-black border-0 rounded-md">
          <CardContent className="p-0">
            <div className="relative h-48 bg-muted rounded-lg flex items-center justify-center">
              <Car className="h-16 w-16 text-muted-foreground" />
              <Badge variant="destructive" className="absolute top-2 right-2 hebrew-text">
                מכירה פומבית
              </Badge>
            </div>
          </CardContent>
        </Card>
      </GradientBorderContainer>

      {/* Auction Status */}
      <GradientBorderContainer className="rounded-md">
        <Card className="bg-black border-0 rounded-md">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-foreground hebrew-text">
                {make?.name_hebrew} {model?.name_hebrew} {vehicle?.year}
              </h2>
              
              <div className="text-3xl font-bold text-primary">
                ₪{currentBid.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground hebrew-text">
                הצעה נוכחית
              </p>

              <div className="flex justify-center items-center space-x-4 space-x-reverse mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <div className="text-xs text-muted-foreground hebrew-text">שעות</div>
                </div>
                <div className="text-muted-foreground">:</div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <div className="text-xs text-muted-foreground hebrew-text">דקות</div>
                </div>
                <div className="text-muted-foreground">:</div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </div>
                  <div className="text-xs text-muted-foreground hebrew-text">שניות</div>
                </div>
              </div>

              <div className="flex justify-center items-center space-x-6 space-x-reverse mt-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1 space-x-reverse">
                  <Gavel className="h-4 w-4" />
                  <span className="hebrew-text">{mockAuction.totalBids} הצעות</span>
                </div>
                <div className="flex items-center space-x-1 space-x-reverse">
                  <Users className="h-4 w-4" />
                  <span className="hebrew-text">{mockAuction.watchers} עוקבים</span>
                </div>
                <div className="flex items-center space-x-1 space-x-reverse">
                  <Eye className="h-4 w-4" />
                  <span className="hebrew-text">{mockAuction.views} צפיות</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </GradientBorderContainer>

      {/* Bidding Interface - Only show if not the creator */}
      {auction.creator_id !== user?.id ? (
        <GradientBorderContainer className="rounded-md">
          <Card className="bg-black border-0 rounded-md">
            <CardHeader>
              <CardTitle className="text-xl hebrew-text">הגש הצעה</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2" dir="rtl">
                <Input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder="הכנס סכום הצעה"
                  className="flex-1 bg-black border border-white/20 text-right hebrew-text"
                  dir="rtl"
                />
                <Button 
                  onClick={handlePlaceBid}
                  disabled={isPlacingBid || !bidAmount}
                  className="hebrew-text"
                >
                  {isPlacingBid ? "שולח..." : "הגש הצעה"}
                </Button>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground hebrew-text">
                  הצעה מוצעת
                </span>
                <span className="text-white font-bold hebrew-text">
                  ₪{suggestedBid?.toLocaleString()}
                </span>
              </div>

              <Button 
                variant="outline" 
                className="w-full hebrew-text"
                onClick={() => setBidAmount(suggestedBid?.toString() || "")}
              >
                הצע {suggestedBid?.toLocaleString()} ₪
              </Button>

              <div className="pt-2 space-y-2 text-xs text-muted-foreground hebrew-text">
                <div className="flex items-center justify-between">
                  <span>מחיר מינימום</span>
                  <span>₪{currentBid?.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </GradientBorderContainer>
      ) : (
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
      )}


      {/* Vehicle Description */}
      {vehicle?.description && (
        <GradientBorderContainer className="rounded-md">
          <Card className="bg-black border-0 rounded-md">
            <CardHeader>
              <CardTitle className="hebrew-text text-white">תיאור</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white hebrew-text leading-relaxed">
                {vehicle?.description}
              </p>
            </CardContent>
          </Card>
        </GradientBorderContainer>
      )}

      {/* Bid History */}
      <GradientBorderContainer className="rounded-md">
        <Card className="bg-black border-0 rounded-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 space-x-reverse hebrew-text text-xl">
              <TrendingUp className="h-5 w-5" />
              <span>היסטוריית הצעות</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bidHistory.length > 0 ? bidHistory.map((bid: any, index: number) => (
                <div key={bid.id}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                          {bid.bidderName?.charAt(0) || 'ס'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground text-sm hebrew-text">{bid.bidderName}</p>
                        <p className="text-xs text-muted-foreground hebrew-text">
                          {new Date(bid.created_at).toLocaleString('he-IL')}
                        </p>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className={`font-bold ${bid.isWinning ? 'text-primary' : 'text-foreground'}`}>
                        ₪{bid.bid_amount.toLocaleString()}
                      </p>
                      {bid.isWinning && (
                        <Badge variant="default" className="text-xs hebrew-text">
                          מוביל
                        </Badge>
                      )}
                    </div>
                  </div>
                  {index < bidHistory.length - 1 && (
                    <GradientSeparator className="mt-4" />
                  )}
                </div>
              )) : (
                <p className="text-center text-muted-foreground hebrew-text py-4">
                  אין הצעות עדיין
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </GradientBorderContainer>

      {/* Seller Info */}
      <GradientBorderContainer className="rounded-md">
        <Card className="bg-black border-0 rounded-md">
          <CardHeader>
            <CardTitle className="text-xl hebrew-text">פרטי המוכר</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3 space-x-reverse">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {seller?.business_name?.charAt(0) || seller?.full_name?.charAt(0) || 'ס'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-foreground hebrew-text">
                  {seller?.business_name || seller?.full_name || 'סוחר'}
                </h3>
                <p className="text-sm text-muted-foreground hebrew-text">
                  {seller?.rating_tier || 'רגיל'} • {seller?.tenure || 0} חודשים במערכת
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </GradientBorderContainer>

      {/* Vehicle Condition & History */}
      <GradientBorderContainer className="rounded-md">
        <Card className="bg-black border-0 rounded-md">
          <CardHeader>
            <CardTitle className="hebrew-text text-white">מצב ורקע הרכב</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground hebrew-text">מצב כללי</p>
                <p className="font-medium text-white hebrew-text">
                  מצוין
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </GradientBorderContainer>

      {/* Dealer Card */}
      <DealerCard
        dealerId={seller?.id || ''}
        isRevealed={true}
        showChatButton={true}
        showPhoneButton={true}
      />
    </div>
  );
};

export default AuctionDetailScreen;