import { useState } from "react";
import { FileText, Plus, Clock, CheckCircle, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for search requests
const searchRequests = [
  {
    id: 1,
    title: "טויוטה קורולה 2020",
    status: "פתוח",
    offersCount: 3,
    dateCreated: "לפני שבוע"
  },
  {
    id: 2,
    title: "BMW X3 היברידי",
    status: "פתוח",
    offersCount: 7,
    dateCreated: "לפני 3 ימים"
  },
  {
    id: 3,
    title: "מרצדס E-Class 2019-2021",
    status: "סגור",
    offersCount: 12,
    dateCreated: "לפני חודש"
  },
  {
    id: 4,
    title: "רכב עירוני חסכוני",
    status: "פתוח",
    offersCount: 5,
    dateCreated: "לפני יומיים"
  }
];

const ISORequestsScreen = () => {
  return (
    <div className="space-y-4">
      {/* Screen Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground hebrew-text">רכבים דרושים</h1>
        <Button size="sm" className="hebrew-text">
          <Plus className="h-4 w-4 ml-2" />
          בקשה חדשה
        </Button>
      </div>
      
      <Tabs defaultValue="mine" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="mine" className="hebrew-text">החיפושים שלי</TabsTrigger>
          <TabsTrigger value="all" className="hebrew-text">כל החיפושים</TabsTrigger>
        </TabsList>
        
        <TabsContent value="mine" className="space-y-4">
          <div className="space-y-3">
            {searchRequests.map((request) => (
              <Card key={request.id} className="card-interactive cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4 space-x-reverse">
                    {/* Request Icon */}
                    <div className="relative w-20 h-20 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      <Search className="h-10 w-10 text-muted-foreground" />
                      {request.status === "פתוח" && (
                        <Badge variant="default" className="absolute -top-1 -right-1 text-xs">
                          פעיל
                        </Badge>
                      )}
                    </div>

                    {/* Request Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-foreground hebrew-text">
                          {request.title}
                        </h3>
                        <Badge 
                          variant={request.status === "פתוח" ? "default" : "secondary"}
                          className="hebrew-text"
                        >
                          {request.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 ml-1" />
                          <span className="hebrew-text">{request.offersCount} הצעות</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 ml-1" />
                          <span className="hebrew-text">{request.dateCreated}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {searchRequests.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground hebrew-text">אין לך בקשות חיפוש פעילות</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="all" className="space-y-4">
          <div className="space-y-3">
            {searchRequests.map((request) => (
              <Card key={request.id} className="card-interactive cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4 space-x-reverse">
                    {/* Request Icon */}
                    <div className="relative w-20 h-20 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      <Search className="h-10 w-10 text-muted-foreground" />
                      {request.status === "פתוח" && (
                        <Badge variant="default" className="absolute -top-1 -right-1 text-xs">
                          פעיל
                        </Badge>
                      )}
                    </div>

                    {/* Request Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-foreground hebrew-text">
                          {request.title}
                        </h3>
                        <Badge 
                          variant={request.status === "פתוח" ? "default" : "secondary"}
                          className="hebrew-text"
                        >
                          {request.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 ml-1" />
                          <span className="hebrew-text">{request.offersCount} הצעות</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 ml-1" />
                          <span className="hebrew-text">{request.dateCreated}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {searchRequests.filter(() => true).length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground hebrew-text">אין חיפושי רכבים זמינים</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ISORequestsScreen;