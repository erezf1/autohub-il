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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check admin/support role
    const { data: roles } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    const isAdmin = roles?.some(r => r.role === 'admin' || r.role === 'support');
    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { vehicleId, vehicleData } = await req.json();

    if (!vehicleId) {
      return new Response(
        JSON.stringify({ error: 'Vehicle ID is required' }),
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
          JSON.stringify({ error: 'חסרים שדות חובה', field: 'required' }),
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
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
