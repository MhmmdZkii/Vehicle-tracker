import mqtt from 'mqtt';

let latestCoords = { lat: 0, lon: 0, timestamp: Date.now() };

const brokerUrl = 'mqtt://mosquitto-abc123.up.railway.app:1883';  // GANTI
const client = mqtt.connect(brokerUrl);

client.on('connect', () => {
  console.log('MQTT connected');
  client.subscribe('gps/tracker');
});

client.on('message', (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    latestCoords = { ...data, timestamp: Date.now() };
    console.log('GPS update:', latestCoords);
  } catch (e) {
    console.error('Invalid MQTT data:', e);
  }
});

// API GET untuk frontend ambil data terbaru
export async function GET() {
  return Response.json(latestCoords);
}