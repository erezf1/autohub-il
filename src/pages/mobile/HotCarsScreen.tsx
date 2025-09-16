import React, { useState } from 'react';
// import MobileLayout from '@/components/mobile/MobileLayout'; // <--- This line is removed
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Flame, Clock, TrendingUp, Zap, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock data for boosted vehicles
const mockBoostedVehicles = [
  {
    id: 1,
    make: "מרצדס",
    model: "E-Class",
    year: 2020,
    price: "₪180,000",
    image: "/lovable-uploads/5f941758-f133-4982-a8a0-3da09c4677f5.png",
    location: "תל אביב",
    boostTimeRemaining: "2 ימים ו-14 שעות",
    boostedBy: "דילר פרמיום",
    kilometers: "45,000 ק\"מ",
    isOwn: false
  },
  {
    id: 2,
    make: "BMW",
    model: "X5",
    year: 2021,
    price: "₪220,000",
    image: "/lovable-uploads/6daec4a1-44e1-4924-8b14-0ae85967e9a4.png",
    location: "חיפה",
    boostTimeRemaining: "1 יום ו-8 שעות",
    boostedBy: "הרכבים שלי",
    kilometers: "32,000 ק\"מ",
    isOwn: true
  },
  {
    id: 3,
    make: "אאודי",
    model: "A6",
    year: 2019,
    price: "₪155,000",
    image: "/lovable-uploads/5f941758-f133-4982-a8a0-3da09c4677f5.png",
    location: "ירושלים",
    boostTimeRemaining: "18 שעות",
    boostedBy: "דילר מקצועי",
    kilometers: "58,000 ק\"מ",
    isOwn: false
  }
];

export const HotCarsScreen: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("hot-cars");

  return (
    // The MobileLayout component has been replaced with a div
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="hot-cars">רכבים חמים</TabsTrigger>
          <TabsTrigger value="my-boosts">הבוסטים שלי</TabsTrigger>
        </TabsList>

          <TabsContent value="hot-cars" className="space-y-4">
            {/* Header Info */}
            <div className="bg-gradient-to-l from-orange-500 to-red-500 rounded-lg p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-5 h-5" />
                <h2 className="text-lg font-semibold">רכבים בעדיפות מקסימלית</h2>
              </div>
              <p className="text-sm opacity-90">
                רכבים עם בוסט מוצגים בראش התוצאות למשך 3 ימים
              </p>
            </div>


            {/* Boosted Vehicles List */}
            <div className="space-y-4">
              {mockBoostedVehicles.map((vehicle) => (
                <Card
                  key={vehicle.id}
                  className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow border-orange-200 relative"
                  onClick={() => navigate(`/mobile/vehicle/${vehicle.id}`)}
                >
                  {/* Boost Indicator */}
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-l from-orange-500 to-red-500 text-white p-2 z-10">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        <span className="font-medium">בוסט פעיל</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{vehicle.boostTimeRemaining}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 pt-14 flex-row-reverse">
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={vehicle.image}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2 flex-row-reverse">
                        <div className="text-right">
                          <h3 className="font-semibold text-lg">
                            {vehicle.make} {vehicle.model}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {vehicle.year} • {vehicle.kilometers}
                          </p>
                        </div>
                        <div className="text-left">
                          <div className="text-lg font-bold text-orange-600">
                            {vehicle.price}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {vehicle.location}
                        </span>
                        {vehicle.isOwn && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            הרכב שלי
                          </Badge>
                        )}
                      </div>

                      <div className="mt-2 text-xs text-muted-foreground">
                        בוסט על ידי: {vehicle.boostedBy}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-boosts" className="space-y-4">
            {/* My Boost Status */}
            <Card className="p-4 border-orange-200 bg-orange-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-medium">הבוסטים הזמינים שלי</h3>
                  <p className="text-sm text-muted-foreground">5 בוסטים נותרו החודש</p>
                </div>
                <Badge className="bg-orange-500 text-white">
                  5/10
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>בוסטים שהשתמשת:</span>
                  <span className="font-medium">5</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>בוסטים זמינים:</span>
                  <span className="font-medium text-green-600">5</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>חידוש החבילה:</span>
                  <span className="font-medium">בעוד 12 ימים</span>
                </div>
              </div>
            </Card>

            {/* My Vehicles Available for Boost */}
            <div className="space-y-3">
              <h3 className="font-medium">הרכבים שלי - זמינים לבוסט</h3>

              {mockBoostedVehicles.filter(v => !v.isOwn).map((vehicle) => (
                <Card
                  key={`my-${vehicle.id}`}
                  className="p-4 border-blue-200"
                >
                  <div className="flex gap-4 flex-row-reverse">
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={vehicle.image}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2 flex-row-reverse">
                        <div className="text-right">
                          <h3 className="font-semibold">
                            {vehicle.make} {vehicle.model}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {vehicle.year} • {vehicle.kilometers}
                          </p>
                        </div>
                        <div className="text-left">
                          <div className="text-lg font-bold text-blue-600">
                            {vehicle.price}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {vehicle.location}
                        </span>
                        <Button
                          size="sm"
                          className="gap-2"
                          onClick={() => {
                            // Handle boost activation
                          }}
                        >
                          <Zap className="w-4 h-4" />
                          הפעל בוסט
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Add Vehicle CTA */}
            <Card className="p-4 bg-gradient-to-l from-blue-50 to-purple-50 border-blue-200">
              <div className="text-center">
                <h3 className="font-medium mb-2">רוצה להדגיש את הרכב שלך?</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  הוסף רכב חדש למאגר והפעל עליו בוסט
                </p>
                <Button
                  onClick={() => navigate('/mobile/add-vehicle')}
                  className="w-full gap-2"
                >
                  <Plus className="w-4 h-4" />
                  הוסף רכב חדש
                </Button>
              </div>
            </Card>
          </TabsContent>
      </Tabs>
    </div>
  );
};