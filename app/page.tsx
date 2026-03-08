'use client'; // hooks useState/useEffect

import { useState, useEffect } from 'react';

interface GpsData {
  lat: number;
  lon: number;
  timestamp: number;
}

export default function HomePage() {
  const [data, setData] = useState<GpsData | null>(null);
  const [isLoading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/gps', { cache: 'no-store' }); // Ambil data terbaru
      if (!res.ok) throw new Error('Gagal mengambil data GPS');
      const json: GpsData = await res.json();
      setData(json);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // get interval on sec
    const intervalId = setInterval(fetchData, 4000); 

    return () => clearInterval(intervalId); 
  }, []);

  if (isLoading) return <p>Memuat lokasi...</p>;
  if (!data) return <p>Tidak ada data GPS yang tersedia.</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Status Pelacakan GPS</h1>
      <p>Data terakhir diterima pada: {new Date(data.timestamp).toLocaleTimeString()}</p>
      
      <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
        <strong>Latitude:</strong> {data.lat} <br />
        <strong>Longitude:</strong> {data.lon}
      </div>

    
     <a 
        href={`https://maps.google.com/?q=${data.lat},${data.lon}`} 
        target="_blank" 
        rel="noopener noreferrer"
      >
        Lihat di Google Maps
      </a>
    </div>
  );
}
