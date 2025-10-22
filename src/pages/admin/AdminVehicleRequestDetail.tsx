import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight, Edit, User, MapPin, Calendar, DollarSign, MessageSquare, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock request data
const mockRequestData = {
  id: "r123",
  title: "מחפש טויוטה היילקס 2020-2022",
  description: "מחפש טויוטה היילקס במצב טוב, עד 100,000 ק\"מ, בעדיפות בצבע לבן או כסוף. רק ידיים ראשונות.",
  requester: {
    name: "דוד לוי",
    business: "לוי שירותים",
    email: "david@levi-services.co.il",
    phone: "054-987-6543",
    rating: 4.6
  },
  budget: {
    min: 80000,
    max: 120000
  },
  location: "מרכז",
  preferredColors: ["לבן", "כסוף", "שחור"],
  maxKilometers: 100000,
  yearRange: "2020-2022",
  transmissionType: "אוטומטי",
  fuelType: "בנזין",
  status: "open",
  priority: "high",
  createdDate: "2024-01-09",
  lastUpdated: "2024-01-10",
  viewsCount: 23,
  offersCount: 5,
  responseTime: "תוך 24 שעות"
};

const mockOffers = [
  {
    id: "o1",
    dealer: "משה מוטורס",
    vehicle: "טויוטה היילקס 2021",
    price: 95000,
    kilometers: 45000,
    year: 2021,
    color: "לבן",
    status: "pending",
    date: "2024-01-10",
    message: "רכב במצב מעולה, ידיים ראשונות, טופל במוסך מורשה בלבד"
  },
  {
    id: "o2", 
    dealer: "כהן אוטו",
    vehicle: "טויוטה היילקס 2020",
    price: 88000,
    kilometers: 65000,
    year: 2020,
    color: "כסוף",
    status: "accepted",
    date: "2024-01-09",
    message: "מצב טכני מעולה, כל הבדיקות עד כה"
  },
  {
    id: "o3",
    dealer: "אברהם קארס",
    vehicle: "טויוטה היילקס 2022",
    price: 115000,
    kilometers: 25000,
    year: 2022,
    color: "שחור",
    status: "rejected",
    date: "2024-01-09",
    message: "רכב חדש יחסית, מצב מושלם"
  }
];

const AdminVehicleRequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-success text-success-foreground">פתוחה</Badge>;
      case 'in_progress':
        return <Badge variant="secondary"><Clock className="w-3 h-3 ml-1" />בטיפול</Badge>;
      case 'closed':
        return <Badge variant="outline"><CheckCircle className="w-3 h-3 ml-1" />סגורה</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">גבוהה</Badge>;
      case 'medium':
        return <Badge variant="secondary">בינונית</Badge>;
      case 'low':
        return <Badge variant="outline">נמוכה</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getOfferStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 ml-1" />ממתינה</Badge>;
      case 'accepted':
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="w-3 h-3 ml-1" />התקבלה</Badge>;
      case 'rejected':
        return <Badge variant="destructive">נדחתה</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/admin/vehicle-requests')}
          className="hebrew-text"
        >
          <ArrowRight className="h-4 w-4 ml-1" />
          חזור לרשימת בקשות
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold hebrew-text">{mockRequestData.title}</h1>
          <p className="text-lg text-muted-foreground hebrew-text mt-1">בקשה #{mockRequestData.id}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="hebrew-text">
            <Edit className="h-4 w-4 ml-2" />
            עריכת בקשה
          </Button>
          <Button className="hebrew-text">
            <MessageSquare className="h-4 w-4 ml-2" />
            יצירת קשר עם מבקש
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground hebrew-text">סטטוס</p>
                <div className="mt-2">
                  {getStatusBadge(mockRequestData.status)}
                </div>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground hebrew-text">עדיפות</p>
                <div className="mt-2">
                  {getPriorityBadge(mockRequestData.priority)}
                </div>
              </div>
              <Clock className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground hebrew-text">צפיות</p>
                <p className="text-2xl font-bold">{mockRequestData.viewsCount}</p>
              </div>
              <User className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground hebrew-text">הצעות</p>
                <p className="text-2xl font-bold">{mockRequestData.offersCount}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="details" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-gray-900" dir="rtl">
          <TabsTrigger value="offers" className="hebrew-text">הצעות ({mockOffers.length})</TabsTrigger>
          <TabsTrigger value="requester" className="hebrew-text">פרטי מבקש</TabsTrigger>
          <TabsTrigger value="details" className="hebrew-text">פרטי הבקשה</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle className="hebrew-text text-right">פרטי הבקשה המלאים</CardTitle>
            </CardHeader>
            <CardContent dir="rtl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-right" dir="rtl">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg hebrew-text mb-3">תיאור הבקשה</h3>
                    <p className="text-muted-foreground hebrew-text leading-relaxed">
                      {mockRequestData.description}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg hebrew-text mb-3">דרישות טכניות</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground hebrew-text">טווח שנים:</span>
                          <span className="font-medium">{mockRequestData.yearRange}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground hebrew-text">מקסימום ק"מ:</span>
                          <span className="font-medium">{mockRequestData.maxKilometers.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground hebrew-text">תיבת הילוכים:</span>
                          <span className="font-medium hebrew-text">{mockRequestData.transmissionType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground hebrew-text">סוג דלק:</span>
                          <span className="font-medium hebrew-text">{mockRequestData.fuelType}</span>
                        </div>
                      </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg hebrew-text mb-3">תקציב ומיקום</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground hebrew-text">תקציב מינימלי:</span>
                            <span className="font-medium">₪{mockRequestData.budget.min.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground hebrew-text">תקציב מקסימלי:</span>
                            <span className="font-medium">₪{mockRequestData.budget.max.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground hebrew-text">אזור:</span>
                            <span className="font-medium hebrew-text">{mockRequestData.location}</span>
                          </div>
                        </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg hebrew-text mb-3">צבעים מועדפים</h3>
                    <div className="flex gap-2 flex-wrap justify-end">
                      {mockRequestData.preferredColors.map((color, index) => (
                        <Badge key={index} variant="outline" className="hebrew-text">{color}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg hebrew-text mb-3">מידע נוסף</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground hebrew-text">תאריך פרסום:</span>
                            <span className="font-medium">{new Date(mockRequestData.createdDate).toLocaleDateString('he-IL')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground hebrew-text">עדכון אחרון:</span>
                            <span className="font-medium">{new Date(mockRequestData.lastUpdated).toLocaleDateString('he-IL')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground hebrew-text">זמן תגובה:</span>
                            <span className="font-medium hebrew-text">{mockRequestData.responseTime}</span>
                          </div>
                        </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requester">
          <Card>
            <CardHeader>
              <CardTitle className="hebrew-text">פרטי המבקש</CardTitle>
            </CardHeader>
            <CardContent dir="rtl">
              <div className="space-y-6 text-right">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold hebrew-text">{mockRequestData.requester.name}</h3>
                    <p className="text-muted-foreground hebrew-text">{mockRequestData.requester.business}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-muted-foreground hebrew-text">דירוג:</span>
                      <span className="font-medium">{mockRequestData.requester.rating}/5</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground hebrew-text">דוא"ל</p>
                        <p className="font-medium">{mockRequestData.requester.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground hebrew-text">טלפון</p>
                        <p className="font-medium">{mockRequestData.requester.phone}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Button className="w-full hebrew-text">
                      <MessageSquare className="h-4 w-4 ml-2" />
                      שלח הודעה
                    </Button>
                    <Button variant="outline" className="w-full hebrew-text">
                      <User className="h-4 w-4 ml-2" />
                      צפה בפרופיל המלא
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offers">
          <Card>
            <CardHeader>
              <CardTitle className="hebrew-text">הצעות שהתקבלו</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right hebrew-text">סוחר</TableHead>
                    <TableHead className="text-right hebrew-text">רכב</TableHead>
                    <TableHead className="text-right hebrew-text">מחיר</TableHead>
                    <TableHead className="text-right hebrew-text">ק"מ</TableHead>
                    <TableHead className="text-right hebrew-text">צבע</TableHead>
                    <TableHead className="text-right hebrew-text">סטטוס</TableHead>
                    <TableHead className="text-right hebrew-text">תאריך</TableHead>
                    <TableHead className="text-right hebrew-text">פעולות</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockOffers.map((offer) => (
                    <TableRow key={offer.id}>
                      <TableCell className="font-medium hebrew-text">{offer.dealer}</TableCell>
                      <TableCell className="hebrew-text">{offer.vehicle}</TableCell>
                      <TableCell className="hebrew-text">₪{offer.price.toLocaleString()}</TableCell>
                      <TableCell>{offer.kilometers.toLocaleString()}</TableCell>
                      <TableCell className="hebrew-text">{offer.color}</TableCell>
                      <TableCell>{getOfferStatusBadge(offer.status)}</TableCell>
                      <TableCell>{new Date(offer.date).toLocaleDateString('he-IL')}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="hebrew-text">
                          צפה בפרטים
                        </Button>
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

export default AdminVehicleRequestDetail;