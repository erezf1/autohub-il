import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PageContainer, PageHeader } from "@/components/common";
import { GradientBorderContainer } from "@/components/ui/gradient-border-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateISORequest } from "@/hooks/mobile/useISORequests";
import { useQuery } from "@tanstack/react-query";
import { dealerClient } from "@/integrations/supabase/dealerClient";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(3, "הכותרת חייבת להכיל לפחות 3 תווים"),
  description: z.string().optional(),
  make_id: z.number().optional(),
  model_id: z.number().optional(),
  year_from: z.number().min(1900).max(2030).optional().or(z.literal("")),
  year_to: z.number().min(1900).max(2030).optional().or(z.literal("")),
  price_from: z.number().min(0).optional().or(z.literal("")),
  price_to: z.number().min(0).optional().or(z.literal("")),
  max_kilometers: z.number().min(0).optional().or(z.literal("")),
  transmission_preference: z.string().optional(),
  fuel_type_preference: z.string().optional(),
  location_id: z.number().optional(),
  additional_requirements: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const CreateISORequestScreen = () => {
  const navigate = useNavigate();
  const createRequest = useCreateISORequest();
  const [selectedMakeId, setSelectedMakeId] = useState<number | undefined>();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      transmission_preference: "",
      fuel_type_preference: "",
      additional_requirements: "",
    },
  });

  // Fetch makes
  const { data: makes = [] } = useQuery({
    queryKey: ["vehicle-makes"],
    queryFn: async () => {
      const { data, error } = await dealerClient
        .from("vehicle_makes")
        .select("*")
        .eq("is_active", true)
        .order("name_hebrew");
      if (error) throw error;
      return data;
    },
  });

  // Fetch models based on selected make
  const { data: models = [] } = useQuery({
    queryKey: ["vehicle-models", selectedMakeId],
    queryFn: async () => {
      if (!selectedMakeId) return [];
      const { data, error } = await dealerClient
        .from("vehicle_models")
        .select("*")
        .eq("make_id", selectedMakeId)
        .eq("is_active", true)
        .order("name_hebrew");
      if (error) throw error;
      return data;
    },
    enabled: !!selectedMakeId,
  });

  // Fetch locations
  const { data: locations = [] } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const { data, error } = await dealerClient
        .from("locations")
        .select("*")
        .eq("is_active", true)
        .order("name_hebrew");
      if (error) throw error;
      return data;
    },
  });

  const onSubmit = async (values: FormValues) => {
    await createRequest.mutateAsync({
      title: values.title,
      description: values.description,
      make_id: values.make_id,
      model_id: values.model_id,
      transmission_preference: values.transmission_preference,
      fuel_type_preference: values.fuel_type_preference,
      location_id: values.location_id,
      additional_requirements: values.additional_requirements,
      year_from: values.year_from || undefined,
      year_to: values.year_to || undefined,
      price_from: values.price_from || undefined,
      price_to: values.price_to || undefined,
      max_kilometers: values.max_kilometers || undefined,
    });
    navigate("/mobile/required-cars");
  };

  return (
    <PageContainer>
      <PageHeader title="צור בקשת חיפוש" onBack={() => navigate("/mobile/required-cars")} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <GradientBorderContainer className="rounded-lg">
            <div className="bg-[#151515] p-4 rounded-lg space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white hebrew-text">כותרת הבקשה *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="לדוגמה: טויוטה קורולה 2020"
                        className="bg-black border-border/50 text-white hebrew-text"
                        dir="rtl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white hebrew-text">תיאור מפורט</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="תאר את הרכב המבוקש בפירוט..."
                        className="bg-black border-border/50 text-white hebrew-text"
                        rows={3}
                        dir="rtl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </GradientBorderContainer>

          <GradientBorderContainer className="rounded-lg">
            <div className="bg-[#151515] p-4 rounded-lg space-y-4">
              <h3 className="font-semibold text-white hebrew-text">פרטי הרכב</h3>

              <FormField
                control={form.control}
                name="make_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white hebrew-text">יצרן</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        const makeId = parseInt(value);
                        field.onChange(makeId);
                        setSelectedMakeId(makeId);
                        form.setValue("model_id", undefined);
                      }}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-black border-border/50 text-white">
                          <SelectValue placeholder="בחר יצרן" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {makes.map((make) => (
                          <SelectItem key={make.id} value={make.id.toString()}>
                            {make.name_hebrew}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
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
                      disabled={!selectedMakeId}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-black border-border/50 text-white">
                          <SelectValue placeholder="בחר דגם" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {models.map((model) => (
                          <SelectItem key={model.id} value={model.id.toString()}>
                            {model.name_hebrew}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                          placeholder="2015"
                          className="bg-black border-border/50 text-white"
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : "")}
                        />
                      </FormControl>
                      <FormMessage />
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
                          placeholder="2022"
                          className="bg-black border-border/50 text-white"
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : "")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="max_kilometers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white hebrew-text">קילומטרז' מקסימלי</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="120000"
                        className="bg-black border-border/50 text-white"
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : "")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </GradientBorderContainer>

          <GradientBorderContainer className="rounded-lg">
            <div className="bg-[#151515] p-4 rounded-lg space-y-4">
              <h3 className="font-semibold text-white hebrew-text">תקציב</h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price_from"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white hebrew-text">מחיר מ- (₪)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="50000"
                          className="bg-black border-border/50 text-white"
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : "")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price_to"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white hebrew-text">מחיר עד (₪)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="100000"
                          className="bg-black border-border/50 text-white"
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : "")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </GradientBorderContainer>

          <GradientBorderContainer className="rounded-lg">
            <div className="bg-[#151515] p-4 rounded-lg space-y-4">
              <h3 className="font-semibold text-white hebrew-text">העדפות נוספות</h3>

              <FormField
                control={form.control}
                name="transmission_preference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white hebrew-text">תיבת הילוכים</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-black border-border/50 text-white">
                          <SelectValue placeholder="בחר העדפה" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="manual">ידני</SelectItem>
                        <SelectItem value="automatic">אוטומט</SelectItem>
                        <SelectItem value="any">לא משנה</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fuel_type_preference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white hebrew-text">סוג דלק</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-black border-border/50 text-white">
                          <SelectValue placeholder="בחר סוג דלק" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="gasoline">בנזין</SelectItem>
                        <SelectItem value="diesel">דיזל</SelectItem>
                        <SelectItem value="hybrid">היברידי</SelectItem>
                        <SelectItem value="electric">חשמלי</SelectItem>
                        <SelectItem value="any">לא משנה</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white hebrew-text">מיקום מועדף</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-black border-border/50 text-white">
                          <SelectValue placeholder="בחר מיקום" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location.id} value={location.id.toString()}>
                            {location.name_hebrew}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="additional_requirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white hebrew-text">דרישות נוספות</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="צבע, תוספות, מצב כללי..."
                        className="bg-black border-border/50 text-white hebrew-text"
                        rows={2}
                        dir="rtl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </GradientBorderContainer>

          <div className="flex gap-3">
            <GradientBorderContainer className="rounded-md flex-1">
              <Button
                type="submit"
                disabled={createRequest.isPending}
                className="w-full bg-black border-0 hebrew-text"
              >
                {createRequest.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    שומר...
                  </>
                ) : (
                  "צור בקשה"
                )}
              </Button>
            </GradientBorderContainer>

            <GradientBorderContainer className="rounded-md flex-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/mobile/required-cars")}
                className="w-full border-0 hebrew-text"
              >
                ביטול
              </Button>
            </GradientBorderContainer>
          </div>
        </form>
      </Form>
    </PageContainer>
  );
};

export default CreateISORequestScreen;
