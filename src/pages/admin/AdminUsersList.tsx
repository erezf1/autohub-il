import { useState } from "react";
import { Search, Filter, UserCheck, UserX, Eye, Edit, Loader2 } from "lucide-react";
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
import { useUsers, useUpdateUserStatus } from "@/hooks/admin/useUsers";

const AdminUsersList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  
  const { users, isLoading } = useUsers(searchTerm, selectedFilter);
  const updateStatusMutation = useUpdateUserStatus();

  const handleStatusChange = async (userId: string, newStatus: string) => {
    await updateStatusMutation.mutateAsync({ userId, status: newStatus });
  };

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
          <Button size="lg" className="hebrew-text" onClick={() => navigate('/admin/users/create')}>
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
                     selectedFilter === "pending" ? "ממתין" : 
                     selectedFilter === "suspended" ? "מושעה" :
                     selectedFilter === "subscription_expired" ? "מנוי פג תוקף" : selectedFilter}
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
                  <DropdownMenuItem onClick={() => setSelectedFilter("subscription_expired")} className="hebrew-text">
                    מנוי פג תוקף
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl hebrew-text">רשימת משתמשים ({users?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right hebrew-text text-base">שם</TableHead>
                    <TableHead className="text-right hebrew-text text-base">חברה</TableHead>
                    <TableHead className="text-right hebrew-text text-base">טלפון</TableHead>
                    <TableHead className="text-right hebrew-text text-base">סוג מנוי</TableHead>
                    <TableHead className="text-right hebrew-text text-base">בתוקף עד</TableHead>
                    <TableHead className="text-right hebrew-text text-base">סטטוס</TableHead>
                    <TableHead className="text-right hebrew-text text-base">פעולות</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((user: any) => (
                    <TableRow 
                      key={user.id} 
                      className="h-16 hover:bg-muted/50"
                    >
                      <TableCell className="font-medium hebrew-text text-base">
                        {user.profile?.full_name || 'ללא שם'}
                      </TableCell>
                      <TableCell className="hebrew-text text-base">
                        {user.profile?.business_name || 'ללא שם עסק'}
                      </TableCell>
                      <TableCell className="text-base" dir="ltr">{user.phone_number}</TableCell>
                      <TableCell className="hebrew-text text-base">
                        {user.profile?.subscription_type === 'regular' ? 'רגיל' :
                         user.profile?.subscription_type === 'premium' ? 'פרימיום' :
                         user.profile?.subscription_type === 'vip' ? 'VIP' : 'לא צוין'}
                      </TableCell>
                      <TableCell className="hebrew-text text-base">
                        {user.profile?.subscription_valid_until 
                          ? new Date(user.profile.subscription_valid_until).toLocaleDateString('he-IL')
                          : 'לא צוין'}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            user.status === "active" ? "default" :
                            user.status === "pending" ? "secondary" :
                            user.status === "subscription_expired" ? "outline" :
                            "destructive"
                          }
                          className="hebrew-text text-sm"
                        >
                          {user.status === "active" ? "פעיל" :
                           user.status === "pending" ? "ממתין" :
                           user.status === "suspended" ? "מושעה" :
                           user.status === "subscription_expired" ? "מנוי פג תוקף" : user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/admin/users/${user.id}`);
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/admin/users/${user.id}/edit`);
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {user.status === 'pending' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(user.id, 'active');
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <UserCheck className="h-4 w-4 text-green-600" />
                            </Button>
                          )}
                          {user.status === 'active' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(user.id, 'suspended');
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <UserX className="h-4 w-4 text-red-600" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
  );
};

export default AdminUsersList;