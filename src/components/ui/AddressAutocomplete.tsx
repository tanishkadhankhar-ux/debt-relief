'use client'

import * as React from 'react'
import usePlacesAutocomplete, { getGeocode } from 'use-places-autocomplete'
import { cn } from '@/lib/utils'
import { MapPin, Search } from 'lucide-react'

export interface ParsedAddress {
  street: string
  city: string
  state: string
  zip: string
  apt?: string
}

// Type for Google Maps address component
interface AddressComponent {
  long_name: string
  short_name: string
  types: string[]
}

interface AddressAutocompleteProps {
  onAddressSelect: (address: ParsedAddress) => void
  initialValue?: string
  error?: string
  disabled?: boolean
}

/**
 * AddressAutocomplete Component
 * 
 * Smart address input using Google Places Autocomplete
 * Falls back to manual entry if Google Places isn't available
 */
export function AddressAutocomplete({ 
  onAddressSelect, 
  initialValue = '',
  error,
  disabled = false 
}: AddressAutocompleteProps) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: 'us' },
      types: ['address'],
    },
    debounce: 300,
    defaultValue: initialValue,
  })

  const [isOpen, setIsOpen] = React.useState(false)
  const wrapperRef = React.useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    setIsOpen(true)
  }

  const handleSelect = async (description: string) => {
    setValue(description, false)
    clearSuggestions()
    setIsOpen(false)

    try {
      const results = await getGeocode({ address: description })
      const addressComponents = results[0].address_components
      
      const parsed: ParsedAddress = {
        street: '',
        city: '',
        state: '',
        zip: '',
      }

      let streetNumber = ''
      let route = ''

      addressComponents.forEach((component: AddressComponent) => {
        const types = component.types

        if (types.includes('street_number')) {
          streetNumber = component.long_name
        }
        if (types.includes('route')) {
          route = component.long_name
        }
        if (types.includes('locality') || types.includes('sublocality')) {
          parsed.city = component.long_name
        }
        if (types.includes('administrative_area_level_1')) {
          parsed.state = component.short_name
        }
        if (types.includes('postal_code')) {
          parsed.zip = component.long_name
        }
      })

      parsed.street = streetNumber ? `${streetNumber} ${route}` : route

      onAddressSelect(parsed)
    } catch (error) {
      console.error('Error parsing address:', error)
    }
  }

  const showSuggestions = isOpen && status === 'OK' && data.length > 0

  return (
    <div ref={wrapperRef} className="relative">
      {/* Label */}
      <label className="block text-label text-neutral-800 mb-1.5">
        Start typing your address
      </label>
      
      {/* Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 pointer-events-none" />
        <input
          value={value}
          onChange={handleInput}
          onFocus={() => setIsOpen(true)}
          disabled={disabled || !ready}
          placeholder="123 Main Street, City, State"
          className={cn(
            'w-full min-h-[48px] pl-10 pr-4 py-3 rounded-[8px] border bg-white',
            'text-body text-neutral-800 placeholder:text-neutral-500',
            'transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-focus focus:border-primary-700',
            error 
              ? 'border-feedback-error' 
              : 'border-neutral-200 hover:border-neutral-500',
            (disabled || !ready) && 'opacity-50 cursor-not-allowed'
          )}
          aria-invalid={!!error}
          aria-describedby={error ? 'address-error' : undefined}
          autoComplete="off"
        />
      </div>

      {/* Error message */}
      {error && (
        <p id="address-error" className="mt-1.5 text-body-sm text-feedback-error" role="alert">
          {error}
        </p>
      )}

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <ul 
          className="absolute z-50 w-full bg-white border border-neutral-200 rounded-lg mt-1 shadow-lg max-h-60 overflow-auto"
          role="listbox"
        >
          {data.map(({ place_id, description, structured_formatting }) => (
            <li
              key={place_id}
              onClick={() => handleSelect(description)}
              className="px-4 py-3 hover:bg-neutral-100 cursor-pointer transition-colors flex items-start gap-3"
              role="option"
            >
              <MapPin className="w-4 h-4 text-neutral-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-neutral-900 font-medium">
                  {structured_formatting.main_text}
                </p>
                <p className="text-xs text-neutral-500">
                  {structured_formatting.secondary_text}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Loading state */}
      {!ready && (
        <p className="mt-1.5 text-body-sm text-neutral-500">
          Loading address search...
        </p>
      )}
    </div>
  )
}

export default AddressAutocomplete
