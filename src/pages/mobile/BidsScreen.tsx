import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Gavel, Clock, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { VehicleFilterDrawer } from '@/components/mobile/VehicleFilterDrawer';
import { applyVehicleFilters, getActiveFilterCount, VehicleFilters } from '@/utils/mobile/vehicleFilters';
import { FilterButton } from '@/components/common/FilterButton';
import { ActiveFiltersDisplay } from '@/components/common/ActiveFiltersDisplay';
import darkCarImage from "@/assets/dark_car.png";
import { GradientBorderContainer } from '@/components/ui/gradient-border-container';
import {
  PageContainer,
  PageHeader,
  FilterButton,
  ActiveFiltersDisplay,
  ResultsCount,
} from "@/components/common";
import { GradientSeparator } from "@/components/ui/gradient-separator";


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
  const [showMyAuctions, setShowMyAuctions] = useState(false);
  const [filters, setFilters] = useState<VehicleFilters>({});
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const filteredActiveAuctions = applyVehicleFilters(
    mockActiveAuctions,
    filters
  );

  const activeFilterCount = getActiveFilterCount(filters);

  return (
    <PageContainer>
      <PageHeader
        title={
          <div className="flex items-center gap-2">
            <Gavel className="h-6 w-6 text-blue-500" />
            <span className="hebrew-text">{showMyAuctions ? "המכרזים שלי" : "כל המכרזים"}</span>
          </div>
        }
        onBack={showMyAuctions ? () => setShowMyAuctions(false) : () => navigate('/mobile/dashboard')}
        rightAction={
          !showMyAuctions ? (
            <GradientBorderContainer className="rounded-md">
              <Button
                variant="outline"
                onClick={() => setShowMyAuctions(true)}
                className="border-0"
              >
                המכרזים שלי
              </Button>
            </GradientBorderContainer>
          ) : (
            <GradientBorderContainer className="rounded-md">
              <Button
                onClick={() => navigate('/mobile/add-auction')}
                variant="outline"
                className="border-0"
              >
                <Plus className="h-4 w-4 ml-2" />
                צור מכרז
              </Button>
            </GradientBorderContainer>
          )
        }
      />

      {!showMyAuctions ? (
        <>
          {/* All Auctions View */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <ResultsCount count={filteredActiveAuctions.length + mockMyBids.length} isLoading={false} />
            <GradientBorderContainer className="rounded-md">
              <FilterButton
                activeCount={activeFilterCount}
                onClick={() => setFilterDrawerOpen(true)}
              />
            </GradientBorderContainer>
          </div>

          <ActiveFiltersDisplay
            filterCount={activeFilterCount}
            onClearAll={() => setFilters({})}
          />

          {/* My Bids Section First */}
          <div>
            <h3 className="font-medium mb-3 text-white text-right hebrew-text">ההצעות שלי</h3>
            <div className="space-y-3">
              {mockMyBids.map((bid) => (
                <GradientBorderContainer
                  key={bid.id}
                  className="rounded-md flex-1"
                >
                  <Card
                    className="cursor-pointer hover:shadow-md transition-shadow border-0 bg-black rounded-md overflow-hidden"
                    onClick={() => navigate(`/mobile/auction/${bid.vehicleId}`)}
                  >
                    <div className="flex items-stretch">

                      {/* Bid Image - Right Side, Full Height Square */}
                      <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden bg-muted">
                        <img
                          src={bid.image}
                          alt={`${bid.make} ${bid.model}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Bid Details - Middle */}
                      <div className="flex-1 min-w-0 p-4 flex flex-col justify-center">
                        <div className="mb-2">
                          <h3 className="font-semibold text-white hebrew-text">
                            {bid.make} {bid.model}
                          </h3>
                          <p className="text-sm text-white/70 hebrew-text">
                            {bid.year}
                          </p>
                        </div>

                        <Badge className={`text-white ${getBidStatusColor(bid.status)} w-fit`}>
                          {getBidStatusText(bid.status)}
                        </Badge>
                      </div>
                      {/* Price Column - Left Side, Vertically Centered */}
                      <div className="flex flex-col justify-center p-4 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex flex-col items-center space-y-1">
                            <span className="text-white/70 hebrew-text text-center">ההצעה שלי</span>


                            <span className="font-medium text-white hebrew-text text-center">{bid.myBid}</span>
                          </div>
                        </div>
                        <GradientSeparator />
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex flex-col items-center space-y-1">
                            <span className="text-white/70 hebrew-text text-center">הצעה גבוהה</span>
                            <span className="font-medium text-green-400 hebrew-text text-center">{bid.currentHighest}</span>

                          </div>
                        </div>
                      </div>
                    </div>
                    <GradientSeparator />
                    {/* Bottom Section */}
                    <div className="flex w-full items-center justify-center gap-4 mt-0 text-sm text-white/70">
                      <div className="flex items-center gap-1 justify-center">
                        <Clock className="w-3 h-" />

                        <span className="hebrew-text text-center">{bid.timeRemaining}</span>
                        <span className="hebrew-text text-center pr-2">{bid.bidCount} הצעות</span>
                      </div>
                    </div>
                  </Card>
                </GradientBorderContainer>
              ))}
            </div>
          </div>

          {/* All Other Auctions */}
          <div>
            <h3 className="font-medium mb-3 text-right text-white hebrew-text">כל המכרזים ({filteredActiveAuctions.length})</h3>
            <div className="space-y-3">
              {filteredActiveAuctions.map((auction) => (
                <GradientBorderContainer
                  key={auction.id}
                  className="rounded-md flex-1"
                >
                  <Card
                    className="cursor-pointer hover:shadow-md transition-shadow border-0 bg-black rounded-md overflow-hidden"
                    onClick={() => navigate(`/mobile/auction/${auction.vehicleId}`)}
                  >

                    <div className="flex items-stretch">
                      {/* Auction Image - Right Side, Full Height Square */}
                      <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden bg-muted">
                        <img
                          src={auction.image}
                          alt={`${auction.make} ${auction.model}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Auction Details - Middle */}
                      <div className="flex-1 min-w-0 p-4 flex flex-col justify-center">
                        <div className="mb-2">
                          <h3 className="font-semibold text-white hebrew-text">
                            {auction.make} {auction.model}
                          </h3>
                          <p className="text-sm text-white/70 hebrew-text">
                            {auction.year}
                          </p>
                        </div>

                        <Badge variant="secondary" className="hebrew-text bg-green-500/20 text-green-400 border-green-500/30 w-fit">
                          פעיל
                        </Badge>


                      </div>
                      {/* Price Column - Left Side, Vertically Centered */}
                      <div className="flex flex-col justify-center p-4">

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex flex-col items-end space-y-1">
                            <span className="text-white/70 hebrew-text">הצעה נוכחית</span>
                            <span className="text-lg font-bold text-green-400 hebrew-text">{auction.currentBid}</span>
                          </div>
                        </div>
                        {auction.canBid && (
                          <div className="px-0 pb-0 pt-">
                            <Button
                              size="sm"
                              className="w-20 px-2 py-1 gap-1 text-sm bg-gradient-to-r from-[#2277ee] to-[#5be1fd] text-black hover:from-[#5be1fd] hover:to-[#2277ee] border-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/mobile/create-bid-details/${auction.vehicleId}`);
                              }}
                            >
                              <Gavel className="w-3 h-3" />
                              <span className="text-sm">הגשה</span>
                            </Button>
                          </div>
                        )}
                      </div>

                    </div>
                    <GradientSeparator />
                    <div className="flex w-full items-center justify-center gap-4 mt-0 text-sm text-white/70">
                      <div className="flex items-center gap-1 justify-center">
                        <Clock className="w-3 h-3" />
                        <span className="hebrew-text text-center">{auction.timeRemaining}</span>
                      </div>
                      <span className="hebrew-text text-center">{auction.bidCount} הצעות</span>
                    </div>

                  </Card>
                </GradientBorderContainer>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* My Auctions View */}
          <div className="space-y-3">
            {mockMyAuctions.map((auction) => (
              <GradientBorderContainer
                key={auction.id}
                className="rounded-md flex-1"
              >
                <Card
                  className="cursor-pointer hover:shadow-md transition-shadow border-0 bg-black rounded-md overflow-hidden"
                  onClick={() => navigate(`/mobile/auction/${auction.vehicleId}`)}
                >
                  <div className="flex items-stretch">
                    {/* Auction Image - Right Side, Full Height Square */}
                    <div className="w-24 h-24 bg-muted flex-shrink-0">
                      <img
                        src={auction.image}
                        alt={`${auction.make} ${auction.model}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Auction Details - Middle */}
                    <div className="flex-1 min-w-0 p-4 flex flex-col justify-center">
                      <div className="mb-2">
                        <h3 className="font-semibold text-white hebrew-text">
                          {auction.make} {auction.model}
                        </h3>
                        <p className="text-sm text-white/70 hebrew-text">
                          {auction.year}
                        </p>
                      </div>

                      <Badge className="hebrew-text bg-green-500/20 text-green-400 border-green-500/30 w-fit">
                        פעיל
                      </Badge>
                    </div>
                    {/* Price Column - Left Side, Vertically Centered */}
                    <div className="flex flex-col justify-center p-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-white hebrew-text">{auction.startingPrice}</span>
                        <span className="text-white/70 hebrew-text">:מחיר פתיחה</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-green-400 hebrew-text">{auction.currentBid}</span>
                        <span className="text-white/70 hebrew-text">:הצעה נוכחית</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Section */}
                  <div className="px-4 pb-4">
                    <div className="flex items-center justify-between text-sm text-white/70">
                      <span className="hebrew-text">{auction.timeRemaining}</span>
                      <span className="hebrew-text">{auction.bidCount} הצעות</span>
                    </div>
                  </div>
                </Card>
              </GradientBorderContainer>
            ))}
          </div>

          {/* Empty State for My Auctions */}
          {mockMyAuctions.length === 0 && (
            <div className="text-center py-12">
              <Gavel className="w-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">אין לך מכרזים פעילים</h3>
              <p className="text-muted-foreground mb-4">
                צור מכרז חדש לרכב שלך
              </p>
              <GradientBorderContainer className="rounded-md">
                <Button
                  onClick={() => navigate('/mobile/add-auction')}
                  variant="ghost"
                  className="bg-black border-0 text-white"
                >
                  צור מכרז ראשון
                </Button>
              </GradientBorderContainer>
            </div>
          )}
        </>
      )}      {/* Filter Drawer */}
      <VehicleFilterDrawer
        open={filterDrawerOpen}
        onOpenChange={setFilterDrawerOpen}
        currentFilters={filters}
        onApplyFilters={setFilters}
      />
    </PageContainer>
  );
};