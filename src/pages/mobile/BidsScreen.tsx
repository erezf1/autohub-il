import React, { useState } from 'react';
import MobileLayout from '@/components/mobile/MobileLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Gavel, Clock, TrendingUp, Plus, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock data for bids and auctions
const mockMyBids = [
  {
    id: 1,
    vehicleId: 101,
    make: "טויוטה",
    model: "קמרי",
    year: 2020,
    image: "/lovable-uploads/5f941758-f133-4982-a8a0-3da09c4677f5.png",
    myBid: "₪95,000",
    currentHighest: "₪98,000",
    status: "outbid",
    timeRemaining: "2 ימים ו-5 שעות",
    bidCount: 12
  },
  {
    id: 2,
    vehicleId: 102,
    make: "מזדה",
    model: "CX-5",
    year: 2021,
    image: "/lovable-uploads/6daec4a1-44e1-4924-8b14-0ae85967e9a4.png",
    myBid: "₪135,000",
    currentHighest: "₪135,000",
    status: "winning",
    timeRemaining: "1 יום ו-12 שעות",
    bidCount: 8
  }
];

const mockMyAuctions = [
  {
    id: 3,
    vehicleId: 201,
    make: "היונדאי",
    model: "טוסון",
    year: 2019,
    image: "/lovable-uploads/5f941758-f133-4982-a8a0-3da09c4677f5.png",
    startingPrice: "₪85,000",
    currentBid: "₪92,000",
    status: "active",
    timeRemaining: "3 ימים ו-8 שעות",
    bidCount: 6
  }
];

const mockActiveAuctions = [
  {
    id: 4,
    vehicleId: 301,
    make: "פולקסווגן",
    model: "טיגואן",
    year: 2020,
    image: "/lovable-uploads/6daec4a1-44e1-4924-8b14-0ae85967e9a4.png",
    currentBid: "₪145,000",
    status: "active",
    timeRemaining: "4 שעות ו-22 דקות",
    bidCount: 15,
    canBid: true
  },
  {
    id: 5,
    vehicleId: 302,
    make: "ניסאן",
    model: "קשקאי",
    year: 2021,
    image: "/lovable-uploads/5f941758-f133-4982-a8a0-3da09c4677f5.png",
    currentBid: "₪125,000",
    status: "active", 
    timeRemaining: "1 יום ו-15 שעות",
    bidCount: 9,
    canBid: true
  }
];

const getBidStatusColor = (status: string) => {
  switch (status) {
    case 'winning': return 'bg-green-500';
    case 'outbid': return 'bg-red-500';
    case 'active': return 'bg-blue-500';
    default: return 'bg-gray-500';
  }
};

const getBidStatusText = (status: string) => {
  switch (status) {
    case 'winning': return 'מוביל';
    case 'outbid': return 'הוקפת';
    case 'active': return 'פעיל';
    default: return 'לא ידוע';
  }
};

export const BidsScreen: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("my-bids");

  return (
    <MobileLayout>
      <div className="flex-1 p-4" dir="rtl">
        <h1 className="text-xl font-bold mb-4">הצעות מחיר</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="my-bids">ההצעות שלי</TabsTrigger>
            <TabsTrigger value="my-auctions">המכירות שלי</TabsTrigger>
            <TabsTrigger value="active-auctions">מכירות פעילות</TabsTrigger>
          </TabsList>

          <TabsContent value="my-bids" className="space-y-4">
            {/* Create New Bid Button */}
            <Button 
              onClick={() => navigate('/mobile/create-bid-select-car')}
              className="w-full gap-2"
            >
              <Plus className="w-4 h-4" />
              צור הצעה חדשה
            </Button>

            {/* My Bids List */}
            <div className="space-y-3">
              {mockMyBids.map((bid) => (
                <Card 
                  key={bid.id} 
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/mobile/auction/${bid.vehicleId}`)}
                >
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={bid.image} 
                        alt={`${bid.make} ${bid.model}`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{bid.make} {bid.model}</h3>
                          <p className="text-sm text-muted-foreground">{bid.year}</p>
                        </div>
                        <Badge className={`text-white ${getBidStatusColor(bid.status)}`}>
                          {getBidStatusText(bid.status)}
                        </Badge>
                      </div>

                      <div className="space-y-1 mb-2">
                        <div className="flex justify-between text-sm">
                          <span>ההצעה שלי:</span>
                          <span className="font-medium">{bid.myBid}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>הצעה גבוהה:</span>
                          <span className="font-medium text-green-600">{bid.currentHighest}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{bid.timeRemaining}</span>
                        </div>
                        <span>{bid.bidCount} הצעות</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-auctions" className="space-y-4">
            {/* My Auctions List */}
            <div className="space-y-3">
              {mockMyAuctions.map((auction) => (
                <Card 
                  key={auction.id} 
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/mobile/auction/${auction.vehicleId}`)}
                >
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={auction.image} 
                        alt={`${auction.make} ${auction.model}`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{auction.make} {auction.model}</h3>
                          <p className="text-sm text-muted-foreground">{auction.year}</p>
                        </div>
                        <Badge className="bg-blue-500 text-white">
                          פעיל
                        </Badge>
                      </div>

                      <div className="space-y-1 mb-2">
                        <div className="flex justify-between text-sm">
                          <span>מחיר פתיחה:</span>
                          <span className="font-medium">{auction.startingPrice}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>הצעה נוכחית:</span>
                          <span className="font-medium text-green-600">{auction.currentBid}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{auction.timeRemaining}</span>
                        </div>
                        <span>{auction.bidCount} הצעות</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="active-auctions" className="space-y-4">
            {/* Active Auctions List */}
            <div className="space-y-3">
              {mockActiveAuctions.map((auction) => (
                <Card 
                  key={auction.id} 
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/mobile/auction/${auction.vehicleId}`)}
                >
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={auction.image} 
                        alt={`${auction.make} ${auction.model}`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{auction.make} {auction.model}</h3>
                          <p className="text-sm text-muted-foreground">{auction.year}</p>
                        </div>
                        <div className="text-left">
                          <div className="text-lg font-bold text-green-600">
                            {auction.currentBid}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{auction.timeRemaining}</span>
                        </div>
                        <span>{auction.bidCount} הצעות</span>
                      </div>

                      {auction.canBid && (
                        <Button 
                          size="sm" 
                          className="w-full gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/mobile/create-bid-details/${auction.vehicleId}`);
                          }}
                        >
                          <Gavel className="w-4 h-4" />
                          הגש הצעה
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
};