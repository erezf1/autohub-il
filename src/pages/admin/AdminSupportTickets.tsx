import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GradientBorderContainer } from "@/components/ui/gradient-border-container";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, MessageSquare, User } from "lucide-react";
import { useSupportTickets } from "@/hooks/admin/useSupportTickets";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

const AdminSupportTickets = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const { data: tickets, isLoading } = useSupportTickets(searchTerm, activeTab);

  const getPriorityBadge = (priority: string) => {
    const variants: { [key: string]: "default" | "destructive" | "outline" | "secondary" } = {
      high: "destructive",
      medium: "secondary",
      low: "outline",
    };
    return <Badge variant={variants[priority] || "default"}>{priority === "high" ? "גבוהה" : priority === "medium" ? "בינונית" : "נמוכה"}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "default" | "destructive" | "outline" | "secondary" } = {
      open: "secondary",
      in_progress: "default",
      resolved: "outline",
      closed: "outline",
    };
    const labels: { [key: string]: string } = {
      open: "פתוח",
      in_progress: "בטיפול",
      resolved: "נפתר",
      closed: "סגור",
    };
    return <Badge variant={variants[status] || "default"}>{labels[status] || status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background p-6" dir="rtl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">פניות תמיכה</h1>
        <p className="text-muted-foreground">ניהול פניות ותלונות</p>
      </div>

      {/* Search and Filter Section */}
      <GradientBorderContainer className="mb-6">
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="חפש לפי כותרת..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>
        </Card>
      </GradientBorderContainer>

      {/* Tickets Table */}
      <GradientBorderContainer>
        <Card className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">הכל</TabsTrigger>
              <TabsTrigger value="open">פתוחות</TabsTrigger>
              <TabsTrigger value="in_progress">בטיפול</TabsTrigger>
              <TabsTrigger value="resolved">נפתרו</TabsTrigger>
              <TabsTrigger value="closed">סגורות</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : tickets && tickets.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">אין פניות תמיכה</h3>
                  <p className="text-muted-foreground">לא נמצאו פניות תמיכה במערכת</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">כותרת</TableHead>
                        <TableHead className="text-right">סטטוס</TableHead>
                        <TableHead className="text-right">עדיפות</TableHead>
                        <TableHead className="text-right">נוצר</TableHead>
                        <TableHead className="text-right">פעולות</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tickets?.map((ticket) => (
                        <TableRow key={ticket.id}>
                          <TableCell className="font-medium">{ticket.subject}</TableCell>
                          <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                          <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(ticket.created_at), {
                              addSuffix: true,
                              locale: ar,
                            })}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => navigate(`/admin/support-tickets/${ticket.id}`)}
                              >
                                צפה
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </GradientBorderContainer>
    </div>
  );
};

export default AdminSupportTickets;
