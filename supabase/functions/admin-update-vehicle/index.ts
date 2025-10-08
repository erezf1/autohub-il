import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'חסר אימות. אנא התחבר מחדש.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create client for auth validation (with anon key)
    const authClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await authClient.auth.getUser();
    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'אימות נכשל. אנא התחבר מחדש.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create service role client for database operations
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check admin/support role
    const { data: roles, error: rolesError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    if (rolesError) {
      console.error('Error fetching roles:', rolesError);
      return new Response(
        JSON.stringify({ error: 'שגיאה בבדיקת הרשאות המשתמש' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const isAdmin = roles?.some(r => r.role === 'admin' || r.role === 'support');
    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: 'נדרשות הרשאות מנהל לביצוע פעולה זו' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { vehicleId, vehicleData } = await req.json();

    if (!vehicleId) {
      return new Response(
        JSON.stringify({ error: 'מזהה רכב חסר' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!vehicleData) {
      return new Response(
        JSON.stringify({ error: 'חסרים נתוני רכב' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate engine size if provided
    if (vehicleData.engine_size !== undefined && vehicleData.engine_size !== null) {
      const engineSize = parseFloat(vehicleData.engine_size);
      if (engineSize >= 100) {
        return new Response(
          JSON.stringify({ error: 'נפח מנוע חייב להיות קטן מ-100 ליטר', field: 'engine_size' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Remove owner_id from update data to prevent changing ownership
    const { owner_id, ...updateData } = vehicleData;

    // Update vehicle
    const { data: vehicle, error: insertError } = await supabaseClient
      .from('vehicle_listings')
      .update(updateData)
      .eq('id', vehicleId)
      .select()
      .single();

    if (insertError) {
      console.error('Error updating vehicle:', insertError);
      
      if (insertError.code === '22003') {
        return new Response(
          JSON.stringify({ error: 'אחד הערכים המספריים גדול מדי', field: 'numeric' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (insertError.code === '23502') {
        return new Response(
          JSON.stringify({ error: 'חסרים שדות חובה. אנא מלא את כל השדות הנדרשים.', field: 'required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (insertError.code === '23503') {
        return new Response(
          JSON.stringify({ error: 'ערך לא חוקי באחד מהשדות. אנא בדוק את הנתונים.', field: 'foreign_key' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw insertError;
    }

    console.log('Vehicle updated successfully:', vehicle.id);

    return new Response(
      JSON.stringify({ vehicle }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in admin-update-vehicle function:', error);
    const errorMessage = error instanceof Error ? error.message : 'שגיאה לא ידועה';
    return new Response(
      JSON.stringify({ error: `שגיאה בעדכון הרכב: ${errorMessage}` }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
