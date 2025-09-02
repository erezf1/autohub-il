import { useState } from "react";
import { FileBarChart, Download, Calendar, TrendingUp, Users, Car, Gavel, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";

// Mock data for reports
const availableReports = [
  {
    id: "user-growth",
    title: "צמיחת משתמשים",
    description: "דוח על הצטרפות משתמשים חדשים ופעילות במערכת",
    icon: Users,
    category: "משתמשים",
    formats: ["PDF", "Excel", "CSV"]
  },
  {
    id: "vehicle-activity",
    title: "פעילות רכבים",
    description: "דוח על רכבים שנוספו, נמכרו וצפיות",
    icon: Car,
    category: "רכבים",
    formats: ["PDF", "Excel", "CSV"]
  },
  {
    id: "auction-performance",
    title: "ביצועי מכירות פומביות",
    description: "דוח על מכירות פומביות והצעות מחיר",
    icon: Gavel,
    category: "מכירות פומביות",
    formats: ["PDF", "Excel"]
  },
  {
    id: "revenue-analysis",
    title: "ניתוח הכנסות",
    description: "דוח על הכנסות ממנויים ועמלות",
    icon: DollarSign,
    category: "כספים",
    formats: ["PDF", "Excel"]
  },
  {
    id: "support-tickets",
    title: "פניות תמיכה",
    description: "דוח על פניות תמיכה וזמני פתרון",
    icon: FileBarChart,
    category: "תמיכה",
    formats: ["PDF", "CSV"]
  }
];

const AdminReports = () => {
  const [selectedReport, setSelectedReport] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedFormat, setSelectedFormat] = useState<string>("");

  const getCategoryBadge = (category: string) => {
    const colors = {
      "משתמשים": "default",
      "רכבים": "secondary",
      "מכירות פומביות": "outline",
      "כספים": "destructive",
      "תמיכה": "default"
    };
    return (
      <Badge variant={colors[category as keyof typeof colors] as any} className="hebrew-text">
        {category}
      </Badge>
    );
  };

  const handleGenerateReport = () => {
    if (!selectedReport || !selectedFormat) {
      return;
    }
    
    console.log("Generating report:", {
      report: selectedReport,
      dateRange,
      format: selectedFormat
    });
    
    // Here you would typically make an API call to generate the report
    alert(`מכין דוח ${availableReports.find(r => r.id === selectedReport)?.title} במקובץ ${selectedFormat}`);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground hebrew-text">דוחות</h1>
          <p className="text-muted-foreground hebrew-text">
            יצירה וייצוא של דוחות מערכת
          </p>
        </div>
      </div>

      {/* Report Generation Section */}
      <Card>
        <CardHeader>
          <CardTitle className="hebrew-text">יצירת דוח חדש</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium hebrew-text">בחר דוח</label>
              <Select value={selectedReport} onValueChange={setSelectedReport}>
                <SelectTrigger className="hebrew-text">
                  <SelectValue placeholder="בחר סוג דוח" />
                </SelectTrigger>
                <SelectContent>
                  {availableReports.map((report) => (
                    <SelectItem key={report.id} value={report.id} className="hebrew-text">
                      {report.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium hebrew-text">טווח תאריכים</label>
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium hebrew-text">פורמט קובץ</label>
              <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                <SelectTrigger className="hebrew-text">
                  <SelectValue placeholder="בחר פורמט" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf" className="hebrew-text">PDF</SelectItem>
                  <SelectItem value="excel" className="hebrew-text">Excel</SelectItem>
                  <SelectItem value="csv" className="hebrew-text">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium hebrew-text">פעולה</label>
              <Button 
                onClick={handleGenerateReport}
                disabled={!selectedReport || !selectedFormat}
                className="w-full hebrew-text"
              >
                <Download className="h-4 w-4 ml-2" />
                צור דוח
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableReports.map((report) => {
          const IconComponent = report.icon;
          return (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg hebrew-text">{report.title}</CardTitle>
                      {getCategoryBadge(report.category)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm hebrew-text mb-4">
                  {report.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {report.formats.map((format) => (
                      <Badge key={format} variant="outline" className="text-xs">
                        {format}
                      </Badge>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedReport(report.id)}
                    className="hebrew-text"
                  >
                    בחר דוח
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Reports History */}
      <Card>
        <CardHeader>
          <CardTitle className="hebrew-text">דוחות אחרונים</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium hebrew-text">דוח צמיחת משתמשים</div>
                  <div className="text-sm text-muted-foreground hebrew-text">
                    1-31 ינואר 2024 • PDF
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="hebrew-text">הושלם</Badge>
                <Button variant="outline" size="sm" className="hebrew-text">
                  <Download className="h-4 w-4 ml-2" />
                  הורד
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-b">
              <div className="flex items-center gap-3">
                <Car className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium hebrew-text">דוח פעילות רכבים</div>
                  <div className="text-sm text-muted-foreground hebrew-text">
                    15-20 ינואר 2024 • Excel
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="hebrew-text">הושלם</Badge>
                <Button variant="outline" size="sm" className="hebrew-text">
                  <Download className="h-4 w-4 ml-2" />
                  הורד  
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium hebrew-text">ניתוח הכנסות</div>
                  <div className="text-sm text-muted-foreground hebrew-text">
                    1-15 ינואר 2024 • PDF
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-yellow-500 hover:bg-yellow-600 hebrew-text">בתהליך</Badge>
                <Button variant="outline" size="sm" disabled className="hebrew-text">
                  <Calendar className="h-4 w-4 ml-2" />
                  ממתין
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReports;