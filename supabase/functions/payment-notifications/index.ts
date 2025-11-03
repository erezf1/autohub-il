import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentFailurePayload {
  userId: string;
  amount: number;
  reason: string;
  invoiceId?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const payload: PaymentFailurePayload = await req.json();

    // Validate payload
    if (!payload.userId || !payload.amount || !payload.reason) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: userId, amount, reason' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Get user info
    const { data: profile } = await supabaseClient
      .from('user_profiles')
      .select('business_name')
      .eq('id', payload.userId)
      .single();

    // Create admin notification for payment failure
    const { data, error } = await supabaseClient.rpc('create_admin_notification', {
      p_type: 'payment_failed',
      p_title: 'תשלום נכשל',
      p_description: `תשלום נכשל עבור ${profile?.business_name || 'משתמש'}: ₪${payload.amount}. סיבה: ${payload.reason}`,
      p_priority: 'high',
      p_entity_type: 'user',
      p_entity_id: payload.userId,
      p_assigned_to: null
    });

    if (error) throw error;

    return new Response(
      JSON.stringify({ 
        success: true, 
        notification_id: data 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in payment-notifications:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
