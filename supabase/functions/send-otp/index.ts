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
    const token = Deno.env.get('SMS_019_TOKEN');
    
    if (!username || !token) {
      console.error('SMS credentials not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'שירות SMS לא מוגדר' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 019sms API requires POST with JSON body
    const requestBody = {
      send_otp: {
        user: {
          username: username,
          token: token
        },
        phone: cleanPhone,
        source: '0555502266',
        text: 'קוד הכניסה שלך למערכת DEALERS הוא [code]',
        valid_time: 5,
        max_tries: 3
      }
    };

    console.log(`Sending OTP to ${cleanPhone}...`);
    
    const response = await fetch('https://019sms.co.il/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    
    const responseData = await response.json();
    console.log('019sms response:', JSON.stringify(responseData));

    // Check response status (0 = success)
    if (responseData.status === 0 || responseData.status === '0') {
      return new Response(
        JSON.stringify({ success: true, message: 'קוד נשלח בהצלחה' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Error handling based on status codes
    let errorMessage = 'שליחת הקוד נכשלה. נסה שוב';
    if (responseData.message) {
      console.error(`019sms error: ${responseData.status} - ${responseData.message}`);
    }

    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-otp:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'שגיאה בשליחת הקוד' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
