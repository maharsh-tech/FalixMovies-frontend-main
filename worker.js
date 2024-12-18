addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
  });
  
  async function handleRequest(request) {
    const { method, headers } = request;
  
    // Handle CORS preflight requests
    if (method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }
  
    // Handle POST requests for CAPTCHA and Firebase authentication
    if (method === 'POST') {
      try {
        const data = await request.json();
        const { email, password, captchaToken } = data;
  
        // Verify CAPTCHA token with Turnstile
        const captchaResponse = await fetch(
          'https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              secret: '0x4AAAAAAA1soQlN-XcF1jzDQnuxJWiwCrE', // Replace with your actual secret key
              response: captchaToken,
            }),
          }
        );
  
        const captchaResult = await captchaResponse.json();
        if (!captchaResult.success) {
          return new Response(JSON.stringify({ message: 'CAPTCHA verification failed' }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          });
        }
  
        // Authenticate with Firebase using REST API
        const firebaseApiKey = 'AIzaSyCqiuLUNuDAHkeA1xlt1CN5o0sc4SNK7yA'; // Replace with your actual Firebase API key
        const firebaseAuthUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseApiKey}`;
  
        const firebaseResponse = await fetch(firebaseAuthUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true,
          }),
        });
  
        const firebaseResult = await firebaseResponse.json();
        if (firebaseResult.error) {
          return new Response(JSON.stringify({ message: firebaseResult.error.message }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          });
        }
  
        return new Response(JSON.stringify({ message: 'Authentication successful' }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      } catch (error) {
        return new Response(JSON.stringify({ message: 'Error occurred' }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    }
  
    return new Response('Method not allowed', {
      status: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
  
