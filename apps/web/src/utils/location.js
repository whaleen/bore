import ct from 'countries-and-timezones'

// Define our regions
const REGIONS = {
  'NA': 'North America',
  'SA': 'South America',
  'EU': 'Europe',
  'AF': 'Africa',
  'AS': 'Asia',
  'OC': 'Oceania'
}

// Map countries to regions
const COUNTRY_REGIONS = {
  'US': 'NA', 'CA': 'NA', 'MX': 'NA',  // North America
  'BR': 'SA', 'AR': 'SA', 'CL': 'SA',  // South America
  'GB': 'EU', 'DE': 'EU', 'FR': 'EU',  // Europe
  'ZA': 'AF', 'NG': 'AF', 'EG': 'AF',  // Africa
  'CN': 'AS', 'JP': 'AS', 'IN': 'AS',  // Asia
  'AU': 'OC', 'NZ': 'OC', 'FJ': 'OC',  // Oceania
  // Add more as needed
}

// Get all countries with their data
export function getCountriesList() {
  const countries = ct.getAllCountries()
  return Object.values(countries)
    .map(country => ({
      name: country.name,
      code: country.id,
      region: REGIONS[COUNTRY_REGIONS[country.id]] || 'Unknown'
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

// Get country data by code
export function getCountryData(countryCode) {
  const country = ct.getCountry(countryCode)
  if (!country) return null

  return {
    name: country.name,
    code: country.id,
    region: REGIONS[COUNTRY_REGIONS[country.id]] || 'Unknown'
  }
}

// Get region by country code
export function getRegion(countryCode) {
  return REGIONS[COUNTRY_REGIONS[countryCode]] || 'Unknown'
}
