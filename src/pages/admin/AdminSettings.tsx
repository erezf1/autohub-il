import { useState } from "react";
import { Settings, Save, Plus, Edit, Trash2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GradientBorderContainer } from "@/components/ui/gradient-border-container";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
// Mock data for system settings
const vehicleCategories = [
  { id: 1, name: "רכבי נוסעים", subcategories: ["סדאן", "האצ'בק", "קופה", "קבריולט"], active: true },
  { id: 2, name: "רכבי שטח", subcategories: ["SUV", "קרוסאובר", "ג'יפ"], active: true },
  { id: 3, name: "רכב מסחרי", subcategories: ["טנדר", "מיניבוס", "משאית קלה"], active: true },
  { id: 4, name: "אופנועים", subcategories: ["קטנוע", "אופנוע כביש", "אופנוע שטח"], active: false }
];

const reportReasons = [
  { id: 1, reason: "מידע כוזב על הרכב", category: "רכב", active: true },
  { id: 2, reason: "מחירים לא הוגנים", category: "מחיר", active: true },
  { id: 3, reason: "התנהגות לא הולמת", category: "התנהגות", active: true },
  { id: 4, reason: "ספאם או פרסום", category: "ספאם", active: true },
  { id: 5, reason: "הונאה או רמאות", category: "הונאה", active: true }
];

const systemSettings = {
  commissionRate: 2.5,
  maxPhotosPerListing: 10,
  auctionDurationOptions: [1, 3, 7, 14],
  autoApproveUsers: false,
  maintenanceMode: false,
  emailNotifications: true
};

const AdminSettings = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  return (
    <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white hebrew-text">הגדרות מערכת</h1>
            <p className="text-lg text-muted-foreground hebrew-text mt-2">
              ניהול פרמטרים גלובליים של המערכת
            </p>
          </div>
            <Button size="lg" className="hebrew-text bg-gradient-to-r from-[#2277ee] to-[#5be1fd] text-black hover:from-[#5be1fd] hover:to-[#2277ee]">
            <Save className="h-4 w-4 ml-2" />
            שמור שינויים
            </Button>
          </div>

        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="bg-gray-900 grid w-full grid-cols-4">
            <TabsTrigger value="categories" className="hebrew-text data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2277ee] data-[state=active]:to-[#5be1fd] data-[state=active]:text-black">קטגוריות רכב</TabsTrigger>
            <TabsTrigger value="reports" className="hebrew-text data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2277ee] data-[state=active]:to-[#5be1fd] data-[state=active]:text-black">סיבות דיווח</TabsTrigger>
            <TabsTrigger value="system" className="hebrew-text data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2277ee] data-[state=active]:to-[#5be1fd] data-[state=active]:text-black">הגדרות מערכת</TabsTrigger>
            <TabsTrigger value="users" className="hebrew-text data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2277ee] data-[state=active]:to-[#5be1fd] data-[state=active]:text-black">הגדרות משתמשים</TabsTrigger>
          </TabsList>

          {/* Vehicle Categories Tab */}
        <TabsContent value="categories">
          <GradientBorderContainer className="rounded-md">
            <Card className="bg-black border-0 rounded-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white hebrew-text">קטגוריות רכב</CardTitle>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                    <Button className="hebrew-text bg-gradient-to-r from-[#2277ee] to-[#5be1fd] text-black hover:from-[#5be1fd] hover:to-[#2277ee]">
                      <Plus className="h-4 w-4 ml-2" />
                      הוסף קטגוריה
                    </Button>
                    </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]" dir="rtl">
                    <DialogHeader>
                      <DialogTitle className="hebrew-text">הוסף קטגוריה חדשה</DialogTitle>
                      <DialogDescription className="hebrew-text">
                        הוסף קטגוריית רכב חדשה למערכת
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category-name" className="text-right hebrew-text text-white">
                          שם קטגוריה
                        </Label>
                        <GradientBorderContainer className="rounded-md col-span-3">
                          <Input
                            id="category-name"
                            placeholder="הזן שם קטגוריה"
                            className="hebrew-text border-0 bg-black rounded-md"
                          />
                        </GradientBorderContainer>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="subcategories" className="text-right hebrew-text text-white">
                          תת-קטגוריות
                        </Label>
                        <GradientBorderContainer className="rounded-md col-span-3">
                          <Textarea
                            id="subcategories"
                            placeholder="הזן תת-קטגוריות מופרדות בפסיק"
                            className="hebrew-text border-0 bg-black rounded-md"
                          />
                        </GradientBorderContainer>
                      </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" className="hebrew-text bg-gradient-to-r from-[#2277ee] to-[#5be1fd] text-black hover:from-[#5be1fd] hover:to-[#2277ee]">
                        הוסף קטגוריה
                        </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left text-white hebrew-text">פעולות</TableHead>
                    <TableHead className="text-right text-white hebrew-text">סטטוס</TableHead>
                    <TableHead className="text-right text-white hebrew-text">תת-קטגוריות</TableHead>
                    <TableHead className="text-right text-white hebrew-text">קטגוריה</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehicleCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="hebrew-text btn-hover-cyan">
                            <Edit className="h-4 w-4 ml-1" />
                            ערוך
                          </Button>
                          <Button variant="outline" size="sm" className="text-destructive hebrew-text btn-hover-cyan">
                            <Trash2 className="h-4 w-4 ml-1" />
                            מחק
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={category.active ? "default" : "secondary"}
                          className="hebrew-text"
                        >
                          {category.active ? "פעיל" : "לא פעיל"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 justify-end">
                          {category.subcategories.map((sub, index) => (
                            <Badge key={index} variant="outline" className="text-xs hebrew-text">
                              {sub}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-white hebrew-text text-right">
                        {category.name}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            </Card>
          </GradientBorderContainer>
        </TabsContent>

        {/* Report Reasons Tab */}
        <TabsContent value="reports">
          <GradientBorderContainer className="rounded-md">
            <Card className="bg-black border-0 rounded-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white hebrew-text">סיבות לדיווח</CardTitle>
                  <Button className="hebrew-text bg-gradient-to-r from-[#2277ee] to-[#5be1fd] text-black hover:from-[#5be1fd] hover:to-[#2277ee]">
                    <Plus className="h-4 w-4 ml-2" />
                    הוסף סיבה
                  </Button>
                </div>
              </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left text-white hebrew-text">פעולות</TableHead>
                    <TableHead className="text-right text-white hebrew-text">סטטוס</TableHead>
                    <TableHead className="text-right text-white hebrew-text">קטגוריה</TableHead>
                    <TableHead className="text-right text-white hebrew-text">סיבת דיווח</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportReasons.map((reason) => (
                    <TableRow key={reason.id}>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="hebrew-text btn-hover-cyan">
                            <Edit className="h-4 w-4 ml-1" />
                            ערוך
                          </Button>
                          <Button variant="outline" size="sm" className="text-destructive hebrew-text btn-hover-cyan">
                            <Trash2 className="h-4 w-4 ml-1" />
                            מחק
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={reason.active ? "default" : "secondary"}
                          className="hebrew-text"
                        >
                          {reason.active ? "פעיל" : "לא פעיל"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="hebrew-text">
                          {reason.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-white hebrew-text text-right">
                        {reason.reason}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            </Card>
          </GradientBorderContainer>
        </TabsContent>

        {/* System Settings Tab */}
        <TabsContent value="system">
          <div className="grid gap-6">
            <GradientBorderContainer className="rounded-md">
              <Card className="bg-black border-0 rounded-md">
                <CardHeader>
                  <CardTitle className="text-white hebrew-text">הגדרות כלליות</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-white hebrew-text">אחוז עמלה (%)</Label>
                      <GradientBorderContainer className="rounded-md">
                        <Input 
                          type="number" 
                          value={systemSettings.commissionRate}
                          className="hebrew-text border-0 bg-black rounded-md"
                        />
                      </GradientBorderContainer>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white hebrew-text">מקסימום תמונות לרכב</Label>
                      <GradientBorderContainer className="rounded-md">
                        <Input 
                          type="number" 
                          value={systemSettings.maxPhotosPerListing}
                          className="hebrew-text border-0 bg-black rounded-md"
                        />
                      </GradientBorderContainer>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white hebrew-text">אפשרויות משך מכירה פומבית (ימים)</Label>
                    <div className="flex gap-2">
                      {systemSettings.auctionDurationOptions.map((duration) => (
                        <Badge key={duration} variant="outline" className="hebrew-text">
                          {duration} ימים
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </GradientBorderContainer>

            <GradientBorderContainer className="rounded-md">
              <Card className="bg-black border-0 rounded-md">
                <CardHeader>
                  <CardTitle className="text-white hebrew-text">הגדרות מערכת</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-white hebrew-text">אישור אוטומטי למשתמשים חדשים</Label>
                      <p className="text-sm text-muted-foreground hebrew-text">
                        משתמשים חדשים יאושרו אוטומטית ללא בדיקה ידנית
                      </p>
                    </div>
                    <Switch checked={systemSettings.autoApproveUsers} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-white hebrew-text">התראות אימייל</Label>
                      <p className="text-sm text-muted-foreground hebrew-text">
                        שלח התראות אימייל למשתמשים על פעילות במערכת
                      </p>
                    </div>
                    <Switch checked={systemSettings.emailNotifications} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      <div>
                        <Label className="text-white hebrew-text">מצב תחזוקה</Label>
                        <p className="text-sm text-muted-foreground hebrew-text">
                          הפעלת מצב תחזוקה תמנע מהמשתמשים גישה למערכת
                        </p>
                      </div>
                    </div>
                    <Switch checked={systemSettings.maintenanceMode} />
                  </div>
                </CardContent>
              </Card>
            </GradientBorderContainer>
          </div>
        </TabsContent>

        {/* User Settings Tab */}
        <TabsContent value="users">
          <GradientBorderContainer className="rounded-md">
            <Card className="bg-black border-0 rounded-md">
              <CardHeader>
                <CardTitle className="text-white hebrew-text">הגדרות משתמשים</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-white hebrew-text">מספר רכבים מקסימלי למשתמש רגיל</Label>
                    <GradientBorderContainer className="rounded-md">
                      <Input type="number" defaultValue="10" className="hebrew-text border-0 bg-black rounded-md" />
                    </GradientBorderContainer>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white hebrew-text">מספר רכבים מקסימלי למשתמש פרימיום</Label>
                    <GradientBorderContainer className="rounded-md">
                      <Input type="number" defaultValue="50" className="hebrew-text border-0 bg-black rounded-md" />
                    </GradientBorderContainer>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-white hebrew-text">מספר מכירות פומביות מקסימלי בו-זמנית</Label>
                    <GradientBorderContainer className="rounded-md">
                      <Input type="number" defaultValue="5" className="hebrew-text border-0 bg-black rounded-md" />
                    </GradientBorderContainer>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white hebrew-text">ימי שמירת נתונים לאחר מחיקת משתמש</Label>
                    <GradientBorderContainer className="rounded-md">
                      <Input type="number" defaultValue="30" className="hebrew-text border-0 bg-black rounded-md" />
                    </GradientBorderContainer>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-white hebrew-text">הגדרות דירוג סוחרים</Label>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm text-white hebrew-text">משקל מכירות (0-1)</Label>
                      <GradientBorderContainer className="rounded-md">
                        <Input type="number" step="0.1" defaultValue="0.4" className="hebrew-text border-0 bg-black rounded-md" />
                      </GradientBorderContainer>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-white hebrew-text">משקל דירוג (0-1)</Label>
                      <GradientBorderContainer className="rounded-md">
                        <Input type="number" step="0.1" defaultValue="0.6" className="hebrew-text border-0 bg-black rounded-md" />
                      </GradientBorderContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </GradientBorderContainer>
        </TabsContent>
        </Tabs>
      </div>
  );
};

export default AdminSettings;