let latestCoords = { lat: 0, lon: 0, timestamp: Date.now() };

export async function GET() {
  return Response.json(latestCoords);
}

export async function POST(req: Request) {
  const body = await req.json();
  latestCoords = { lat: body.lat, lon: body.lon, timestamp: Date.now() };
  console.log("Data diterima:", latestCoords); 
  return Response.json({ message: "Saved!", latestCoords });
}