import React, { useState } from 'react';
import MobileLayout from '@/components/mobile/MobileLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Clock, CheckCircle, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
    requirements: "אוטומט, לא אחרי תאונה"
  },
  {
    id: 2,
    vehicleType: "מרצדס C-Class",
    year: "2019-2021", 
    priceRange: "₪150,000 - ₪200,000",
    status: "matches",
    matchCount: 1,
    createdDate: "לפני 3 ימים",
    requirements: "דיזל, צבע כהה"
  },
  {
    id: 3,
    vehicleType: "BMW X3",
    year: "2018-2020",
    priceRange: "₪120,000 - ₪180,000", 
    status: "completed",
    matchCount: 0,
    createdDate: "לפני חודש",
    requirements: "4WD, עור"
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

export const RequiredCarsScreen: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");

  return (
    <MobileLayout>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="all">כל הבקשות</TabsTrigger>
          <TabsTrigger value="mine">הבקשות שלי</TabsTrigger>
        </TabsList>

          <TabsContent value="all" className="space-y-4">

            {/* ISO Requests List */}
            <div className="space-y-3">
              {mockISORequests.map((request) => (
                <Card 
                  key={request.id} 
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/mobile/iso-requests/${request.id}`)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{request.vehicleType}</h3>
                      <p className="text-sm text-muted-foreground">{request.year}</p>
                    </div>
                    <Badge 
                      className={`text-white ${getStatusColor(request.status)}`}
                    >
                      {getStatusText(request.status)}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">טווח מחיר:</span>
                      <span className="text-sm font-medium">{request.priceRange}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">דרישות:</span>
                      <span className="text-sm">{request.requirements}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{request.createdDate}</span>
                    </div>
                    
                    {request.matchCount > 0 && (
                      <div className="flex items-center gap-1">
                        <Search className="w-3 h-3" />
                        <span>{request.matchCount} התאמות</span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="mine" className="space-y-4">
            {/* My Requests Management */}
            <Button 
              onClick={() => navigate('/mobile/create-iso-request')}
              className="w-full gap-2"
            >
              <Plus className="w-4 h-4" />
              צור בקשה חדשה
            </Button>

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
                <Card 
                  key={request.id} 
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow border-blue-200"
                  onClick={() => navigate(`/mobile/iso-requests/${request.id}`)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{request.vehicleType}</h3>
                      <p className="text-sm text-muted-foreground">{request.year}</p>
                    </div>
                    <Badge 
                      className={`text-white ${getStatusColor(request.status)}`}
                    >
                      {getStatusText(request.status)}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">טווח מחיר:</span>
                      <span className="text-sm font-medium">{request.priceRange}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">דרישות:</span>
                      <span className="text-sm">{request.requirements}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{request.createdDate}</span>
                    </div>
                    
                    {request.matchCount > 0 && (
                      <div className="flex items-center gap-1">
                        <Search className="w-3 h-3" />
                        <span>{request.matchCount} התאמות</span>
                      </div>
                    )}
                  </div>
                </Card>
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
          </TabsContent>
      </Tabs>
    </MobileLayout>
  );
};