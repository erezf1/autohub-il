import { useState } from "react";
import { Plus, Search, Filter, Eye, Edit, Trash2, CheckCircle, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data
const mockUsers = [
  {
    id: 1,
    name: "דוד כהן",
    business: "אוטו דוד בע\"מ",
    email: "david@autodavid.co.il",
    phone: "050-1234567",
    status: "active",
    plan: "premium",
    joinDate: "2024-01-15",
    lastActive: "לפני שעה",
    vehiclesCount: 45,
    auctionsCount: 12
  },
  {
    id: 2,
    name: "שרה לוי",
    business: "רכב שרה",
    email: "sarah@rehevsarah.com",
    phone: "054-7654321",
    status: "pending",
    plan: "basic",
    joinDate: "2024-03-20",
    lastActive: "לפני יום",
    vehiclesCount: 0,
    auctionsCount: 0
  },
  {
    id: 3,
    name: "משה אברהם",
    business: "אברהם מוטורס",
    email: "moshe@avrahammotors.co.il",
    phone: "052-9876543",
    status: "active",
    plan: "premium",
    joinDate: "2023-11-05",
    lastActive: "לפני 2 שעות",
    vehiclesCount: 78,
    auctionsCount: 23
  },
  {
    id: 4,
    name: "רחל דוד",
    business: "רחל אוטו",
    email: "rachel@rachelauto.co.il",
    phone: "053-1122334",
    status: "suspended",
    plan: "basic",
    joinDate: "2024-02-10",
    lastActive: "לפני שבוע",
    vehiclesCount: 15,
    auctionsCount: 3
  },
  {
    id: 5,
    name: "אבי גולן",
    business: "גולן רכבים",
    email: "avi@golanvehicles.co.il",
    phone: "055-4455667",
    status: "pending",
    plan: "premium",
    joinDate: "2024-03-25",
    lastActive: "מעולם לא התחבר",
    vehiclesCount: 0,
    auctionsCount: 0
  }
];

const AdminUsersList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="hebrew-text">פעיל</Badge>;
      case "pending":
        return <Badge variant="secondary" className="hebrew-text">ממתין לאישור</Badge>;
      case "suspended":
        return <Badge variant="destructive" className="hebrew-text">מושעה</Badge>;
      default:
        return <Badge variant="outline" className="hebrew-text">{status}</Badge>;
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case "premium":
        return <Badge variant="default" className="hebrew-text">פרמיום</Badge>;
      case "basic":
        return <Badge variant="outline" className="hebrew-text">בסיסי</Badge>;
      default:
        return <Badge variant="outline" className="hebrew-text">{plan}</Badge>;
    }
  };

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.includes(searchTerm) || 
                         user.business.includes(searchTerm) || 
                         user.email.includes(searchTerm);
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "pending") return matchesSearch && user.status === "pending";
    if (activeTab === "new") return matchesSearch && new Date(user.joinDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground hebrew-text">ניהול משתמשים</h1>
          <p className="text-muted-foreground hebrew-text mt-1">ניהול סוחרי רכב במערכת</p>
        </div>
        <Button className="hebrew-text">
          <Plus className="h-4 w-4 ml-2" />
          הוסף משתמש חדש
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="חפש לפי שם, עסק או אימייל..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 hebrew-text"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs and Table */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" className="hebrew-text">כל המשתמשים</TabsTrigger>
          <TabsTrigger value="pending" className="hebrew-text">ממתינים לאישור</TabsTrigger>
          <TabsTrigger value="new" className="hebrew-text">חדשים</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="hebrew-text">
                {activeTab === "all" && `כל המשתמשים (${filteredUsers.length})`}
                {activeTab === "pending" && `ממתינים לאישור (${filteredUsers.length})`}
                {activeTab === "new" && `משתמשים חדשים (${filteredUsers.length})`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="hebrew-text">משתמש</TableHead>
                      <TableHead className="hebrew-text">סטטוס</TableHead>
                      <TableHead className="hebrew-text">תוכנית</TableHead>
                      <TableHead className="hebrew-text">פעילות</TableHead>
                      <TableHead className="hebrew-text">התחברות אחרונה</TableHead>
                      <TableHead className="hebrew-text">פעולות</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium hebrew-text">{user.name}</div>
                            <div className="text-sm text-muted-foreground hebrew-text">{user.business}</div>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(user.status)}
                        </TableCell>
                        <TableCell>
                          {getPlanBadge(user.plan)}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="hebrew-text">{user.vehiclesCount} רכבים</div>
                            <div className="hebrew-text">{user.auctionsCount} מכירות</div>
                          </div>
                        </TableCell>
                        <TableCell className="hebrew-text">
                          {user.lastActive}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                פעולות
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="hebrew-text">
                                <Eye className="h-4 w-4 ml-2" />
                                צפה בפרטים
                              </DropdownMenuItem>
                              <DropdownMenuItem className="hebrew-text">
                                <Edit className="h-4 w-4 ml-2" />
                                ערוך
                              </DropdownMenuItem>
                              {user.status === "pending" && (
                                <DropdownMenuItem className="hebrew-text">
                                  <CheckCircle className="h-4 w-4 ml-2" />
                                  אשר
                                </DropdownMenuItem>
                              )}
                              {user.status === "active" && (
                                <DropdownMenuItem className="hebrew-text">
                                  <Clock className="h-4 w-4 ml-2" />
                                  השעה
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="text-destructive hebrew-text">
                                <Trash2 className="h-4 w-4 ml-2" />
                                מחק
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminUsersList;