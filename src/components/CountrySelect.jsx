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
        className='btn w-full md:w-64 btn-outline flex justify-between items-center'
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
        <ul className='menu menu-compact absolute z-50 mt-1 w-full bg-base-200 rounded-lg shadow-lg max-h-60 overflow-y-auto'>
          <li>
            <button
              className='w-full flex items-center'
              onClick={() => handleSelect({ code: '', name: 'All Countries' })}
            >
              All Countries
            </button>
          </li>
          {countries.map((country) => (
            <li key={country.code}>
              <button
                className='w-full flex items-center'
                onClick={() => handleSelect(country)}
              >
                <span className='mr-2'>{getFlag(country.code)}</span>
                <span>{country.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CountrySelect
