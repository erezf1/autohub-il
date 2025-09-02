import { Clock, Gavel, Car, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

// Mock data for active auctions
const activeAuctions = [
  {
    id: 1,
    title: "פורשה 911 2022",
    currentBid: "450,000 ₪",
    timeRemaining: "2 ימים, 4 שעות",
    image: "/placeholder.svg",
    bidCount: 12,
    isHot: true
  },
  {
    id: 2,
    title: "BMW X5 2021",
    currentBid: "320,000 ₪",
    timeRemaining: "1 יום, 12 שעות",
    image: "/placeholder.svg",
    bidCount: 8,
    isHot: false
  },
  {
    id: 3,
    title: "מרצדס GLC 2020",
    currentBid: "285,000 ₪",
    timeRemaining: "3 ימים, 8 שעות",
    image: "/placeholder.svg",
    bidCount: 15,
    isHot: true
  },
  {
    id: 4,
    title: "אאודי Q7 2023",
    currentBid: "520,000 ₪",
    timeRemaining: "5 שעות, 23 דקות",
    image: "/placeholder.svg",
    bidCount: 23,
    isHot: true
  },
  {
    id: 5,
    title: "לקסוס ES 2019",
    currentBid: "195,000 ₪",
    timeRemaining: "4 ימים, 15 שעות",
    image: "/placeholder.svg",
    bidCount: 5,
    isHot: false
  }
];

const AuctionListScreen = () => {
  const navigate = useNavigate();

  const handleAuctionClick = (auctionId: number) => {
    navigate(`/auction/${auctionId}`);
  };

  const getTimeRemainingColor = (timeRemaining: string) => {
    if (timeRemaining.includes("שעות") && !timeRemaining.includes("ימים")) {
      return "text-destructive"; // Less than a day
    }
    if (timeRemaining.includes("1 יום")) {
      return "text-warning"; // One day
    }
    return "text-muted-foreground"; // More than a day
  };

  return (
    <div className="space-y-4">
      {/* Screen Title */}
      <h1 className="text-2xl font-bold text-foreground hebrew-text">מכירות פומביות</h1>
      
      {/* Auction List */}
      <div className="space-y-4">
        {activeAuctions.map((auction) => (
          <Card 
            key={auction.id}
            className="card-interactive cursor-pointer overflow-hidden"
            onClick={() => handleAuctionClick(auction.id)}
          >
            <CardContent className="p-0">
              <div className="relative">
                {/* Vehicle Image */}
                <div className="relative h-48 bg-muted flex items-center justify-center">
                  <Car className="h-16 w-16 text-muted-foreground" />
                  
                  {/* Hot Badge */}
                  {auction.isHot && (
                    <Badge variant="destructive" className="absolute top-3 right-3">
                      🔥 חם
                    </Badge>
                  )}
                  
                  {/* Bid Count */}
                  <Badge variant="secondary" className="absolute top-3 left-3">
                    {auction.bidCount} הצעות
                  </Badge>
                </div>

                {/* Auction Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-white font-bold text-lg hebrew-text mb-2">
                    {auction.title}
                  </h3>
                </div>
              </div>

              {/* Auction Details */}
              <div className="p-4 space-y-3">
                {/* Current Bid */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <TrendingUp className="h-5 w-5 text-success" />
                    <span className="text-sm text-muted-foreground hebrew-text">
                      הצעה מובילה:
                    </span>
                  </div>
                  <span className="text-xl font-bold text-success hebrew-text">
                    {auction.currentBid}
                  </span>
                </div>

                {/* Time Remaining */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Clock className="h-5 w-5 text-auction" />
                    <span className="text-sm text-muted-foreground hebrew-text">
                      נותרו:
                    </span>
                  </div>
                  <span className={`font-semibold hebrew-text ${getTimeRemainingColor(auction.timeRemaining)}`}>
                    {auction.timeRemaining}
                  </span>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  <div className="w-full bg-auction text-auction-foreground rounded-md py-2 px-4 text-center font-semibold hebrew-text flex items-center justify-center space-x-2 space-x-reverse">
                    <Gavel className="h-4 w-4" />
                    <span>הגש הצעה</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {activeAuctions.length === 0 && (
          <div className="text-center py-12">
            <Gavel className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground hebrew-text mb-2">
              אין מכירות פומביות פעילות
            </h3>
            <p className="text-muted-foreground hebrew-text">
              בדוק שוב מאוחר יותר למכירות חדשות
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuctionListScreen;