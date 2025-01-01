// apps/web/src/utils/location.ts
import ct from 'countries-and-timezones'

// Define our regions
const REGIONS = {
  NA: 'North America',
  SA: 'South America',
  EU: 'Europe',
  AF: 'Africa',
  AS: 'Asia',
  OC: 'Oceania',
} as const

// Map countries to regions
const COUNTRY_REGIONS: Record<string, keyof typeof REGIONS> = {
  US: 'NA',
  CA: 'NA',
  MX: 'NA', // North America
  BR: 'SA',
  AR: 'SA',
  CL: 'SA', // South America
  GB: 'EU',
  DE: 'EU',
  FR: 'EU', // Europe
  ZA: 'AF',
  NG: 'AF',
  EG: 'AF', // Africa
  CN: 'AS',
  JP: 'AS',
  IN: 'AS', // Asia
  AU: 'OC',
  NZ: 'OC',
  FJ: 'OC', // Oceania
}

export interface CountryData {
  name: string
  code: string
  region: string
}

// Get all countries with their data
export function getCountriesList(): CountryData[] {
  const countries = ct.getAllCountries()
  return Object.values(countries)
    .map((country) => ({
      name: country.name,
      code: country.id,
      region: REGIONS[COUNTRY_REGIONS[country.id]] || 'Unknown',
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

// Get country data by code
export function getCountryData(countryCode: string): CountryData | null {
  const country = ct.getCountry(countryCode)
  if (!country) return null

  return {
    name: country.name,
    code: country.id,
    region: REGIONS[COUNTRY_REGIONS[country.id]] || 'Unknown',
  }
}

// Get region by country code
export function getRegion(countryCode: string): string {
  return REGIONS[COUNTRY_REGIONS[countryCode]] || 'Unknown'
}
