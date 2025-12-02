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
        JSON.stringify({ success: false, error: 'קוד אימות לא תקין' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = Deno.env.get('SMS_019_TOKEN');
    
    if (!token) {
      console.error('SMS credentials not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'שירות SMS לא מוגדר' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 019sms API requires POST with JSON body
    const requestBody = {
      validate_otp: {
        user: {
          token: token
        },
        phone: cleanPhone,
        code: parseInt(code)
      }
    };

    console.log(`Verifying OTP for ${cleanPhone}...`);
    
    const response = await fetch('https://019sms.co.il/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    
    const responseData = await response.json();
    console.log('019sms verify response:', JSON.stringify(responseData));

    // Status codes: 0=success, 1=invalid code, 2=expired, 3=max tries exceeded
    if (responseData.status === 0 || responseData.status === '0') {
      return new Response(
        JSON.stringify({ success: true, message: 'קוד אומת בהצלחה' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Map error codes to Hebrew messages
    let errorMessage = 'קוד אימות שגוי';
    const status = parseInt(responseData.status);
    
    if (status === 1) {
      errorMessage = 'קוד אימות שגוי';
    } else if (status === 2) {
      errorMessage = 'הקוד פג תוקף. בקש קוד חדש';
    } else if (status === 3) {
      errorMessage = 'חרגת ממספר הניסיונות. בקש קוד חדש';
    }

    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
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
