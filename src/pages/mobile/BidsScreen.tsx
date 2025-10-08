import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Gavel, Clock, Filter, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { VehicleFilterDrawer } from '@/components/mobile/VehicleFilterDrawer';
import { applyVehicleFilters, getActiveFilterCount, VehicleFilters } from '@/utils/mobile/vehicleFilters';
import darkCarImage from "@/assets/dark_car.png";

// Mock data for bids and auctions
const mockMyBids = [
  {
    id: 1,
    vehicleId: 101,
    make: "טויוטה",
    model: "קמרי",
    year: 2020,
    image: darkCarImage,
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
    image: darkCarImage,
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
    image: darkCarImage,
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
    image: darkCarImage,
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
    image: darkCarImage,
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
  const [activeTab, setActiveTab] = useState("active-auctions");
  const [filters, setFilters] = useState<VehicleFilters>({});
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const filteredActiveAuctions = applyVehicleFilters(
    mockActiveAuctions,
    filters
  );

  const activeFilterCount = getActiveFilterCount(filters);

  return (
    // The MobileLayout component is replaced with a div
    // You might want to add some padding or margin classes here
    // e.g., <div className="p-4"> to mimic a layout's spacing
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="active-auctions">כל המכרזים</TabsTrigger>
          <TabsTrigger value="my-auctions">המכרזים שלי</TabsTrigger>
        </TabsList>

          <TabsContent value="active-auctions" className="space-y-4">
            {/* Filter Button */}
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setFilterDrawerOpen(true)}
                className="relative gap-2"
              >
                <Filter className="h-4 w-4" />
                סנן מכרזים
                {activeFilterCount > 0 && (
                  <Badge 
                    className="h-5 w-5 p-0 flex items-center justify-center text-xs"
                    variant="destructive"
                  >
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Active Filters Display */}
            {activeFilterCount > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground hebrew-text">
                  {activeFilterCount} פילטרים פעילים
                </span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setFilters({})}
                >
                  נקה הכל
                </Button>
              </div>
            )}

            {/* My Bids Section First */}
            <div>
              <h3 className="font-medium mb-3 text-blue-800 text-right">ההצעות שלי</h3>
              <div className="space-y-3">
                {mockMyBids.map((bid) => (
                  <Card
                    key={bid.id}
                    className="p-4 cursor-pointer hover:shadow-md transition-shadow border-blue-200"
                    onClick={() => navigate(`/mobile/auction/${bid.vehicleId}`)}
                  >
                    <div className="flex">
                      <div className="flex-1 p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="text-right">
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

                      <div className="w-24 h-24 overflow-hidden flex-shrink-0">
                        <img
                          src={bid.image}
                          alt={`${bid.make} ${bid.model}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* All Other Auctions */}
            <div>
              <h3 className="font-medium mb-3 text-right">כל המכרזים ({filteredActiveAuctions.length})</h3>
              <div className="space-y-3">
                {filteredActiveAuctions.map((auction) => (
                  <Card
                    key={auction.id}
                    className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigate(`/mobile/auction/${auction.vehicleId}`)}
                  >
                    <div className="flex">
                      <div className="flex-1 p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="text-right">
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

                      <div className="w-24 h-24 overflow-hidden flex-shrink-0">
                        <img
                          src={auction.image}
                          alt={`${auction.make} ${auction.model}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="my-auctions" className="space-y-4">
            {/* Create New Auction Button */}
            <Button
              onClick={() => navigate('/mobile/add-auction')}
              className="w-full gap-2"
            >
              <Plus className="w-4 h-4" />
              צור מכרז חדש
            </Button>

            {/* My Auctions List */}
            <div className="space-y-3">
              {mockMyAuctions.map((auction) => (
                <Card
                  key={auction.id}
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow border-green-200"
                  onClick={() => navigate(`/mobile/auction/${auction.vehicleId}`)}
                >
                  <div className="flex">
                    <div className="flex-1 p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-right">
                          <h3 className="font-semibold">{auction.make} {auction.model}</h3>
                          <p className="text-sm text-muted-foreground">{auction.year}</p>
                        </div>
                        <Badge className="bg-green-500 text-white">
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

                    <div className="w-24 h-24 overflow-hidden flex-shrink-0">
                      <img
                        src={auction.image}
                        alt={`${auction.make} ${auction.model}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Empty State for My Auctions */}
            {mockMyAuctions.length === 0 && (
              <div className="text-center py-12">
                <Gavel className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">אין לך מכרזים פעילים</h3>
                <p className="text-muted-foreground mb-4">
                  צור מכרז חדש לרכב שלך
                </p>
                <Button onClick={() => navigate('/mobile/add-auction')}>
                  צור מכרז ראשון
                </Button>
              </div>
            )}
          </TabsContent>
      </Tabs>

      {/* Filter Drawer */}
      <VehicleFilterDrawer
        open={filterDrawerOpen}
        onOpenChange={setFilterDrawerOpen}
        currentFilters={filters}
        onApplyFilters={setFilters}
      />
    </div>
  );
};