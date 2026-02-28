/**
 * Webhook Test Endpoint
 */

export const prerender = false;

export const POST = async ({ request }) => {
  try {
    const payload = await request.json();

    return new Response(JSON.stringify({
      success: true,
      message: 'Webhook funktioniert!',
      received: payload,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};

export const GET = async () => {
  return new Response(JSON.stringify({
    status: 'OK',
    endpoint: '/api/webhook/test',
    methods: ['GET', 'POST']
  }), { status: 200, headers: { 'Content-Type': 'application/json' } });
};
