import { useState } from "react";
import { Search, Filter, UserCheck, UserX, Eye, Loader2 } from "lucide-react";
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
                    <TableHead className="text-right hebrew-text text-base">תאריך הצטרפות</TableHead>
                    <TableHead className="text-right hebrew-text text-base">סטטוס</TableHead>
                    <TableHead className="text-right hebrew-text text-base">פעולות</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((user: any) => (
                    <TableRow key={user.id} className="h-16">
                      <TableCell className="font-medium hebrew-text text-base">
                        {user.profile?.full_name || 'ללא שם'}
                      </TableCell>
                      <TableCell className="hebrew-text text-base">
                        {user.profile?.business_name || 'ללא שם עסק'}
                      </TableCell>
                      <TableCell className="text-base" dir="ltr">{user.phone_number}</TableCell>
                      <TableCell className="hebrew-text text-base">
                        {new Date(user.created_at).toLocaleDateString('he-IL')}
                      </TableCell>
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
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="hebrew-text" 
                            onClick={() => navigate(`/admin/users/${user.id}`)}
                          >
                            <Eye className="h-4 w-4 ml-1" />
                            צפה
                          </Button>
                          {user.status === "pending" && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="hebrew-text text-success"
                              onClick={() => handleStatusChange(user.id, 'active')}
                              disabled={updateStatusMutation.isPending}
                            >
                              <UserCheck className="h-4 w-4 ml-1" />
                              אשר
                            </Button>
                          )}
                          {user.status === "active" && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="hebrew-text text-destructive"
                              onClick={() => handleStatusChange(user.id, 'suspended')}
                              disabled={updateStatusMutation.isPending}
                            >
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
            )}
          </CardContent>
        </Card>
      </div>
  );
};

export default AdminUsersList;