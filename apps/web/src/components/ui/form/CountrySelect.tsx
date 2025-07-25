// packages/ui/src/components/form/CountrySelect.tsx
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import type { CountrySelectProps } from './types';

export const CountrySelect = ({
  value,
  onChange,
  countries,
  className = ''
}: CountrySelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(
    countries.find((c) => c.code === value) || null
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (country: { code: string; name: string }) => {
    setSelectedCountry(country);
    onChange(country.code);
    setIsOpen(false);
  };

  return (
    <div
      className={`relative ${className}`}
      ref={containerRef}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="btn w-full md:w-64 btn-outline flex justify-between items-center"
      >
        <div className="flex items-center">
          {selectedCountry ? (
            <span>{selectedCountry.name}</span>
          ) : (
            'All Countries'
          )}
        </div>
        <ChevronDown
          className={`ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <ul className="menu menu-compact absolute z-50 mt-1 w-full bg-base-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {countries.map((country) => (
            <li key={country.code}>
              <button
                className="w-full flex items-center"
                onClick={() => handleSelect(country)}
              >
                <span>{country.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export type { CountrySelectProps };
