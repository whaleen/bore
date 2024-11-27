import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import Flags from 'country-flag-icons/react/3x2'

function CountrySelect({ value, onChange, countries }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState(
    countries.find((c) => c.code === value) || null
  )
  const containerRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (country) => {
    setSelectedCountry(country)
    onChange(country.code)
    setIsOpen(false)
  }

  const getFlag = (countryCode) => {
    const Flag = Flags[countryCode]
    return Flag ? <Flag className='w-5 h-5' /> : null
  }

  return (
    <div
      className='relative'
      ref={containerRef}
    >
      <button
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        className='w-full md:w-64 px-4 py-2 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none flex items-center justify-between'
      >
        <div className='flex items-center'>
          {selectedCountry ? (
            <>
              <span className='mr-2'>{getFlag(selectedCountry.code)}</span>
              <span>{selectedCountry.name}</span>
            </>
          ) : (
            'All Countries'
          )}
        </div>
        <ChevronDown
          className={`ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className='absolute z-50 mt-1 w-full bg-gray-800 rounded-lg shadow-lg max-h-60 overflow-y-auto'>
          <div className='p-1'>
            <button
              className='w-full px-4 py-2 text-left hover:bg-gray-700 rounded flex items-center'
              onClick={() => handleSelect({ code: '', name: 'All Countries' })}
            >
              All Countries
            </button>
            {countries.map((country) => (
              <button
                key={country.code}
                className='w-full px-4 py-2 text-left hover:bg-gray-700 rounded flex items-center'
                onClick={() => handleSelect(country)}
              >
                <span className='mr-2'>{getFlag(country.code)}</span>
                <span>{country.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CountrySelect
