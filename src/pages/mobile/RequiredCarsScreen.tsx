import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Clock, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GradientBorderContainer } from '@/components/ui/gradient-border-container';
import { GradientSeparator } from '@/components/ui/gradient-separator';
import { VehicleFilterDrawer } from '@/components/mobile/VehicleFilterDrawer';
import { applyVehicleFilters, getActiveFilterCount, VehicleFilters } from '@/utils/mobile/vehicleFilters';
import darkCarImage from "@/assets/dark_car.png";
import {
  PageContainer,
  PageHeader,
  FilterButton,
  ActiveFiltersDisplay,
  ResultsCount,
} from "@/components/common";

// Mock data for ISO requests
const mockISORequests = [
  {
    id: 1,
    vehicleType: "טויוטה קמרי",
    year: "2020-2022",
    priceRange: "₪80,000 - ₪120,000",
    status: "active",
    matchCount: 3,
    createdDate: "לפני שבוע",
    requirements: "אוטומט, לא אחרי תאונה",
    image: darkCarImage
  },
  {
    id: 2,
    vehicleType: "מרצדס C-Class",
    year: "2019-2021",
    priceRange: "₪150,000 - ₪200,000",
    status: "matches",
    matchCount: 1,
    createdDate: "לפני 3 ימים",
    requirements: "דיזל, צבע כהה",
    image: darkCarImage
  },
  {
    id: 3,
    vehicleType: "BMW X3",
    year: "2018-2020",
    priceRange: "₪120,000 - ₪180,000",
    status: "completed",
    matchCount: 0,
    createdDate: "לפני חודש",
    requirements: "4WD, עור",
    image: darkCarImage
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-blue-500';
    case 'matches': return 'bg-green-500';
    case 'completed': return 'bg-gray-500';
    default: return 'bg-gray-500';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'active': return 'פעיל';
    case 'matches': return 'נמצאו התאמות';
    case 'completed': return 'הושלם';
    default: return 'לא ידוע';
  }
};

export const RequiredCarsScreen = () => {
  const navigate = useNavigate();
  const [showMyRequests, setShowMyRequests] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<VehicleFilters>({});

  const activeFilterCount = getActiveFilterCount(filters);

  return (
    <PageContainer>
      <PageHeader 
        title={showMyRequests ? "הבקשות שלי" : "כל הבקשות"}
        onBack={showMyRequests ? () => setShowMyRequests(false) : () => navigate('/mobile/dashboard')}
        rightAction={
          !showMyRequests ? (
            <GradientBorderContainer className="rounded-md">
              <Button 
                variant="outline"
                onClick={() => setShowMyRequests(true)}
                className="border-0"
              >
                הבקשות שלי
              </Button>
            </GradientBorderContainer>
          ) : (
            <GradientBorderContainer className="rounded-md">
              <Button
                onClick={() => navigate('/mobile/create-iso-request')}
                variant="outline"
                className="border-0"
              >
                <Plus className="w-4 h-4 ml-2" />
                צור בקשה
              </Button>
            </GradientBorderContainer>
          )
        }
      />
      
      {!showMyRequests ? (
        <>
          {/* All Requests View */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <ResultsCount count={mockISORequests.length} isLoading={false} />
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

          {/* ISO Requests List */}
          <div className="space-y-3">
              {mockISORequests.map((request) => (
                <GradientBorderContainer
                  key={request.id}
                  className="rounded-md flex-1"
                >
                  <Card
                    className="cursor-pointer hover:shadow-md transition-shadow border-0 bg-black rounded-md overflow-hidden"
                    onClick={() => navigate(`/mobile/iso-requests/${request.id}`)}
                  >
                    {/* Row 1: Image + Details */}
                    <div className="flex items-stretch">

                      
                      {/* Column 2: Two Rows */}
                      <div className="flex-1 flex flex-col">
                        {/* Top Row: Name/Year/Status + Matches */}
                        <div className="flex items-center justify-between p-4 pb-2">
                          {/* Left side: Name, Year, Status */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white hebrew-text">
                              {request.vehicleType}
                            </h3>
                            <p className="text-sm text-white/70 hebrew-text mb-2">
                              {request.year}
                            </p>
                            <Badge className={`text-white ${getStatusColor(request.status)} w-fit`}>
                              {getStatusText(request.status)}
                            </Badge>
                          </div>
                          
                          {/* Right side: Match Count */}
                          <div className="flex flex-col items-center space-y-1 pl-4">
                            {request.matchCount > 0 ? (
                              <>
                                <span className="text-white/70 hebrew-text text-center text-xs">התאמות</span>
                                <span className="text-2xl font-bold text-green-400 hebrew-text text-center">{request.matchCount}</span>
                              </>
                            ) : (
                              <span className="text-white/70 hebrew-text text-center text-xs">אין התאמות</span>
                            )}
                          </div>
                        </div>
                        
                        
                        {/* Bottom Row: Price Range */}
                        <div className="px-4 py-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-white/70 hebrew-text">טווח מחיר:</span>
                            <span className="font-medium text-white hebrew-text text-sm">{request.priceRange}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <GradientSeparator />
                    
                    {/* Row 2: Time + Requirements */}
                    <div className="flex w-full items-center justify-center gap-4 mt-0 text-sm text-white/70 py-2">
                      <div className="flex items-center gap-1 justify-center">
                        <Clock className="w-3 h-3" />
                        <span className="hebrew-text text-center">{request.createdDate}</span>
                      </div>
                      <span className="hebrew-text text-center">{request.requirements}</span>
                    </div>
                  </Card>
                </GradientBorderContainer>
              ))}
            </div>
        </>
      ) : (
        <>
          {/* My Requests View */}
          <div className="mb-4">
            <ResultsCount count={mockISORequests.filter(req => req.id <= 2).length} isLoading={false} />
          </div>

          {/* Filter Options */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            <Button variant="default" size="sm" className="px-4 whitespace-nowrap">
              הכל
            </Button>
            <Button variant="outline" size="sm" className="px-4 whitespace-nowrap">
              פעיל
            </Button>
            <Button variant="outline" size="sm" className="px-4 whitespace-nowrap">
              התאמות
            </Button>
            <Button variant="outline" size="sm" className="px-4 whitespace-nowrap">
              הושלם
            </Button>
          </div>

          {/* My ISO Requests List - filtered to show only user's requests */}
          <div className="space-y-3">
            {mockISORequests.filter(req => req.id <= 2).map((request) => (
                <GradientBorderContainer
                  key={request.id}
                  className="rounded-md flex-1"
                >
                  <Card
                    className="cursor-pointer hover:shadow-md transition-shadow border-0 bg-black rounded-md overflow-hidden"
                    onClick={() => navigate(`/mobile/iso-requests/${request.id}`)}
                  >
                    {/* Row 1: Image + Details */}
                    <div className="flex items-stretch">

                      
                      {/* Column 2: Two Rows */}
                      <div className="flex-1 flex flex-col">
                        {/* Top Row: Name/Year/Status + Matches */}
                        <div className="flex items-center justify-between p-4 pb-2">
                          {/* Left side: Name, Year, Status */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white hebrew-text">
                              {request.vehicleType}
                            </h3>
                            <p className="text-sm text-white/70 hebrew-text mb-2">
                              {request.year}
                            </p>
                            <Badge className={`text-white ${getStatusColor(request.status)} w-fit`}>
                              {getStatusText(request.status)}
                            </Badge>
                          </div>
                          
                          {/* Right side: Match Count */}
                          <div className="flex flex-col items-center space-y-1 pl-4">
                            {request.matchCount > 0 ? (
                              <>
                                <span className="text-white/70 hebrew-text text-center text-xs">התאמות</span>
                                <span className="text-2xl font-bold text-green-400 hebrew-text text-center">{request.matchCount}</span>
                              </>
                            ) : (
                              <span className="text-white/70 hebrew-text text-center text-xs">אין התאמות</span>
                            )}
                          </div>
                          
                        </div>
                        
                        
                        {/* Bottom Row: Price Range */}
                        <div className="px-4 py-2">
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-white/70 hebrew-text">טווח מחיר:</span>
                            <span className="font-medium text-white hebrew-text text-sm">{request.priceRange}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <GradientSeparator />
                    
                    {/* Row 2: Time + Requirements */}
                    <div className="flex w-full items-center justify-center gap-4 mt-0 text-sm text-white/70 py-2">
                      <div className="flex items-center gap-1 justify-center">
                        <Clock className="w-3 h-3" />
                        <span className="hebrew-text text-center">{request.createdDate}</span>
                      </div>
                      <span className="hebrew-text text-center">{request.requirements}</span>
                    </div>
                  </Card>
                </GradientBorderContainer>
            ))}
          </div>

          {/* Empty State for My Requests */}
          {mockISORequests.filter(req => req.id <= 2).length === 0 && (
            <div className="text-center py-12">
              <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">אין לך בקשות פעילות</h3>
              <p className="text-muted-foreground mb-4">
                צור בקשה חדשה לרכב שאתה מחפש
              </p>
              <Button onClick={() => navigate('/mobile/create-iso-request')}>
                צור בקשה ראשונה
              </Button>
            </div>
          )}
        </>
      )}

      {/* Filter Drawer */}
      <VehicleFilterDrawer
        open={filterDrawerOpen}
        onOpenChange={setFilterDrawerOpen}
        currentFilters={filters}
        onApplyFilters={setFilters}
      />
    </PageContainer>
  );
};

export default RequiredCarsScreen;