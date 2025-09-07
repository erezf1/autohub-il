import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight, Car, Gavel, Clock, Users, Eye, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

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
  const [bidAmount, setBidAmount] = useState("");
  const [timeLeft, setTimeLeft] = useState(mockAuction.timeRemaining);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const endTime = mockAuction.endTime.getTime();
      const distance = endTime - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleBackClick = () => {
    navigate("/mobile/auctions");
  };

  const handlePlaceBid = () => {
    if (bidAmount && parseInt(bidAmount) > mockAuction.currentBid) {
      // In real app, place bid via API
      console.log("Placing bid:", bidAmount);
      setBidAmount("");
    }
  };

  const suggestedBid = mockAuction.currentBid + 10000;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-3 space-x-reverse mb-4">
        <Button variant="ghost" size="icon" onClick={handleBackClick}>
          <ArrowRight className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-bold text-foreground hebrew-text">
          מכירה פומבית
        </h1>
        <Badge variant="default" className="status-auction">
          {mockAuction.status}
        </Badge>
      </div>

      {/* Vehicle Image */}
      <Card>
        <CardContent className="p-0">
          <div className="relative h-48 bg-muted rounded-lg flex items-center justify-center">
            <Car className="h-16 w-16 text-muted-foreground" />
            <Badge variant="destructive" className="absolute top-2 right-2">
              מכירה פומבית
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Auction Status */}
      <Card className="border-primary">
        <CardContent className="p-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground hebrew-text">
              {mockAuction.title}
            </h2>
            
            <div className="text-3xl font-bold text-primary">
              ₪{mockAuction.currentBid.toLocaleString()}
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
                <span>{mockAuction.totalBids} הצעות</span>
              </div>
              <div className="flex items-center space-x-1 space-x-reverse">
                <Users className="h-4 w-4" />
                <span>{mockAuction.watchers} עוקבים</span>
              </div>
              <div className="flex items-center space-x-1 space-x-reverse">
                <Eye className="h-4 w-4" />
                <span>{mockAuction.views} צפיות</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bidding Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="hebrew-text">הגש הצעה</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex space-x-2 space-x-reverse">
            <Input
              type="number"
              placeholder={`מינימום ₪${suggestedBid.toLocaleString()}`}
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handlePlaceBid}
              disabled={!bidAmount || parseInt(bidAmount) <= mockAuction.currentBid}
              className="px-6"
            >
              <Gavel className="h-4 w-4 ml-2" />
              <span className="hebrew-text">הגש הצעה</span>
            </Button>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setBidAmount(suggestedBid.toString())}
          >
            <span className="hebrew-text">הצעה מהירה: ₪{suggestedBid.toLocaleString()}</span>
          </Button>

          {!mockAuction.hasReserveMet && (
            <div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
              <p className="text-sm text-warning hebrew-text">
                מחיר השמירה עדיין לא הושג (₪{mockAuction.reservePrice.toLocaleString()})
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Vehicle Details */}
      <Card>
        <CardHeader>
          <CardTitle className="hebrew-text">פרטי הרכב</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground hebrew-text">שנת ייצור</p>
              <p className="font-medium text-foreground">{mockAuction.vehicle.year}</p>
            </div>
            <div>
              <p className="text-muted-foreground hebrew-text">קילומטרז׳</p>
              <p className="font-medium text-foreground">{mockAuction.vehicle.kilometers.toLocaleString()} ק״מ</p>
            </div>
            <div>
              <p className="text-muted-foreground hebrew-text">תיבת הילוכים</p>
              <p className="font-medium text-foreground hebrew-text">{mockAuction.vehicle.transmission}</p>
            </div>
            <div>
              <p className="text-muted-foreground hebrew-text">סוג דלק</p>
              <p className="font-medium text-foreground hebrew-text">{mockAuction.vehicle.fuelType}</p>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <p className="text-sm text-muted-foreground hebrew-text mb-2">תיאור</p>
            <p className="text-foreground hebrew-text leading-relaxed">
              {mockAuction.vehicle.description}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Bid History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 space-x-reverse hebrew-text">
            <TrendingUp className="h-5 w-5" />
            <span>היסטוריית הצעות</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockAuction.bidHistory.map((bid) => (
              <div key={bid.id} className="flex justify-between items-center">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                      {bid.bidder.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground text-sm">{bid.bidder}</p>
                    <p className="text-xs text-muted-foreground">{bid.timestamp}</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className={`font-bold ${bid.isWinning ? 'text-primary' : 'text-foreground'}`}>
                    ₪{bid.amount.toLocaleString()}
                  </p>
                  {bid.isWinning && (
                    <Badge variant="default" className="text-xs">
                      מוביל
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Seller Info */}
      <Card>
        <CardHeader>
          <CardTitle className="hebrew-text">פרטי המוכר</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-3 space-x-reverse">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {mockAuction.seller.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-foreground hebrew-text">
                {mockAuction.seller.name}
              </h3>
              <p className="text-sm text-muted-foreground hebrew-text">
                דירוג: {mockAuction.seller.rating} ⭐ • {mockAuction.seller.auctionsCount} מכירות
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuctionDetailScreen;