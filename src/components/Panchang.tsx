'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '../lib/api';

interface PanchangData {
  id: number;
  date: string;
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  tithi: string;
  tithi_end_time: string;
  nakshatra: string;
  nakshatra_end_time: string;
  yoga: string;
  yoga_end_time: string;
  karan: string;
  karan_end_time: string;
  amanta_month: string;
  purnimanta_month: string;
  vikram_samvat: string;
  shaka_samvat: string;
}

export function Panchang() {
  const [panchang, setPanchang] = useState<PanchangData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPanchang();
  }, []);

  const fetchPanchang = async () => {
    try {
      const result = await apiClient.getPanchang();
      if (result.success && result.data) {
        setPanchang(result.data);
      } else {
        setError('Failed to fetch panchang data');
      }
    } catch (error) {
      setError('Failed to fetch panchang data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-red-600 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Aaj Ka Panchang</h3>
        <p className="text-gray-600">New Delhi, India</p>
        <p className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-IN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-orange-600 font-semibold">Sunrise</div>
          <div className="text-gray-800">{panchang?.sunrise || '06:30'}</div>
        </div>
        <div className="text-center">
          <div className="text-orange-600 font-semibold">Sunset</div>
          <div className="text-gray-800">{panchang?.sunset || '18:30'}</div>
        </div>
        <div className="text-center">
          <div className="text-orange-600 font-semibold">Moonrise</div>
          <div className="text-gray-800">{panchang?.moonrise || '20:15'}</div>
        </div>
        <div className="text-center">
          <div className="text-orange-600 font-semibold">Moonset</div>
          <div className="text-gray-800">{panchang?.moonset || '08:45'}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Month</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Amanta:</span>
              <span className="font-medium">{panchang?.amanta_month || 'Kartik'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Purnimanta:</span>
              <span className="font-medium">{panchang?.purnimanta_month || 'Kartik'}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Samvat</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Vikram:</span>
              <span className="font-medium">{panchang?.vikram_samvat || '2081'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shaka:</span>
              <span className="font-medium">{panchang?.shaka_samvat || '1946'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Tithi</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Current:</span>
              <span className="font-medium">{panchang?.tithi || 'Shukla Paksha, Dwitiya'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Till:</span>
              <span className="font-medium">{panchang?.tithi_end_time || '14:30'}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Nakshatra</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Current:</span>
              <span className="font-medium">{panchang?.nakshatra || 'Rohini'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Till:</span>
              <span className="font-medium">{panchang?.nakshatra_end_time || '16:45'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Yog</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Current:</span>
              <span className="font-medium">{panchang?.yoga || 'Siddhi'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Till:</span>
              <span className="font-medium">{panchang?.yoga_end_time || '12:20'}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Karan</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Current:</span>
              <span className="font-medium">{panchang?.karan || 'Bava'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Till:</span>
              <span className="font-medium">{panchang?.karan_end_time || '10:15'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <a
          href="/panchang"
          className="text-orange-600 hover:text-orange-700 font-medium"
        >
          Detailed Panchang →
        </a>
      </div>
    </div>
  );
}
