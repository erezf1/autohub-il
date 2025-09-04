import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight, Edit, Mail, Phone, MapPin, Calendar, Activity, CheckCircle, XCircle, Clock, Car, Gavel, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock user data
const mockUserData = {
  id: "12345",
  name: "אברהם כהן",
  business: "כהן מוטורס",
  email: "abraham@kohen-motors.co.il",
  phone: "052-123-4567",
  address: "רחוב הרצל 15, תל אביב",
  status: "active",
  plan: "premium",
  joinDate: "2023-01-15",
  lastActive: "2024-01-10 14:30",
  vehiclesCount: 23,
  auctionsCount: 7,
  requestsCount: 4,
  totalSales: 2850000,
  rating: 4.8,
};

const mockVehicles = [
  { id: "v1", title: "טויוטה קמרי 2022", price: 125000, status: "active", date: "2024-01-08" },
  { id: "v2", title: "BMW X3 2021", price: 195000, status: "sold", date: "2024-01-05" },
  { id: "v3", title: "מרצדס C200 2023", price: 215000, status: "active", date: "2024-01-03" },
];

const mockAuctions = [
  { id: "a1", title: "אאודי A4 2020", currentBid: 85000, endTime: "2024-01-12 18:00", status: "active" },
  { id: "a2", title: "פורשה 911 2019", currentBid: 450000, endTime: "2024-01-08 15:00", status: "ended" },
];

const mockRequests = [
  { id: "r1", title: "מחפש טויוטה היילקס", budget: "80000-120000", status: "open", date: "2024-01-09" },
  { id: "r2", title: "צריך מיצובישי לנסר", budget: "45000-65000", status: "closed", date: "2024-01-07" },
];

const AdminUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-success text-success-foreground">פעיל</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 ml-1" />ממתין לאישור</Badge>;
      case 'suspended':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 ml-1" />מושעה</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'premium':
        return <Badge className="bg-primary text-primary-foreground">פרימיום</Badge>;
      case 'basic':
        return <Badge variant="outline">בסיסי</Badge>;
      default:
        return <Badge variant="secondary">{plan}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/admin/users')}
          className="hebrew-text"
        >
          <ArrowRight className="h-4 w-4 ml-1" />
          חזור לרשימת משתמשים
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold hebrew-text">{mockUserData.name}</h1>
          <p className="text-lg text-muted-foreground hebrew-text mt-1">{mockUserData.business}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="hebrew-text">
            <Edit className="h-4 w-4 ml-2" />
            עריכת פרטים
          </Button>
          <Button className="hebrew-text">צפה בפרופיל הציבורי</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-sm font-medium text-muted-foreground hebrew-text">סטטוס</p>
                <div className="mt-2">
                  {getStatusBadge(mockUserData.status)}
                </div>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-sm font-medium text-muted-foreground hebrew-text">תוכנית</p>
                <div className="mt-2">
                  {getPlanBadge(mockUserData.plan)}
                </div>
              </div>
              <Activity className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-sm font-medium text-muted-foreground hebrew-text">רכבים פעילים</p>
                <p className="text-2xl font-bold">{mockUserData.vehiclesCount}</p>
              </div>
              <Car className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-sm font-medium text-muted-foreground hebrew-text">סה"כ מכירות</p>
                <p className="text-2xl font-bold">₪{mockUserData.totalSales.toLocaleString()}</p>
              </div>
              <Gavel className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="details" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4" dir="rtl">
          <TabsTrigger value="requests" className="hebrew-text">רכבים דרושים</TabsTrigger>
          <TabsTrigger value="auctions" className="hebrew-text">מכירות פומביות</TabsTrigger>
          <TabsTrigger value="vehicles" className="hebrew-text">רכבים</TabsTrigger>
          <TabsTrigger value="details" className="hebrew-text">פרטי משתמש</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle className="hebrew-text">מידע אישי ועסקי</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 flex-row-reverse">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground hebrew-text">דוא"ל</p>
                      <p className="font-medium">{mockUserData.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-row-reverse">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground hebrew-text">טלפון</p>
                      <p className="font-medium">{mockUserData.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-row-reverse">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground hebrew-text">כתובת</p>
                      <p className="font-medium hebrew-text">{mockUserData.address}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 flex-row-reverse">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground hebrew-text">תאריך הצטרפות</p>
                      <p className="font-medium">{new Date(mockUserData.joinDate).toLocaleDateString('he-IL')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-row-reverse">
                    <Activity className="h-5 w-5 text-muted-foreground" />
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground hebrew-text">פעילות אחרונה</p>
                      <p className="font-medium">{mockUserData.lastActive}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-row-reverse">
                    <CheckCircle className="h-5 w-5 text-muted-foreground" />
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground hebrew-text">דירוג</p>
                      <p className="font-medium">{mockUserData.rating}/5</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicles">
          <Card>
            <CardHeader>
              <CardTitle className="hebrew-text">רכבים ({mockVehicles.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right hebrew-text">רכב</TableHead>
                    <TableHead className="text-right hebrew-text">מחיר</TableHead>
                    <TableHead className="text-right hebrew-text">סטטוס</TableHead>
                    <TableHead className="text-right hebrew-text">תאריך הוספה</TableHead>
                    <TableHead className="text-right hebrew-text">פעולות</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockVehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell className="font-medium hebrew-text">{vehicle.title}</TableCell>
                      <TableCell className="hebrew-text">₪{vehicle.price.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={vehicle.status === 'active' ? 'default' : 'secondary'}>
                          {vehicle.status === 'active' ? 'פעיל' : 'נמכר'}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(vehicle.date).toLocaleDateString('he-IL')}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" className="hebrew-text">
                            צפה
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="auctions">
          <Card>
            <CardHeader>
              <CardTitle className="hebrew-text">מכירות פומביות ({mockAuctions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right hebrew-text">רכב</TableHead>
                    <TableHead className="text-right hebrew-text">הצעה נוכחית</TableHead>
                    <TableHead className="text-right hebrew-text">סיום</TableHead>
                    <TableHead className="text-right hebrew-text">סטטוס</TableHead>
                    <TableHead className="text-right hebrew-text">פעולות</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAuctions.map((auction) => (
                    <TableRow key={auction.id}>
                      <TableCell className="font-medium hebrew-text">{auction.title}</TableCell>
                      <TableCell className="hebrew-text">₪{auction.currentBid.toLocaleString()}</TableCell>
                      <TableCell>{auction.endTime}</TableCell>
                      <TableCell>
                        <Badge variant={auction.status === 'active' ? 'default' : 'secondary'}>
                          {auction.status === 'active' ? 'פעילה' : 'הסתיימה'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" className="hebrew-text">
                            צפה
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle className="hebrew-text">רכבים דרושים ({mockRequests.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right hebrew-text">בקשה</TableHead>
                    <TableHead className="text-right hebrew-text">תקציב</TableHead>
                    <TableHead className="text-right hebrew-text">סטטוס</TableHead>
                    <TableHead className="text-right hebrew-text">תאריך</TableHead>
                    <TableHead className="text-right hebrew-text">פעולות</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium hebrew-text">{request.title}</TableCell>
                      <TableCell className="hebrew-text">₪{request.budget}</TableCell>
                      <TableCell>
                        <Badge variant={request.status === 'open' ? 'default' : 'secondary'}>
                          {request.status === 'open' ? 'פתוחה' : 'סגורה'}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(request.date).toLocaleDateString('he-IL')}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" className="hebrew-text">
                            צפה
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminUserDetail;