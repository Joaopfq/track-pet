import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!lat || !lon || isNaN(Number(lat)) || isNaN(Number(lon))) {
    return NextResponse.json({ error: 'Invalid or missing coordinates' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      {
        headers: {
          'User-Agent': 'Track-Pet/1.0', // Nominatim requires this header
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch data from Nominatim' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const neighborhood =
      data?.address?.road ||
      data?.address?.town ||
      data?.address?.municipality ||
      data?.address?.state ||
      'Unknown';

    return NextResponse.json({ neighborhood });
  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}