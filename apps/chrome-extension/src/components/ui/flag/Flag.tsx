// packages/ui/src/components/flag/Flag.tsx
import * as countryFlags from 'country-flag-icons/react/3x2'

interface FlagProps {
  countryCode: string
  size?: number
  className?: string
  alt?: string
}

export const Flag: React.FC<FlagProps> = ({
  countryCode,
  size = 24,
  className = '',
  alt = 'Country flag'
}) => {
  // Convert country code to uppercase since that's what the library expects
  const code = countryCode.toUpperCase()

  // Get the flag component dynamically
  const FlagComponent = countryFlags[code as keyof typeof countryFlags]

  if (!FlagComponent) {
    console.warn(`No flag found for country code: ${code}`)
    return null
  }

  return (
    <div
      style={{ width: size, height: 'auto' }}
      className={`inline-block ${className}`}
      title={alt}
    >
      <FlagComponent />
    </div>
  )
}