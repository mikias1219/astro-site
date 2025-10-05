'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface ZodiacSign {
  name: string;
  dates: string;
  symbol: string;
}

const zodiacSigns: ZodiacSign[] = [
  { name: 'Aries', dates: '21 Mar - 20 Apr', symbol: '♈' },
  { name: 'Taurus', dates: '21 Apr - 21 May', symbol: '♉' },
  { name: 'Gemini', dates: '22 May - 21 Jun', symbol: '♊' },
  { name: 'Cancer', dates: '22 Jun - 22 Jul', symbol: '♋' },
  { name: 'Leo', dates: '23 Jul - 23 Aug', symbol: '♌' },
  { name: 'Virgo', dates: '24 Aug - 22 Sep', symbol: '♍' },
  { name: 'Libra', dates: '23 Sep - 23 Oct', symbol: '♎' },
  { name: 'Scorpio', dates: '24 Oct - 22 Nov', symbol: '♏' },
  { name: 'Sagittarius', dates: '23 Nov - 21 Dec', symbol: '♐' },
  { name: 'Capricorn', dates: '22 Dec - 20 Jan', symbol: '♑' },
  { name: 'Aquarius', dates: '21 Jan - 18 Feb', symbol: '♒' },
  { name: 'Pisces', dates: '19 Feb - 20 Mar', symbol: '♓' }
];

export function HoroscopePreview() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Check Your Daily Horoscope
          </h2>
          <p className="text-xl text-gray-600">
            Select your zodiac sign for today's predictions
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {zodiacSigns.map((zodiac) => (
            <Link
              key={zodiac.name}
              href={`/horoscope?sign=${zodiac.name.toLowerCase()}`}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 text-center hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <div className="text-3xl mb-2">{zodiac.symbol}</div>
              <h3 className="font-bold text-gray-800 text-sm">{zodiac.name}</h3>
              <p className="text-xs text-gray-600">{zodiac.dates}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
