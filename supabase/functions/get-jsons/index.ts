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
    console.log('Fetching JSON data from backend');

    // Sample JSON data - can be replaced with database queries or external API calls
    const jsonData = [
      {
        id: 1,
        data: {
          name: "Backend Example 1",
          description: "This is a sample JSON from the backend",
          value: 123,
          active: true,
          tags: ["backend", "api", "example"]
        }
      },
      {
        id: 2,
        data: {
          name: "Backend Example 2",
          description: "Another sample JSON with nested structure",
          user: {
            id: 1001,
            username: "developer",
            email: "dev@example.com"
          },
          items: [
            { id: 1, name: "Item 1", quantity: 5 },
            { id: 2, name: "Item 2", quantity: 10 }
          ]
        }
      },
      {
        id: 3,
        data: {
          name: "Backend Example 3",
          timestamp: new Date().toISOString(),
          status: "active",
          metrics: {
            views: 1520,
            likes: 342,
            shares: 89
          }
        }
      }
    ];

    console.log(`Returning ${jsonData.length} JSON objects`);

    return new Response(
      JSON.stringify(jsonData),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error in get-jsons function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch JSON data',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
        status: 500
      }
    );
  }
});
