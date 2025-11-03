import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // 1. Check for expiring subscriptions (7 days before expiry)
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    
    const { data: expiringProfiles, error: profileError } = await supabaseClient
      .from('user_profiles')
      .select('id, subscription_valid_until, business_name')
      .gte('subscription_valid_until', new Date().toISOString())
      .lte('subscription_valid_until', sevenDaysFromNow.toISOString());

    if (profileError) throw profileError;

    // Create notifications for expiring subscriptions
    for (const profile of expiringProfiles || []) {
      // Check if notification already sent
      const { data: existing } = await supabaseClient
        .from('user_notifications')
        .select('id')
        .eq('recipient_id', profile.id)
        .eq('notification_type', 'subscription_expiring')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .maybeSingle();

      if (!existing) {
        await supabaseClient.rpc('create_user_notification', {
          p_recipient_id: profile.id,
          p_type: 'subscription_expiring',
          p_title: 'המינוי שלך עומד לפוג',
          p_description: 'המינוי שלך יפוג בעוד 7 ימים. חדש את המינוי כדי להמשיך להשתמש בכל התכונות',
          p_entity_type: 'user',
          p_entity_id: profile.id,
          p_action_url: '/mobile/profile'
        });
      }
    }

    // 2. Check for auctions ending soon (1 hour before end)
    const oneHourFromNow = new Date();
    oneHourFromNow.setHours(oneHourFromNow.getHours() + 1);

    const { data: endingAuctions, error: auctionError } = await supabaseClient
      .from('auctions')
      .select('id, auction_end_time')
      .eq('status', 'active')
      .gte('auction_end_time', new Date().toISOString())
      .lte('auction_end_time', oneHourFromNow.toISOString());

    if (auctionError) throw auctionError;

    // Get all bidders for these auctions and notify them
    for (const auction of endingAuctions || []) {
      const { data: bidders } = await supabaseClient
        .from('auction_bids')
        .select('bidder_id')
        .eq('auction_id', auction.id);

      const uniqueBidders = [...new Set(bidders?.map(b => b.bidder_id) || [])];

      for (const bidderId of uniqueBidders) {
        // Check if notification already sent
        const { data: existing } = await supabaseClient
          .from('user_notifications')
          .select('id')
          .eq('recipient_id', bidderId)
          .eq('notification_type', 'auction_ending_soon')
          .eq('related_entity_id', auction.id)
          .gte('created_at', new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString())
          .maybeSingle();

        if (!existing) {
          await supabaseClient.rpc('create_user_notification', {
            p_recipient_id: bidderId,
            p_type: 'auction_ending_soon',
            p_title: 'המכרז מסתיים בקרוב',
            p_description: 'המכרז שהצעת בו מסתיים בעוד פחות משעה. זו ההזדמנות האחרונה להציע',
            p_entity_type: 'auction',
            p_entity_id: auction.id,
            p_action_url: `/mobile/auction/${auction.id}`
          });
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        expiring_subscriptions: expiringProfiles?.length || 0,
        ending_auctions: endingAuctions?.length || 0 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in scheduled-notifications:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
