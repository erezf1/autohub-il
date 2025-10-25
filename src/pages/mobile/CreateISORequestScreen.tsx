import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { PageContainer, PageHeader } from "@/components/common";
import { Button } from "@/components/ui/button";
import { GradientBorderContainer } from "@/components/ui/gradient-border-container";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCreateISORequest } from "@/hooks/mobile";
import { useVehicleMakes, useVehicleModels } from "@/hooks/mobile";
import { LoadingSpinner } from "@/components/common";

const createISORequestSchema = z.object({
  title: z.string()
    .min(3, "הכותרת חייבת להכיל לפחות 3 תווים")
    .max(100, "הכותרת לא יכולה להכיל יותר מ-100 תווים"),
  description: z.string().max(500, "התיאור לא יכול להכיל יותר מ-500 תווים").optional().or(z.literal("")),
  make_id: z.number().optional(),
  model_id: z.number().optional(),
  year_from: z.number().min(1990, "שנה לא תקינה").max(2025, "שנה לא תקינה").optional().or(z.nan()),
  year_to: z.number().min(1990, "שנה לא תקינה").max(2025, "שנה לא תקינה").optional().or(z.nan()),
  price_from: z.number().min(0, "מחיר חייב להיות חיובי").optional().or(z.nan()),
  price_to: z.number().min(0, "מחיר חייב להיות חיובי").optional().or(z.nan()),
}).refine(
  (data) => {
    if (data.year_to && data.year_from && !isNaN(data.year_to) && !isNaN(data.year_from)) {
      return data.year_to >= data.year_from;
    }
    return true;
  },
  {
    message: "שנת סיום חייבת להיות גדולה או שווה לשנת התחלה",
    path: ["year_to"],
  }
).refine(
  (data) => {
    if (data.price_to && data.price_from && !isNaN(data.price_to) && !isNaN(data.price_from)) {
      return data.price_to >= data.price_from;
    }
    return true;
  },
  {
    message: "מחיר סיום חייב להיות גדול או שווה למחיר התחלה",
    path: ["price_to"],
  }
);

type FormValues = z.infer<typeof createISORequestSchema>;

export const CreateISORequestScreen = () => {
  const navigate = useNavigate();
  const createMutation = useCreateISORequest();
  const { data: makes, isLoading: makesLoading } = useVehicleMakes();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(createISORequestSchema),
    defaultValues: {
      title: "",
      description: "",
      make_id: undefined,
      model_id: undefined,
      year_from: undefined,
      year_to: undefined,
      price_from: undefined,
      price_to: undefined,
    },
  });

  const selectedMakeId = form.watch("make_id");
  const { data: models, isLoading: modelsLoading } = useVehicleModels(selectedMakeId);

  // Reset model when make changes
  useEffect(() => {
    if (selectedMakeId !== undefined) {
      form.setValue("model_id", undefined);
    }
  }, [selectedMakeId, form]);

  const onSubmit = async (values: FormValues) => {
    await createMutation.mutateAsync({
      title: values.title,
      description: values.description || undefined,
      make_id: values.make_id || undefined,
      model_id: values.model_id || undefined,
      year_from: values.year_from && !isNaN(values.year_from) ? values.year_from : undefined,
      year_to: values.year_to && !isNaN(values.year_to) ? values.year_to : undefined,
      price_from: values.price_from && !isNaN(values.price_from) ? values.price_from : undefined,
      price_to: values.price_to && !isNaN(values.price_to) ? values.price_to : undefined,
    });
    
    navigate("/mobile/required-cars?tab=mine");
  };

  return (
    <PageContainer>
      <PageHeader title="צור בקשת חיפוש" onBack={() => navigate("/mobile/required-cars")} />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <GradientBorderContainer className="rounded-lg">
            <div className="p-4 space-y-4">
              <h3 className="text-lg font-semibold text-white hebrew-text">מידע בסיסי</h3>
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white hebrew-text">כותרת *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        dir="rtl"
                        placeholder="לדוגמה: מחפש טויוטה קורולה 2015-2018"
                        className="bg-[#151515] text-white hebrew-text"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs hebrew-text" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white hebrew-text">תיאור</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        dir="rtl"
                        placeholder="תיאור מפורט של הרכב המבוקש..."
                        rows={4}
                        className="bg-[#151515] text-white hebrew-text"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs hebrew-text" />
                  </FormItem>
                )}
              />
            </div>
          </GradientBorderContainer>

          {/* Vehicle Details */}
          <GradientBorderContainer className="rounded-lg">
            <div className="p-4 space-y-4">
              <h3 className="text-lg font-semibold text-white hebrew-text">פרטי הרכב</h3>
              
              <FormField
                control={form.control}
                name="make_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white hebrew-text">יצרן</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-[#151515] text-white hebrew-text" dir="rtl">
                          <SelectValue placeholder={makesLoading ? "טוען..." : "בחר יצרן"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#1a1a1a] border-gray-800 z-50">
                        {makes?.map((make) => (
                          <SelectItem 
                            key={make.id} 
                            value={make.id.toString()}
                            className="text-white hebrew-text hover:bg-[#252525]"
                          >
                            {make.name_hebrew}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500 text-xs hebrew-text" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="model_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white hebrew-text">דגם</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString()}
                      disabled={!selectedMakeId || modelsLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-[#151515] text-white hebrew-text" dir="rtl">
                          <SelectValue 
                            placeholder={
                              !selectedMakeId 
                                ? "בחר יצרן תחילה" 
                                : modelsLoading 
                                ? "טוען..." 
                                : "בחר דגם"
                            } 
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#1a1a1a] border-gray-800 z-50">
                        {models?.map((model) => (
                          <SelectItem 
                            key={model.id} 
                            value={model.id.toString()}
                            className="text-white hebrew-text hover:bg-[#252525]"
                          >
                            {model.name_hebrew}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500 text-xs hebrew-text" />
                  </FormItem>
                )}
              />
            </div>
          </GradientBorderContainer>

          {/* Price & Year Ranges */}
          <GradientBorderContainer className="rounded-lg">
            <div className="p-4 space-y-4">
              <h3 className="text-lg font-semibold text-white hebrew-text">תקציב ושנה</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price_from"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white hebrew-text">מחיר מינימלי (₪)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          dir="rtl"
                          placeholder="0"
                          className="bg-[#151515] text-white"
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs hebrew-text" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price_to"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white hebrew-text">מחיר מקסימלי (₪)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          dir="rtl"
                          placeholder="500,000"
                          className="bg-[#151515] text-white"
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs hebrew-text" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="year_from"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white hebrew-text">שנה מ-</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          dir="rtl"
                          placeholder="2015"
                          className="bg-[#151515] text-white"
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs hebrew-text" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="year_to"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white hebrew-text">שנה עד</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          dir="rtl"
                          placeholder="2023"
                          className="bg-[#151515] text-white"
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs hebrew-text" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </GradientBorderContainer>

          {/* Action Buttons */}
          <div className="space-y-3">
            <GradientBorderContainer className="rounded-md">
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="w-full bg-black border-0 hebrew-text"
              >
                {createMutation.isPending ? "שומר..." : "צור בקשה"}
              </Button>
            </GradientBorderContainer>

            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/mobile/required-cars")}
              className="w-full hebrew-text"
            >
              ביטול
            </Button>
          </div>
        </form>
      </Form>
    </PageContainer>
  );
};

export default CreateISORequestScreen;
