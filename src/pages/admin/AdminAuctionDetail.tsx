import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight, Edit, Car, User, Clock, Gavel, DollarSign, Eye, Calendar, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock auction data
const mockAuctionData = {
  id: "a456",
  title: "אאודי A4 2020 - מכירה פומבית",
  vehicle: {
    make: "אאודי",
    model: "A4",
    year: 2020,
    kilometers: 45000,
    fuelType: "בנזין",
    transmission: "אוטומטי",
    color: "שחור מטאלי",
    engineSize: "2.0L",
    hand: "ידיים ראשונות",
    condition: "מצוין"
  },
  seller: {
    name: "רונן אוטו",
    business: "רונן אוטו בע״מ",
    email: "info@ronan-auto.co.il",
    phone: "03-555-1234",
    rating: 4.7,
    location: "פתח תקווה"
  },
  auction: {
    startingPrice: 75000,
    currentBid: 89500,
    reservePrice: 85000,
    startTime: "2024-01-08 10:00",
    endTime: "2024-01-12 18:00",
    status: "active",
    totalBids: 15,
    uniqueBidders: 8,
    timeRemaining: "2 ימים 5 שעות",
    viewsCount: 156,
    watchersCount: 23
  },
  description: "אאודי A4 2020 במצב מצוין, ידיים ראשונות, טופלה במוסך מורשה בלבד. הרכב כולל מערכת ניווט, מושבי עור, חלונות כהים ומערכת בטיחות מתקדמת.",
  features: ["מערכת ניווט", "מושבי עור", "חלונות כהים", "מערכת בטיחות", "מזגן אוטומטי", "חישוקי סגסוגת"],
  images: [
    "/api/placeholder/400/300",
    "/api/placeholder/400/300", 
    "/api/placeholder/400/300",
    "/api/placeholder/400/300"
  ]
};

const mockBids = [
  { id: "b1", bidder: "דוד כהן", business: "כהן מוטורס", amount: 89500, time: "2024-01-10 15:30", status: "current" },
  { id: "b2", bidder: "משה לוי", business: "לוי אוטו", amount: 87000, time: "2024-01-10 14:15", status: "outbid" },
  { id: "b3", bidder: "יוסי גרין", business: "גרין קארס", amount: 85500, time: "2024-01-10 13:45", status: "outbid" },
  { id: "b4", bidder: "אברהם שמש", business: "שמש מוטורס", amount: 83000, time: "2024-01-10 12:20", status: "outbid" },
  { id: "b5", bidder: "רחל דוד", business: "דוד אוטו", amount: 80000, time: "2024-01-10 11:00", status: "outbid" }
];

const AdminAuctionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success text-success-foreground">פעילה</Badge>;
      case 'ended':
        return <Badge variant="secondary">הסתיימה</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">בוטלה</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getBidStatusBadge = (status: string) => {
    switch (status) {
      case 'current':
        return <Badge className="bg-success text-success-foreground">הצעה מובילה</Badge>;
      case 'outbid':
        return <Badge variant="outline">עלתה עליה</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTimeRemainingColor = (timeRemaining: string) => {
    if (timeRemaining.includes('דקות') || timeRemaining.includes('שעה')) {
      return 'text-destructive';
    } else if (timeRemaining.includes('שעות')) {
      return 'text-warning';
    }
    return 'text-foreground';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/admin/auctions')}
          className="hebrew-text"
        >
          <ArrowRight className="h-4 w-4 ml-1" />
          חזור לרשימת מכירות פומביות
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold hebrew-text">{mockAuctionData.title}</h1>
          <p className="text-lg text-muted-foreground hebrew-text mt-1">מכירה פומבית #{mockAuctionData.id}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="hebrew-text">
            <Edit className="h-4 w-4 ml-2" />
            עריכת מכירה
          </Button>
          <Button variant="destructive" className="hebrew-text">
            ביטול מכירה
          </Button>
          <Button className="hebrew-text">צפייה כמשתמש</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground hebrew-text">הצעה נוכחית</p>
                <p className="text-2xl font-bold">₪{mockAuctionData.auction.currentBid.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground hebrew-text">זמן נותר</p>
                <p className={`text-xl font-bold hebrew-text ${getTimeRemainingColor(mockAuctionData.auction.timeRemaining)}`}>
                  {mockAuctionData.auction.timeRemaining}
                </p>
              </div>
              <Clock className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground hebrew-text">הצעות</p>
                <p className="text-2xl font-bold">{mockAuctionData.auction.totalBids}</p>
                <p className="text-xs text-muted-foreground hebrew-text">{mockAuctionData.auction.uniqueBidders} מציעים</p>
              </div>
              <Gavel className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground hebrew-text">צפיות</p>
                <p className="text-2xl font-bold">{mockAuctionData.auction.viewsCount}</p>
                <p className="text-xs text-muted-foreground hebrew-text">{mockAuctionData.auction.watchersCount} עוקבים</p>
              </div>
              <Eye className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status and Details */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-muted-foreground hebrew-text">סטטוס מכירה</p>
                {getStatusBadge(mockAuctionData.auction.status)}
              </div>
              <div>
                <p className="text-sm text-muted-foreground hebrew-text">מחיר מינימלי</p>
                <p className="font-medium">₪{mockAuctionData.auction.reservePrice.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground hebrew-text">מחיר פתיחה</p>
                <p className="font-medium">₪{mockAuctionData.auction.startingPrice.toLocaleString()}</p>
              </div>
            </div>
            <div className="text-left">
              <p className="text-sm text-muted-foreground hebrew-text">זמני מכירה</p>
              <p className="font-medium">{mockAuctionData.auction.startTime} - {mockAuctionData.auction.endTime}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="vehicle" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4" dir="rtl">
          <TabsTrigger value="activity" className="hebrew-text">פעילות</TabsTrigger>
          <TabsTrigger value="bids" className="hebrew-text">הצעות ({mockBids.length})</TabsTrigger>
          <TabsTrigger value="seller" className="hebrew-text">פרטי מוכר</TabsTrigger>
          <TabsTrigger value="vehicle" className="hebrew-text">פרטי רכב</TabsTrigger>
        </TabsList>

        <TabsContent value="vehicle">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="hebrew-text text-right">מפרט טכני</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-right">
                    <div>
                      <p className="text-sm text-muted-foreground hebrew-text">יצרן</p>
                      <p className="font-medium hebrew-text">{mockAuctionData.vehicle.make}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground hebrew-text">דגם</p>
                      <p className="font-medium hebrew-text">{mockAuctionData.vehicle.model}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground hebrew-text">שנת ייצור</p>
                      <p className="font-medium">{mockAuctionData.vehicle.year}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground hebrew-text">קילומטראז'</p>
                      <p className="font-medium">{mockAuctionData.vehicle.kilometers.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground hebrew-text">סוג דלק</p>
                      <p className="font-medium hebrew-text">{mockAuctionData.vehicle.fuelType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground hebrew-text">תיבת הילוכים</p>
                      <p className="font-medium hebrew-text">{mockAuctionData.vehicle.transmission}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground hebrew-text">צבע</p>
                      <p className="font-medium hebrew-text">{mockAuctionData.vehicle.color}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground hebrew-text">יד</p>
                      <p className="font-medium hebrew-text">{mockAuctionData.vehicle.hand}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="hebrew-text text-right">תיאור ואבזור</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-right">
                  <div>
                    <h4 className="font-medium hebrew-text mb-2">תיאור</h4>
                    <p className="text-sm text-muted-foreground hebrew-text leading-relaxed">
                      {mockAuctionData.description}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium hebrew-text mb-2">אבזור נוסף</h4>
                    <div className="flex flex-wrap gap-2 justify-end">
                      {mockAuctionData.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="hebrew-text">{feature}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="seller">
          <Card>
            <CardHeader>
              <CardTitle className="hebrew-text">פרטי המוכר</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold hebrew-text">{mockAuctionData.seller.name}</h3>
                    <p className="text-muted-foreground hebrew-text">{mockAuctionData.seller.business}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-muted-foreground hebrew-text">דירוג:</span>
                      <span className="font-medium">{mockAuctionData.seller.rating}/5</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground hebrew-text">דוא"ל</p>
                        <p className="font-medium">{mockAuctionData.seller.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground hebrew-text">טלפון</p>
                        <p className="font-medium">{mockAuctionData.seller.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground hebrew-text">מיקום</p>
                        <p className="font-medium hebrew-text">{mockAuctionData.seller.location}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Button className="w-full hebrew-text">
                      <User className="h-4 w-4 ml-2" />
                      צפה בפרופיל המלא
                    </Button>
                    <Button variant="outline" className="w-full hebrew-text">
                      צפה בכל הרכבים
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bids">
          <Card>
            <CardHeader>
              <CardTitle className="hebrew-text">היסטוריית הצעות</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right hebrew-text">מציע</TableHead>
                    <TableHead className="text-right hebrew-text">עסק</TableHead>
                    <TableHead className="text-right hebrew-text">סכום הצעה</TableHead>
                    <TableHead className="text-right hebrew-text">זמן הצעה</TableHead>
                    <TableHead className="text-right hebrew-text">סטטוס</TableHead>
                    <TableHead className="text-right hebrew-text">פעולות</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBids.map((bid) => (
                    <TableRow key={bid.id}>
                      <TableCell className="font-medium hebrew-text">{bid.bidder}</TableCell>
                      <TableCell className="hebrew-text">{bid.business}</TableCell>
                      <TableCell className="font-bold">₪{bid.amount.toLocaleString()}</TableCell>
                      <TableCell>{bid.time}</TableCell>
                      <TableCell>{getBidStatusBadge(bid.status)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="hebrew-text">
                          פרטי מציע
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle className="hebrew-text">פעילות אחרונה</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-2 border-primary pl-4 pb-4">
                  <p className="font-medium hebrew-text">הצעה חדשה התקבלה</p>
                  <p className="text-sm text-muted-foreground">דוד כהן הציע ₪89,500 - לפני 2 שעות</p>
                </div>
                <div className="border-l-2 border-muted pl-4 pb-4">
                  <p className="font-medium hebrew-text">הצעה עלתה</p>
                  <p className="text-sm text-muted-foreground">משה לוי הציע ₪87,000 - לפני 3 שעות</p>
                </div>
                <div className="border-l-2 border-muted pl-4 pb-4">
                  <p className="font-medium hebrew-text">צפייה חדשה</p>
                  <p className="text-sm text-muted-foreground">10 צפיות חדשות - לפני 4 שעות</p>
                </div>
                <div className="border-l-2 border-muted pl-4 pb-4">
                  <p className="font-medium hebrew-text">הצעה התקבלה</p>
                  <p className="text-sm text-muted-foreground">יוסי גרין הציע ₪85,500 - לפני 5 שעות</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAuctionDetail;