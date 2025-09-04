import { useState } from "react";
import { Search, Eye, Edit, Trash2, Plus, FileText, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

// Mock data for vehicle requests
const mockRequests = [
  {
    id: 1,
    title: "טויוטה קורולה 2020-2022",
    requester: "דני כהן",
    requesterBusiness: "כהן מוטורס",
    status: "פתוח",
    offersCount: 5,
    budget: "100,000-150,000 ₪",
    dateCreated: "2024-01-15",
    lastActivity: "לפני שעה",
    location: "תל אביב",
    views: 124
  },
  {
    id: 2,
    title: "BMW X5 היברידי 2021+",
    requester: "מירי לוי",
    requesterBusiness: "לוי אוטו",
    status: "פתוח",
    offersCount: 8,
    budget: "400,000-500,000 ₪",
    dateCreated: "2024-01-12",
    lastActivity: "לפני יום",
    location: "חיפה",
    views: 89
  },
  {
    id: 3,
    title: "מרצדס E-Class 2019-2021",
    requester: "אבי רוזן",
    requesterBusiness: "רוזן מוטורס",
    status: "סגור",
    offersCount: 12,
    budget: "250,000-350,000 ₪",
    dateCreated: "2024-01-05",
    lastActivity: "לפני שבוע",
    location: "ירושלים",
    views: 156
  },
  {
    id: 4,
    title: "רכב עירוני חסכוני עד 5 שנים",
    requester: "שרה ברק",
    requesterBusiness: "ברק אוטו סנטר",
    status: "ממתין",
    offersCount: 2,
    budget: "60,000-100,000 ₪",
    dateCreated: "2024-01-18",
    lastActivity: "לפני 3 שעות",
    location: "באר שבע",
    views: 67
  }
];

const AdminVehicleRequestsList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "פתוח":
        return <Badge variant="default" className="hebrew-text">{status}</Badge>;
      case "סגור":
        return <Badge variant="secondary" className="hebrew-text">{status}</Badge>;
      case "ממתין":
        return <Badge variant="outline" className="hebrew-text">{status}</Badge>;
      default:
        return <Badge variant="secondary" className="hebrew-text">{status}</Badge>;
    }
  };

  const filteredRequests = mockRequests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.requester.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.requesterBusiness.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === "all" || 
                      (activeTab === "open" && request.status === "פתוח") ||
                      (activeTab === "closed" && request.status === "סגור") ||
                      (activeTab === "pending" && request.status === "ממתין");
    
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground hebrew-text">רכבים דרושים</h1>
          <p className="text-muted-foreground hebrew-text">
            ניהול בקשות חיפוש רכבים מסוחרים
          </p>
        </div>
        <Button className="hebrew-text">
          <Plus className="h-4 w-4 ml-2" />
          הוסף בקשה חדשה
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="hebrew-text">סינון וחיפוש</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="חפש לפי כותרת, מבקש או עסק..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 hebrew-text"
              />
            </div>
            <Button variant="outline" className="hebrew-text">
              סינון מתקדם
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Requests Tabs and Table */}
      <Card>
        <CardHeader>
          <CardTitle className="hebrew-text">בקשות חיפוש ({filteredRequests.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all" className="hebrew-text">כל הבקשות</TabsTrigger>
              <TabsTrigger value="open" className="hebrew-text">פתוחות</TabsTrigger>
              <TabsTrigger value="pending" className="hebrew-text">ממתינות</TabsTrigger>
              <TabsTrigger value="closed" className="hebrew-text">סגורות</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right hebrew-text">בקשה</TableHead>
                    <TableHead className="text-right hebrew-text">מבקש</TableHead>
                    <TableHead className="text-right hebrew-text">תקציב</TableHead>
                    <TableHead className="text-right hebrew-text">סטטוס</TableHead>
                    <TableHead className="text-right hebrew-text">הצעות</TableHead>
                    <TableHead className="text-right hebrew-text">פעילות אחרונה</TableHead>
                    <TableHead className="text-right hebrew-text">פעולות</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="font-medium hebrew-text">
                              {request.title}
                            </div>
                            <div className="text-sm text-muted-foreground hebrew-text">
                              {request.location} • {request.views} צפיות
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium hebrew-text">{request.requester}</div>
                          <div className="text-sm text-muted-foreground hebrew-text">
                            {request.requesterBusiness}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium hebrew-text">{request.budget}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-muted-foreground" />
                          <span className="hebrew-text">{request.offersCount}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm hebrew-text">{request.lastActivity}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" className="hebrew-text" onClick={() => navigate(`/admin/vehicle-requests/${request.id}`)}>
                            <Eye className="h-4 w-4 ml-1" />
                            צפה
                          </Button>
                          <Button variant="ghost" size="sm" className="hebrew-text">
                            <Edit className="h-4 w-4 ml-1" />
                            ערוך
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive hebrew-text">
                            <Trash2 className="h-4 w-4 ml-1" />
                            מחק
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminVehicleRequestsList;