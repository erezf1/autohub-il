import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone, code } = await req.json();
    
    if (!phone || !code) {
      return new Response(
        JSON.stringify({ success: false, error: 'מספר טלפון או קוד חסרים' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Clean phone number
    const cleanPhone = phone.replace(/[\s-]/g, '');
    
    // Validate code format (6 digits)
    if (!/^\d{6}$/.test(code)) {
      return new Response(
        JSON.stringify({ success: false, error: 'קוד אימות שגוי', errorCode: 1 }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const username = Deno.env.get('SMS_019_USERNAME');
    
    if (!username) {
      console.error('SMS_019_USERNAME not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'שירות SMS לא מוגדר' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build the verification API URL
    const apiUrl = new URL('https://019sms.co.il/api');
    apiUrl.searchParams.set('check', 'otp');
    apiUrl.searchParams.set('user', username);
    apiUrl.searchParams.set('destination', cleanPhone);
    apiUrl.searchParams.set('code', code);

    console.log(`Verifying OTP for ${cleanPhone}...`);
    
    const response = await fetch(apiUrl.toString());
    const responseText = await response.text();
    
    console.log(`019sms verify response: ${responseText}`);

    // Parse the response code
    // 0 = Success
    // 1 = Invalid code
    // 2 = Expired
    // 3 = Max tries exceeded
    const responseCode = parseInt(responseText.trim(), 10);

    if (responseCode === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'קוד אומת בהצלחה' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Map error codes to Hebrew messages
    const errorMessages: Record<number, string> = {
      1: 'קוד אימות שגוי',
      2: 'פג תוקף הקוד',
      3: 'נוצלו כל הניסיונות. נסה לשלוח קוד חדש',
    };

    const errorMessage = errorMessages[responseCode] || 'שגיאה באימות הקוד';

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage,
        errorCode: responseCode 
      }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in verify-otp:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'שגיאה באימות הקוד' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
