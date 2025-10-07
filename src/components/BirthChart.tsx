'use client';

import React from 'react';

interface PlanetaryPosition {
  house: number;
  sign: string;
}

interface BirthChartProps {
  planetaryPositions?: Record<string, PlanetaryPosition | string> | null;
}

const BirthChart: React.FC<BirthChartProps> = ({ planetaryPositions }) => {
  // Ensure planetaryPositions is a valid object
  const safePlanetaryPositions = planetaryPositions || {};

  // Convert planetary positions to house-based format
  const getPlanetsInHouse = (houseNumber: number) => {
    const planets: string[] = [];
    Object.entries(safePlanetaryPositions).forEach(([planet, position]) => {
      const house = typeof position === 'object' && position && 'house' in position ? (position as PlanetaryPosition).house : null;
      if (house === houseNumber) {
        planets.push(planet);
      }
    });
    return planets;
  };

  // Get planet symbol
  const getPlanetSymbol = (planet: string) => {
    const symbols: Record<string, string> = {
      sun: '☉',
      moon: '☽',
      mars: '♂',
      mercury: '☿',
      jupiter: '♃',
      venus: '♀',
      saturn: '♄',
      rahu: '☊',
      ketu: '☋'
    };
    return symbols[planet.toLowerCase()] || planet.toUpperCase();
  };

  // House labels for Vedic astrology
  const houseLabels = [
    '1st House\n(Ascendant)',
    '2nd House\n(Wealth)',
    '3rd House\n(Siblings)',
    '4th House\n(Home)',
    '5th House\n(Children)',
    '6th House\n(Enemies)',
    '7th House\n(Marriage)',
    '8th House\n(Longevity)',
    '9th House\n(Fortune)',
    '10th House\n(Career)',
    '11th House\n(Gains)',
    '12th House\n(Expenses)'
  ];

  // Zodiac signs for house cusps (simplified - in reality this would be calculated)
  const getSignForHouse = (houseNumber: number) => {
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                   'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    // This is a simplified calculation - real birth chart would calculate exact positions
    return signs[(houseNumber - 1) % 12];
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative bg-gradient-to-br from-indigo-50 to-purple-50 border-4 border-indigo-200 rounded-2xl p-8 shadow-xl">
        {/* Center circle for inner houses */}
        <div className="relative w-64 h-64 mx-auto">
          {/* Outer houses (1-12) */}
          <div className="absolute inset-0">
            {/* Create 12 triangular sections for houses */}
            {Array.from({ length: 12 }, (_, i) => {
              const angle = (i * 30) - 90; // Start from top
              const planets = getPlanetsInHouse(i + 1);

              return (
                <div
                  key={i}
                  className="absolute w-full h-full flex items-center justify-center"
                  style={{
                    transform: `rotate(${angle}deg)`,
                    clipPath: 'polygon(50% 50%, 100% 0%, 100% 100%)',
                  }}
                >
                  <div
                    className="absolute bg-white border border-gray-300 shadow-sm"
                    style={{
                      width: '120px',
                      height: '120px',
                      transform: `rotate(${-angle}deg) translateY(-60px)`,
                      top: '50%',
                      left: '50%',
                      marginLeft: '-60px',
                      marginTop: '-110px',
                    }}
                  >
                    <div className="p-2 h-full flex flex-col">
                      <div className="text-xs font-bold text-indigo-800 text-center mb-1">
                        House {i + 1}
                      </div>
                      <div className="text-xs text-gray-600 text-center mb-2">
                        {getSignForHouse(i + 1)}
                      </div>
                      <div className="flex-1 flex flex-wrap gap-1 justify-center items-center">
                        {planets.map(planet => (
                          <div
                            key={planet}
                            className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm"
                            title={`${planet.charAt(0).toUpperCase() + planet.slice(1)} in House ${i + 1}`}
                          >
                            {getPlanetSymbol(planet)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Inner circle for Lagna and other indicators */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-red-100 border-4 border-orange-300 rounded-full flex items-center justify-center shadow-lg">
              <div className="text-center">
                <div className="text-sm font-bold text-orange-800 mb-1">Lagna</div>
                <div className="text-lg font-bold text-orange-600">
                  {Object.entries(safePlanetaryPositions).find(([planet, position]) =>
                    typeof position === 'object' && position && 'house' in position && (position as PlanetaryPosition).house === 1
                  )?.[1] ? '🌅' : '⭐'}
                </div>
                <div className="text-xs text-orange-700 mt-1">
                  Ascendant
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full"></div>
            <span>Planet Position</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-br from-orange-100 to-red-100 border-2 border-orange-300 rounded-full"></div>
            <span>Lagna (Ascendant)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
            <span>House</span>
          </div>
        </div>

        {/* Planet Legend */}
        <div className="mt-6">
          <h4 className="font-semibold text-gray-800 mb-3 text-center">Planetary Symbols</h4>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3 text-center">
            {Object.keys(safePlanetaryPositions).map(planet => (
              <div key={planet} className="flex flex-col items-center">
                <div className="text-2xl mb-1">{getPlanetSymbol(planet)}</div>
                <div className="text-xs text-gray-600 capitalize">{planet}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BirthChart;
