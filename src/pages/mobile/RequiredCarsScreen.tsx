import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Clock, Loader2, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { openOrCreateChat } from '@/utils/mobile/chatHelpers';
import { GradientBorderContainer } from '@/components/ui/gradient-border-container';
import { GradientSeparator } from '@/components/ui/gradient-separator';
import { VehicleFilterDrawer } from '@/components/mobile/VehicleFilterDrawer';
import { getActiveFilterCount, VehicleFilters } from '@/utils/mobile/vehicleFilters';
import {
  PageContainer,
  PageHeader,
  FilterButton,
  ActiveFiltersDisplay,
  ResultsCount,
} from "@/components/common";
import { useISORequests, useMyISORequests } from '@/hooks/mobile/useISORequests';
import { format } from 'date-fns';

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

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'היום';
    if (diffInDays === 1) return 'אתמול';
    if (diffInDays < 7) return `לפני ${diffInDays} ימים`;
    if (diffInDays < 30) return `לפני ${Math.floor(diffInDays / 7)} שבועות`;
    return `לפני ${Math.floor(diffInDays / 30)} חודשים`;
  } catch {
    return dateString;
  }
};

const handleMessageRequester = async (requestId: string, requesterId: string, navigate: any, e: React.MouseEvent) => {
  e.stopPropagation();
  try {
    const conversationId = await openOrCreateChat({
      otherUserId: requesterId,
      entityType: 'iso_request',
      entityId: requestId
    });
    navigate(`/mobile/chat/${conversationId}`);
  } catch (error) {
    console.error('Error opening chat:', error);
  }
};

export const RequiredCarsScreen = () => {
  const navigate = useNavigate();
  const [showMyRequests, setShowMyRequests] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<VehicleFilters>({});
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: allRequests = [], isLoading: isLoadingAll } = useISORequests();
  const { data: myRequests = [], isLoading: isLoadingMy } = useMyISORequests();

  const activeFilterCount = getActiveFilterCount(filters);
  
  const filteredMyRequests = statusFilter === 'all' 
    ? myRequests 
    : myRequests.filter(req => req.status === statusFilter);

  const isLoading = showMyRequests ? isLoadingMy : isLoadingAll;
  const requests = showMyRequests ? filteredMyRequests : allRequests;

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
            <ResultsCount count={requests.length} isLoading={isLoading} />
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

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((request: any) => (
                <GradientBorderContainer
                  key={request.id}
                  className="rounded-md flex-1"
                >
                  <Card
                    className="cursor-pointer hover:shadow-md transition-shadow border-0 bg-black rounded-md overflow-hidden"
                    onClick={() => navigate(`/mobile/iso-requests/${request.id}`)}
                  >
                    <div className="flex items-stretch">
                      <div className="flex-1 flex flex-col">
                        <div className="flex items-center justify-between p-4 pb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white hebrew-text">
                              {request.title}
                            </h3>
                            <p className="text-sm text-white/70 hebrew-text mb-2">
                              {request.year_from && request.year_to 
                                ? `${request.year_from}-${request.year_to}` 
                                : request.year_from || request.year_to || 'כל השנים'}
                            </p>
                            <Badge className={`text-white ${getStatusColor(request.status)} w-fit`}>
                              {getStatusText(request.status)}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="px-4 py-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-white/70 hebrew-text">טווח מחיר:</span>
                            <span className="font-medium text-white hebrew-text text-sm">
                              {request.price_from && request.price_to 
                                ? `₪${request.price_from.toLocaleString()} - ₪${request.price_to.toLocaleString()}`
                                : request.price_from 
                                ? `מ-₪${request.price_from.toLocaleString()}`
                                : request.price_to
                                ? `עד ₪${request.price_to.toLocaleString()}`
                                : 'לא צוין'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <GradientSeparator />
                    
                    <div className="flex w-full items-center justify-between gap-4 px-4 py-2 text-sm text-white/70">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span className="hebrew-text">{formatDate(request.created_at)}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => handleMessageRequester(request.id, request.requester_id, navigate, e)}
                        className="gap-1 h-8 text-xs"
                      >
                        <MessageCircle className="w-3 h-3" />
                        הודעה
                      </Button>
                    </div>
                  </Card>
                </GradientBorderContainer>
              ))}

              {requests.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground hebrew-text">אין בקשות חיפוש זמינות</p>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <>
          {/* My Requests View */}
          <div className="mb-4">
            <ResultsCount count={requests.length} isLoading={isLoading} />
          </div>

          {/* Filter Options */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            <Button 
              variant={statusFilter === 'all' ? 'default' : 'outline'} 
              size="sm" 
              className="px-4 whitespace-nowrap"
              onClick={() => setStatusFilter('all')}
            >
              הכל
            </Button>
            <Button 
              variant={statusFilter === 'active' ? 'default' : 'outline'} 
              size="sm" 
              className="px-4 whitespace-nowrap"
              onClick={() => setStatusFilter('active')}
            >
              פעיל
            </Button>
            <Button 
              variant={statusFilter === 'completed' ? 'default' : 'outline'} 
              size="sm" 
              className="px-4 whitespace-nowrap"
              onClick={() => setStatusFilter('completed')}
            >
              הושלם
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((request: any) => (
                <GradientBorderContainer
                  key={request.id}
                  className="rounded-md flex-1"
                >
                  <Card
                    className="cursor-pointer hover:shadow-md transition-shadow border-0 bg-black rounded-md overflow-hidden"
                    onClick={() => navigate(`/mobile/iso-requests/${request.id}`)}
                  >
                    <div className="flex items-stretch">
                      <div className="flex-1 flex flex-col">
                        <div className="flex items-center justify-between p-4 pb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white hebrew-text">
                              {request.title}
                            </h3>
                            <p className="text-sm text-white/70 hebrew-text mb-2">
                              {request.year_from && request.year_to 
                                ? `${request.year_from}-${request.year_to}` 
                                : request.year_from || request.year_to || 'כל השנים'}
                            </p>
                            <Badge className={`text-white ${getStatusColor(request.status)} w-fit`}>
                              {getStatusText(request.status)}
                            </Badge>
                          </div>
                          
                          {/* Right side: Offer Count - Only for My Requests */}
                          <div className="flex flex-col items-center space-y-1 pl-4">
                            {request.offer_count > 0 ? (
                              <>
                                <span className="text-white/70 hebrew-text text-center text-xs">התאמות</span>
                                <span className="text-2xl font-bold text-green-400 hebrew-text text-center">{request.offer_count}</span>
                              </>
                            ) : (
                              <span className="text-white/70 hebrew-text text-center text-xs">אין התאמות</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="px-4 py-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-white/70 hebrew-text">טווח מחיר:</span>
                            <span className="font-medium text-white hebrew-text text-sm">
                              {request.price_from && request.price_to 
                                ? `₪${request.price_from.toLocaleString()} - ₪${request.price_to.toLocaleString()}`
                                : request.price_from 
                                ? `מ-₪${request.price_from.toLocaleString()}`
                                : request.price_to
                                ? `עד ₪${request.price_to.toLocaleString()}`
                                : 'לא צוין'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <GradientSeparator />
                    
                    <div className="flex w-full items-center justify-center gap-4 mt-0 text-sm text-white/70 py-2">
                      <div className="flex items-center gap-1 justify-center">
                        <Clock className="w-3 h-3" />
                        <span className="hebrew-text text-center">{formatDate(request.created_at)}</span>
                      </div>
                      {request.additional_requirements && (
                        <span className="hebrew-text text-center line-clamp-1">{request.additional_requirements}</span>
                      )}
                    </div>
                  </Card>
                </GradientBorderContainer>
              ))}

              {requests.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground hebrew-text mb-4">
                    {statusFilter === 'all' 
                      ? 'אין לך בקשות חיפוש'
                      : `אין בקשות ${getStatusText(statusFilter)}`}
                  </p>
                  <Button onClick={() => navigate('/mobile/create-iso-request')}>
                    צור בקשה ראשונה
                  </Button>
                </div>
              )}
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
