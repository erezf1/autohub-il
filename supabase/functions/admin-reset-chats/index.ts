import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('[admin-reset-chats] No authorization header');
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      console.error('[admin-reset-chats] Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[admin-reset-chats] User authenticated:', user.id);

    // Check if user is admin or support
    const { data: roles, error: roleError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    if (roleError || !roles || roles.length === 0) {
      console.error('[admin-reset-chats] Role check failed:', roleError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized - no role found' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const isAdmin = roles.some(r => r.role === 'admin' || r.role === 'support');
    if (!isAdmin) {
      console.error('[admin-reset-chats] User is not admin/support:', roles);
      return new Response(
        JSON.stringify({ error: 'Forbidden - admin role required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[admin-reset-chats] Admin verified, proceeding with deletion');

    // Delete all conversations (cascades to messages via ON DELETE CASCADE)
    const { data: deletedConversations, error: deleteError } = await supabaseClient
      .from('chat_conversations')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')
      .select('id');

    if (deleteError) {
      console.error('[admin-reset-chats] Delete error:', deleteError);
      return new Response(
        JSON.stringify({ error: 'Failed to delete conversations', details: deleteError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const deletedCount = deletedConversations?.length || 0;
    console.log(`[admin-reset-chats] Successfully deleted ${deletedCount} conversations`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        deletedConversations: deletedCount,
        message: `נמחקו ${deletedCount} שיחות ההודעות המשויכות להן`
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[admin-reset-chats] Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
