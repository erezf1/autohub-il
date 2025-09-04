import { useState } from "react";
import { Search, Filter, MoreHorizontal, UserCheck, UserX, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// Mock data
const usersData = [
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
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filteredUsers = usersData.filter(user => {
    const matchesSearch = user.name.includes(searchTerm) || user.business.includes(searchTerm);
    const matchesFilter = selectedFilter === "all" || user.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground hebrew-text">ניהול משתמשים</h1>
            <p className="text-lg text-muted-foreground hebrew-text mt-2">
              ניהול סוחרים ומשתמשי המערכת
            </p>
          </div>
          <Button size="lg" className="hebrew-text">
            הוסף משתמש חדש
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-8">
            <div className="flex gap-6">
              <div className="relative flex-1">
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="חיפוש לפי שם או חברה..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-12 h-12 text-base hebrew-text"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="lg" className="hebrew-text">
                    <Filter className="ml-2 h-5 w-5" />
                    {selectedFilter === "all" ? "כל הסטטוסים" : 
                     selectedFilter === "active" ? "פעיל" :
                     selectedFilter === "pending" ? "ממתין" : "חסום"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSelectedFilter("all")} className="hebrew-text">
                    כל הסטטוסים
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedFilter("active")} className="hebrew-text">
                    פעיל
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedFilter("pending")} className="hebrew-text">
                    ממתין לאישור
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedFilter("suspended")} className="hebrew-text">
                    מושעה
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl hebrew-text">רשימת משתמשים ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right hebrew-text text-base">שם</TableHead>
                  <TableHead className="text-right hebrew-text text-base">חברה</TableHead>
                  <TableHead className="text-right hebrew-text text-base">אימייל</TableHead>
                  <TableHead className="text-right hebrew-text text-base">תאריך הצטרפות</TableHead>
                  <TableHead className="text-right hebrew-text text-base">סטטוס</TableHead>
                  <TableHead className="text-right hebrew-text text-base">פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="h-16">
                    <TableCell className="font-medium hebrew-text text-base">{user.name}</TableCell>
                    <TableCell className="hebrew-text text-base">{user.business}</TableCell>
                    <TableCell className="text-base">{user.email}</TableCell>
                    <TableCell className="hebrew-text text-base">{user.joinDate}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          user.status === "active" ? "default" :
                          user.status === "pending" ? "secondary" :
                          "destructive"
                        }
                        className="hebrew-text text-sm"
                      >
                        {user.status === "active" ? "פעיל" :
                         user.status === "pending" ? "ממתין" :
                         user.status === "suspended" ? "מושעה" : user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" className="hebrew-text" onClick={() => navigate(`/admin/users/${user.id}`)}>
                          <Eye className="h-4 w-4 ml-1" />
                          צפה
                        </Button>
                        {user.status === "pending" && (
                          <Button variant="ghost" size="sm" className="hebrew-text text-success">
                            <UserCheck className="h-4 w-4 ml-1" />
                            אשר
                          </Button>
                        )}
                        {user.status === "active" && (
                          <Button variant="ghost" size="sm" className="hebrew-text text-destructive">
                            <UserX className="h-4 w-4 ml-1" />
                            השעה
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
  );
};

export default AdminUsersList;