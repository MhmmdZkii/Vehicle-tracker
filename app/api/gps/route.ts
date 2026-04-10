import mqtt from 'mqtt';

let latestCoords = { lat: 0, lon: 0, speed: 0, sats: 0, timestamp: Date.now() };


const brokerUrl = 'mqtt://187.77.112.149:1883';

const client = mqtt.connect(brokerUrl, {
  clientId: 'NextJS-' + Math.random().toString(16).slice(2),
});

client.on('connect', () => {
  console.log('MQTT connected');
  

  client.subscribe('ZkiiDev/gps/tracker');
});

client.on('message', (topic, message) => {
  try {
    const data = JSON.parse(message.toString());

    latestCoords = {
      lat: data.lat || 0,
      lon: data.lon || 0,
      speed: data.speed || 0,
      sats: data.sats || 0,
      timestamp: Date.now(),
    };

    console.log(' Data masuk:', latestCoords);

  } catch (err) {
    console.error(' Parse error:', err);
  }
});

export async function GET() {
  return Response.json(latestCoords);
}