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
    const { phone } = await req.json();
    
    if (!phone) {
      return new Response(
        JSON.stringify({ success: false, error: 'מספר טלפון חסר' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Clean phone number - remove dashes and spaces
    const cleanPhone = phone.replace(/[\s-]/g, '');
    
    // Validate Israeli phone format
    if (!/^05\d{8}$/.test(cleanPhone)) {
      return new Response(
        JSON.stringify({ success: false, error: 'מספר טלפון לא תקין' }),
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

    // 019sms API configuration
    const source = '0555502266';
    const message = 'קוד הכניסה שלך למערכת DEALERS הוא [code]';
    const validTime = 5; // minutes
    const maxTries = 3;
    const codeLength = 6;

    // Build the API URL
    const apiUrl = new URL('https://019sms.co.il/api');
    apiUrl.searchParams.set('send', 'otp');
    apiUrl.searchParams.set('user', username);
    apiUrl.searchParams.set('source', source);
    apiUrl.searchParams.set('destination', cleanPhone);
    apiUrl.searchParams.set('message', message);
    apiUrl.searchParams.set('valid', validTime.toString());
    apiUrl.searchParams.set('tries', maxTries.toString());
    apiUrl.searchParams.set('length', codeLength.toString());

    console.log(`Sending OTP to ${cleanPhone}...`);
    
    const response = await fetch(apiUrl.toString());
    const responseText = await response.text();
    
    console.log(`019sms response: ${responseText}`);

    // Parse response - 019sms returns status codes
    // Success response format varies, check for success indicators
    const isSuccess = responseText.includes('0') || responseText.toLowerCase().includes('success');
    
    if (!response.ok || !isSuccess) {
      console.error(`019sms error: ${responseText}`);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'שליחת הקוד נכשלה. נסה שוב',
          details: responseText 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'קוד נשלח בהצלחה' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-otp:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'שגיאה בשליחת הקוד' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
