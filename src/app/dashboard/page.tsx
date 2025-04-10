'use client';

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Reading {
  _id: string;
  api_key: string;
  sensor_zone: string;
  sensor_type: 'IN' | 'OUT';
  sensor_name: string;
  sensor_current: number;
  timestamp: string;
}

export default function Dashboard() {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [zoneFilter, setZoneFilter] = useState('');

  useEffect(() => {
    const fetchReadings = async () => {
      const res = await fetch('/api/readings');
      const data = await res.json();
      setReadings(data.readings);
    };

    fetchReadings();
    const interval = setInterval(fetchReadings, 5000);
    return () => clearInterval(interval);
  }, []);

  const groupedData = readings.reduce((acc: any, reading) => {
    const zone = reading.sensor_zone;
    const type = reading.sensor_type;

    if (!acc[zone]) {
      acc[zone] = { IN: [], OUT: [] };
    }

    acc[zone][type].push({
      ...reading,
      timestamp: new Date(reading.timestamp).toLocaleTimeString(),
    });

    return acc;
  }, {});

  return (
    <div className='p-6 min-h-screen bg-[#0f172a] text-white'>
      <h1 className='text-3xl font-bold mb-4 text-center'>
        ⚡️ Sensor Dashboard
      </h1>
      <input
        type='text'
        placeholder='Search zone...'
        className='mb-6 p-2 rounded-md bg-[#1e293b] text-white w-full'
        value={zoneFilter}
        onChange={(e) => setZoneFilter(e.target.value)}
      />

      <div className='grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {Object.entries(groupedData)
          .filter(([zone]) =>
            zone.toLowerCase().includes(zoneFilter.toLowerCase())
          )
          .map(([zone, types]: any) => (
            <div
              key={zone}
              className='bg-[#1e293b] rounded-2xl p-5 shadow-md border border-gray-700'
            >
              <h2 className='text-xl font-semibold text-blue-400 mb-4'>
                📍 {zone}
              </h2>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {['IN', 'OUT'].map((type) => (
                  <div key={type}>
                    <div className='flex justify-between items-center mb-2'>
                      <h3
                        className={`font-semibold ${
                          type === 'IN' ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {type === 'IN' ? '🔵 IN' : '🔴 OUT'}
                      </h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          type === 'IN'
                            ? 'bg-green-900 text-green-300'
                            : 'bg-red-900 text-red-300'
                        }`}
                      >
                        {types[type].length} readings
                      </span>
                    </div>

                    <ResponsiveContainer width='100%' height={140}>
                      <LineChart data={types[type].slice(-10)}>
                        <XAxis
                          dataKey='timestamp'
                          stroke='#8884d8'
                          angle={-35}
                          textAnchor='end'
                          height={40}
                          tick={{ fontSize: 10 }}
                        />
                        <YAxis
                          stroke='#8884d8'
                          width={40}
                          tick={{ fontSize: 12 }}
                          domain={['auto', 'auto']}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1e293b',
                            borderColor: '#64748b',
                          }}
                          labelStyle={{ color: '#94a3b8' }}
                          formatter={(value: any) => [`${value} A`, 'Current']}
                        />
                        <defs>
                          <linearGradient
                            id={`${zone}-${type}-gradient`}
                            x1='0'
                            y1='0'
                            x2='0'
                            y2='1'
                          >
                            <stop
                              offset='0%'
                              stopColor={type === 'IN' ? '#22c55e' : '#ef4444'}
                              stopOpacity={0.4}
                            />
                            <stop
                              offset='100%'
                              stopColor='#1e293b'
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <Line
                          type='monotone'
                          dataKey='sensor_current'
                          stroke={`url(#${zone}-${type}-gradient)`}
                          strokeWidth={3}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>

                    <div className='space-y-2 mt-3'>
                      {types[type]
                        .slice(-5)
                        .reverse()
                        .map((r: Reading) => (
                          <div
                            key={r._id}
                            className='bg-[#334155] hover:bg-[#475569] rounded-lg px-3 py-2 transition'
                          >
                            <div className='text-sm font-medium'>
                              {r.sensor_name}
                            </div>
                            <div className='text-xs text-gray-400'>
                              {r.timestamp}
                            </div>
                            <div
                              className={`text-lg font-bold ${
                                r.sensor_current > 10
                                  ? 'text-red-500'
                                  : 'text-white'
                              }`}
                            >
                              {r.sensor_current} A
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
