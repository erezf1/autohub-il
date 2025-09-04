import { useState } from "react";
import { HelpCircle, Eye, MessageSquare, Clock, User, AlertTriangle } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

// Mock data for support tickets
const mockTickets = [
  {
    id: 1,
    title: "דיווח על מוכר רכב מפוקפק",
    reporter: "דני כהן",
    reporterBusiness: "כהן מוטורס",
    reportedUser: "אוטו גל",
    category: "דיווח על משתמש",
    priority: "גבוה",
    status: "פתוח",
    assignedTo: "לא משוייך",
    dateCreated: "2024-01-20",
    lastActivity: "לפני שעה",
    description: "המוכר לא עונה להודעות ומפרסם רכבים עם פרטים לא נכונים"
  },
  {
    id: 2,
    title: "בעיה בתשלום עבור מנוי פרימיום",
    reporter: "מירי לוי",
    reporterBusiness: "לוי אוטו",
    reportedUser: null,
    category: "תמיכה טכנית",
    priority: "בינוני",
    status: "בטיפול",
    assignedTo: "ישראל ישראלי",
    dateCreated: "2024-01-18",
    lastActivity: "לפני 3 שעות",
    description: "הכרטיס לא עובר במערכת התשלומים"
  },
  {
    id: 3,
    title: "בקשה להחזר כספי",
    reporter: "אבי רוזן",
    reporterBusiness: "רוזן מוטורס",
    reportedUser: null,
    category: "כספים",
    priority: "נמוך",
    status: "ממתין תגובה",
    assignedTo: "שרה כהן",
    dateCreated: "2024-01-15",
    lastActivity: "לפני יום",
    description: "רוצה להחזיר כסף עבור מנוי שלא השתמש בו"
  },
  {
    id: 4,
    title: "רכב שנמכר עדיין מופיע במערכת",
    reporter: "שרה ברק",
    reporterBusiness: "ברק אוטו סנטר",
    reportedUser: null,
    category: "תמיכה טכנית",
    priority: "בינוני",
    status: "נפתר",
    assignedTo: "ישראל ישראלי",
    dateCreated: "2024-01-12",
    lastActivity: "לפני שבוע",
    description: "רכב שנמכר לפני שבוע עדיין מופיע כזמין"
  }
];

const AdminSupportTickets = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "גבוה":
        return <Badge variant="destructive" className="hebrew-text">{priority}</Badge>;
      case "בינוני":
        return <Badge variant="default" className="hebrew-text">{priority}</Badge>;
      case "נמוך":
        return <Badge variant="secondary" className="hebrew-text">{priority}</Badge>;
      default:
        return <Badge variant="secondary" className="hebrew-text">{priority}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "פתוח":
        return <Badge variant="outline" className="hebrew-text">{status}</Badge>;
      case "בטיפול":
        return <Badge variant="default" className="hebrew-text">{status}</Badge>;
      case "ממתין תגובה":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600 hebrew-text">{status}</Badge>;
      case "נפתר":
        return <Badge variant="secondary" className="hebrew-text">{status}</Badge>;
      default:
        return <Badge variant="secondary" className="hebrew-text">{status}</Badge>;
    }
  };

  const filteredTickets = mockTickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.reporter.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.reporterBusiness.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === "all" || 
                      (activeTab === "open" && ["פתוח", "בטיפול"].includes(ticket.status)) ||
                      (activeTab === "pending" && ticket.status === "ממתין תגובה") ||
                      (activeTab === "resolved" && ticket.status === "נפתר");
    
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground hebrew-text">פניות תמיכה</h1>
          <p className="text-muted-foreground hebrew-text">
            ניהול פניות תמיכה ודיווחים מהמשתמשים
          </p>
        </div>
        <div className="flex gap-2">
          <Select>
            <SelectTrigger className="w-40 hebrew-text">
              <SelectValue placeholder="שיוך נציג" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="israel" className="hebrew-text">ישראל ישראלי</SelectItem>
              <SelectItem value="sara" className="hebrew-text">שרה כהן</SelectItem>
              <SelectItem value="unassigned" className="hebrew-text">לא משוייך</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="hebrew-text">חיפוש וסינון</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <HelpCircle className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="חפש לפי כותרת או שם מדווח..."
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

      {/* Support Tickets Tabs and Table */}
      <Card>
        <CardHeader>
          <CardTitle className="hebrew-text">פניות תמיכה ({filteredTickets.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all" className="hebrew-text">כל הפניות</TabsTrigger>
              <TabsTrigger value="open" className="hebrew-text">פתוחות</TabsTrigger>
              <TabsTrigger value="pending" className="hebrew-text">ממתינות</TabsTrigger>
              <TabsTrigger value="resolved" className="hebrew-text">נפתרו</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right hebrew-text">פנייה</TableHead>
                    <TableHead className="text-right hebrew-text">מדווח</TableHead>
                    <TableHead className="text-right hebrew-text">קטגוריה</TableHead>
                    <TableHead className="text-right hebrew-text">עדיפות</TableHead>
                    <TableHead className="text-right hebrew-text">סטטוס</TableHead>
                    <TableHead className="text-right hebrew-text">משוייך לנציג</TableHead>
                    <TableHead className="text-right hebrew-text">פעילות אחרונה</TableHead>
                    <TableHead className="text-right hebrew-text">פעולות</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                            {ticket.reportedUser ? (
                              <AlertTriangle className="h-5 w-5 text-destructive" />
                            ) : (
                              <HelpCircle className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium hebrew-text">
                              {ticket.title}
                            </div>
                            <div className="text-sm text-muted-foreground hebrew-text">
                              #{ticket.id} • נוצר {ticket.dateCreated}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium hebrew-text">{ticket.reporter}</div>
                          <div className="text-sm text-muted-foreground hebrew-text">
                            {ticket.reporterBusiness}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hebrew-text">{ticket.category}</TableCell>
                      <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                      <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm hebrew-text">{ticket.assignedTo}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm hebrew-text">{ticket.lastActivity}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" className="hebrew-text" onClick={() => navigate(`/admin/support/${ticket.id}`)}>
                            <Eye className="h-4 w-4 ml-1" />
                            צפה
                          </Button>
                          <Button variant="ghost" size="sm" className="hebrew-text">
                            <MessageSquare className="h-4 w-4 ml-1" />
                            השב
                          </Button>
                          <Button variant="ghost" size="sm" className="hebrew-text">
                            <User className="h-4 w-4 ml-1" />
                            שייך
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

export default AdminSupportTickets;