let latestCoords = { lat: 0, lon: 0, timestamp: Date.now() };

export async function GET(req: Request) {

  const { searchParams } = new URL(req.url);

  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (lat && lon) {
    latestCoords = {
      lat: Number(lat),
      lon: Number(lon),
      timestamp: Date.now()
    };

    console.log("Data diterima dari tracker:", latestCoords);
  }

  return Response.json(latestCoords);
}