import { useState } from "react";
import { Clock, Gavel, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    navigate(`/mobile/auction/${auctionId}`);
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
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all" className="hebrew-text">כל המכירות</TabsTrigger>
          <TabsTrigger value="mine" className="hebrew-text">המכירות שלי</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <div className="space-y-3">
            {activeAuctions.map((auction) => (
              <Card 
                key={auction.id}
                className="card-interactive cursor-pointer"
                onClick={() => handleAuctionClick(auction.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4 space-x-reverse">
                    {/* Vehicle Image */}
                    <div className="relative w-20 h-20 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      <Gavel className="h-10 w-10 text-muted-foreground" />
                      {auction.isHot && (
                        <Badge variant="destructive" className="absolute -top-1 -right-1 text-xs">
                          חם
                        </Badge>
                      )}
                    </div>

                    {/* Auction Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-foreground hebrew-text">
                          {auction.title}
                        </h3>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <TrendingUp className="h-3 w-3 ml-1" />
                          <span>{auction.bidCount} הצעות</span>
                        </div>
                      </div>
                      
                      <p className="text-lg font-bold text-primary hebrew-text mb-2">
                        {auction.currentBid}
                      </p>
                      
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-muted-foreground ml-1" />
                        <span className={`text-sm hebrew-text ${getTimeRemainingColor(auction.timeRemaining)}`}>
                          {auction.timeRemaining}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {activeAuctions.length === 0 && (
              <div className="text-center py-8">
                <Gavel className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground hebrew-text">אין מכירות פומביות פעילות</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="mine" className="space-y-4">
          <div className="space-y-3">
            {activeAuctions.filter(auction => auction.id <= 2).map((auction) => (
              <Card 
                key={auction.id}
                className="card-interactive cursor-pointer"
                onClick={() => handleAuctionClick(auction.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4 space-x-reverse">
                    {/* Vehicle Image */}
                    <div className="relative w-20 h-20 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      <Gavel className="h-10 w-10 text-muted-foreground" />
                      {auction.isHot && (
                        <Badge variant="destructive" className="absolute -top-1 -right-1 text-xs">
                          חם
                        </Badge>
                      )}
                    </div>

                    {/* Auction Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-foreground hebrew-text">
                          {auction.title}
                        </h3>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <TrendingUp className="h-3 w-3 ml-1" />
                          <span>{auction.bidCount} הצעות</span>
                        </div>
                      </div>
                      
                      <p className="text-lg font-bold text-primary hebrew-text mb-2">
                        {auction.currentBid}
                      </p>
                      
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-muted-foreground ml-1" />
                        <span className={`text-sm hebrew-text ${getTimeRemainingColor(auction.timeRemaining)}`}>
                          {auction.timeRemaining}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {activeAuctions.filter(auction => auction.id <= 2).length === 0 && (
              <div className="text-center py-8">
                <Gavel className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground hebrew-text">אין לך מכירות פומביות פעילות</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuctionListScreen;