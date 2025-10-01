export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q || q.length < 2) {
    return new Response(JSON.stringify({ error: 'Invalid search term' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const geoRes = await fetch(`http://api.geonames.org/searchJSON?q=${encodeURIComponent(q)}&maxRows=5&username=wotileh938`);
    const data = await geoRes.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error("GeoNames API error:", err);
    return new Response(JSON.stringify({ error: 'Failed to fetch from GeoNames API' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
