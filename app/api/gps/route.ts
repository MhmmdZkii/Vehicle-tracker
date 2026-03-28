import mqtt from 'mqtt';

let latestCoords = { lat: 0, lon: 0, speed: 0, sats: 0, time: '', timestamp: Date.now() };

const brokerUrl = 'mqtt://autorack.proxy.rlwy.net:28348';
const options = {
  username: 'BrokerSim800',
  password: 'mkdt86a5a8lxiwhg77gwefp43tv8zjj0',
  clientId: 'NextJS-Subscriber-' + Math.random().toString(16).substr(2),
};

const client = mqtt.connect(brokerUrl, options);

client.on('connect', () => {
  console.log('MQTT connected from Next.js');
  client.subscribe('gps/tracker');
});

client.on('message', (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    latestCoords = {
      lat: data.lat,
      lon: data.lon,
      speed: data.speed,
      sats: data.sats,
      time: data.time,
      timestamp: Date.now(),
    };
    console.log('GPS update diterima:', latestCoords);
  } catch (err) {
    console.error('Parse error:', err);
  }
});

// API endpoint untuk frontend polling
export async function GET() {
  return Response.json(latestCoords);
}