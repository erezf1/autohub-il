import { useNavigate } from "react-router-dom";
import { PageContainer, PageHeader } from "@/components/common";
import { Button } from "@/components/ui/button";
import { GradientBorderContainer } from "@/components/ui/gradient-border-container";

export const CreateISORequestScreen = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <PageHeader title="צור בקשת חיפוש" onBack={() => navigate("/mobile/required-cars")} />
      
      <div className="text-center py-12">
        <h2 className="text-xl text-white hebrew-text mb-4">דף זה בבנייה</h2>
        <p className="text-muted-foreground hebrew-text mb-6">
          טופס יצירת בקשת חיפוש חדשה יהיה זמין בקרוב
        </p>
        <GradientBorderContainer className="rounded-md">
          <Button
            onClick={() => navigate("/mobile/required-cars")}
            className="bg-black border-0 hebrew-text"
          >
            חזרה לרשימת הבקשות
          </Button>
        </GradientBorderContainer>
      </div>
    </PageContainer>
  );
};

export default CreateISORequestScreen;
