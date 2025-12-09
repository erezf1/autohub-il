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
import { usePrivateUsers, useUpdatePrivateUserStatus } from "@/hooks/admin/usePrivateUsers";
import { GradientBorderContainer } from "@/components/ui/gradient-border-container";

const AdminPrivateUsersList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  
  const { data: privateUsers, isLoading } = usePrivateUsers(searchTerm, selectedFilter);
  const updateStatusMutation = useUpdatePrivateUserStatus();

  const handleStatusChange = async (userId: string, newStatus: string) => {
    await updateStatusMutation.mutateAsync({ userId, status: newStatus });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground hebrew-text">משתמשים פרטיים</h1>
          <p className="text-lg text-muted-foreground hebrew-text mt-2">
            ניהול משתמשים פרטיים המוכרים רכבים
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <GradientBorderContainer className="rounded-md">
        <Card className="bg-black border-0 rounded-md">
          <CardContent className="p-8">
            <div className="flex gap-6">
              <div className="relative flex-1">
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="חיפוש לפי שם או טלפון..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-12 h-12 text-base hebrew-text bg-muted text-white"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="lg" className="hebrew-text btn-hover-cyan">
                    <Filter className="ml-2 h-5 w-5" />
                    {selectedFilter === "all" ? "כל הסטטוסים" : 
                     selectedFilter === "active" ? "פעיל" :
                     selectedFilter === "pending" ? "ממתין" : 
                     selectedFilter === "suspended" ? "מושעה" : selectedFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-black border-0 shadow-lg" style={{
                  background: 'linear-gradient(135deg, #000000 0%, #000000 100%)',
                  border: '1px solid transparent',
                  backgroundImage: 'linear-gradient(#000000, #000000), linear-gradient(135deg, #2277ee, #5be1fd)',
                  backgroundOrigin: 'border-box',
                  backgroundClip: 'content-box, border-box',
                  boxShadow: '0 4px 12px rgba(34, 119, 238, 0.15)'
                }}>
                  <DropdownMenuItem onClick={() => setSelectedFilter("all")} className="hebrew-text text-white btn-hover-cyan">
                    כל הסטטוסים
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedFilter("active")} className="hebrew-text text-white btn-hover-cyan">
                    פעיל
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedFilter("pending")} className="hebrew-text text-white btn-hover-cyan">
                    ממתין לאישור
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedFilter("suspended")} className="hebrew-text text-white btn-hover-cyan">
                    מושעה
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      </GradientBorderContainer>

      {/* Private Users Table */}
      <GradientBorderContainer className="rounded-md">
        <Card className="bg-black border-0 rounded-md">
          <CardHeader>
            <CardTitle className="text-2xl hebrew-text text-white">רשימת משתמשים פרטיים ({privateUsers?.length || 0})</CardTitle>
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
                  <TableHead className="text-right hebrew-text text-base text-white">שם מלא</TableHead>
                  <TableHead className="text-right hebrew-text text-base text-white">טלפון</TableHead>
                  <TableHead className="text-right hebrew-text text-base text-white">מיקום</TableHead>
                  <TableHead className="text-right hebrew-text text-base text-white">תאריך הצטרפות</TableHead>
                  <TableHead className="text-right hebrew-text text-base text-white">עדכון אחרון</TableHead>
                  <TableHead className="text-right hebrew-text text-base text-white">סטטוס</TableHead>
                  <TableHead className="text-right hebrew-text text-base text-white">פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {privateUsers?.map((user: any) => (
                  <TableRow 
                    key={user.id} 
                    className="h-16 hover:bg-muted/50"
                  >
                    <TableCell className="font-medium hebrew-text text-base text-white">
                      {user.full_name || 'ללא שם'}
                    </TableCell>
                    <TableCell className="text-base text-white" dir="ltr">{user.phone_number}</TableCell>
                    <TableCell className="hebrew-text text-base text-white">
                      {user.location?.name_hebrew || 'לא צוין'}
                    </TableCell>
                    <TableCell className="hebrew-text text-base text-white">
                      {new Date(user.created_at).toLocaleDateString('he-IL')}
                    </TableCell>
                    <TableCell className="hebrew-text text-base text-white">
                      {user.updated_at ? new Date(user.updated_at).toLocaleDateString('he-IL') : '-'}
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
                      <div className="flex items-center gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/private-users/${user.id}`);
                          }}
                          className="h-8 w-8 p-0 btn-hover-cyan"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {user.status === 'pending' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(user.id, 'active');
                            }}
                            className="h-8 w-8 p-0 hover:bg-green-500/10"
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
                            className="h-8 w-8 p-0 hover:bg-red-500/10"
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
      </GradientBorderContainer>
    </div>
  );
};

export default AdminPrivateUsersList;
