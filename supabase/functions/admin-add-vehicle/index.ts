import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify user is authenticated
    const authHeader = req.headers.get('Authorization')!;
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is admin
    const { data: roles, error: roleError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    if (roleError || !roles || !roles.some(r => r.role === 'admin' || r.role === 'support')) {
      console.error('Role check failed:', roleError);
      return new Response(
        JSON.stringify({ error: 'Forbidden - Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const vehicleData = await req.json();

    // Insert vehicle using service role (bypasses RLS)
    const { data: vehicle, error: vehicleError } = await supabaseClient
      .from('vehicle_listings')
      .insert([vehicleData])
      .select()
      .single();

    if (vehicleError) {
      console.error('Vehicle insert error:', vehicleError);
      
      // Parse field-specific errors
      let errorMessage = vehicleError.message;
      let errorField = null;
      
      // Detect numeric overflow on engine_size
      if (vehicleError.code === '22003' && vehicleError.message.includes('numeric field overflow')) {
        if (vehicleError.message.includes('engine_size')) {
          errorMessage = 'ערך נפח מנוע חייב להיות קטן מ-100 ליטר';
          errorField = 'engine_size';
        } else {
          errorMessage = 'אחד מהערכים הנומריים גדול מדי';
        }
      }
      
      // Detect missing required fields
      if (vehicleError.code === '23502') {
        const fieldMatch = vehicleError.message.match(/column "(\w+)"/);
        if (fieldMatch) {
          errorField = fieldMatch[1];
          const fieldLabels: Record<string, string> = {
            'make_id': 'יצרן',
            'model_id': 'דגם',
            'year': 'שנת ייצור',
            'price': 'מחיר',
            'owner_id': 'בעל רכב'
          };
          errorMessage = `השדה ${fieldLabels[errorField] || errorField} הוא חובה`;
        }
      }
      
      return new Response(
        JSON.stringify({ 
          error: errorMessage,
          field: errorField,
          code: vehicleError.code,
          details: vehicleError.details
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Vehicle created successfully:', vehicle.id);

    return new Response(
      JSON.stringify({ data: vehicle }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});