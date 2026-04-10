'use client';
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L, { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface GpsData {
  lat: number;
  lon: number;
  timestamp: number;
  speed?: number;
  sats?: number;
}

export default function HomePage() {
  const [history, setHistory] = useState<GpsData[]>([]);
  const [filter, setFilter] = useState<'10' | '30' | '60' | 'all'>('10');

  const fetchData = async () => {
    try {
      const res = await fetch('/api/gps', { cache: 'no-store' });
      const json: GpsData = await res.json();

      setHistory(prev => [...prev, json]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, []);

  const now = Date.now();

  const filtered = history.filter(d => {
    if (filter === 'all') return true;

    const ageMin = (now - d.timestamp) / 60000;
    if (filter === '10') return ageMin <= 10;
    if (filter === '30') return ageMin <= 30;
    if (filter === '60') return ageMin <= 60;
  });

  const polylinePoints = filtered.map(d => [d.lat, d.lon]);
  const latest = filtered[filtered.length - 1];

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif', background: '#f5f7fa', minHeight: '100vh' }}>
      
      <h2 style={{ textAlign: 'center' }}>📍 GPS Tracker Dashboard</h2>

      {/* FILTER BUTTON */}
      <div style={{ textAlign: 'center', marginBottom: 10 }}>
        {['10', '30', '60', 'all'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            style={{
              margin: 5,
              padding: '8px 14px',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              background: filter === f ? '#007bff' : '#ddd',
              color: filter === f ? '#fff' : '#333'
            }}
          >
            {f === 'all' ? 'All Time' : `${f} menit`}
          </button>
        ))}
      </div>

      {/* INFO PANEL */}
      {latest && (
        <div style={{
          background: '#fff',
          color: '#333',
          padding: 15,
          borderRadius: 10,
          marginBottom: 15,
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          width: '70%',
          marginInline: 'auto'
        }}>
          <b>📡 Data Terakhir</b><br />
          Lat: {latest.lat}<br />
          Lon: {latest.lon}<br />
          {/* Speed: {latest.speed || 0} km/h<br /> */}
          {/* Satelit: {latest.sats || 0}<br /> */}
          Waktu: {new Date(latest.timestamp).toLocaleTimeString()}
        </div>
      )}

      {/* MAP */}
      <MapContainer
        center={latest ? [latest.lat, latest.lon] : [0, 0]}
        zoom={15}
        style={{
          height: '450px',
          width: '70%',
          margin: 'auto',
          borderRadius: 12,
          overflow: 'hidden'
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {filtered.map((point, idx) => (
          <Marker key={idx} position={[point.lat, point.lon]}>
            <Popup>
               {new Date(point.timestamp).toLocaleTimeString()}<br />
               {point.lat}, {point.lon}
            </Popup>
          </Marker>
        ))}

        {polylinePoints.length > 1 && (
          <Polyline positions={polylinePoints as LatLngTuple[]} color="red" />
        )}
      </MapContainer>
    </div>
  );
}