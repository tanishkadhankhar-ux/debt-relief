'use client'

import * as React from 'react'
import { MapPin, MoveRight, Truck } from 'lucide-react'
import { FormLayout } from '@/components/layout/FormLayout'
import { Button, StickyButtonContainer } from '@/components/ui'
import { cn } from '@/lib/utils'
import { POPULAR_CITIES } from '@/types/movers'

interface MoversLocationScreenProps {
  initialFrom?: string
  initialTo?: string
  onBack?: () => void
  onSubmit?: (data: { from: string; to: string }) => void
}

/**
 * MoversLocationScreen
 *
 * Step 1: Where are you moving FROM and TO?
 * Features animated truck that moves between selected cities
 */
export function MoversLocationScreen({
  initialFrom = '',
  initialTo = '',
  onBack,
  onSubmit,
}: MoversLocationScreenProps) {
  const [fromLocation, setFromLocation] = React.useState(initialFrom)
  const [toLocation, setToLocation] = React.useState(initialTo)
  const [fromSuggestions, setFromSuggestions] = React.useState<string[]>([])
  const [toSuggestions, setToSuggestions] = React.useState<string[]>([])
  const [showFromSuggestions, setShowFromSuggestions] = React.useState(false)
  const [showToSuggestions, setShowToSuggestions] = React.useState(false)
  const [errors, setErrors] = React.useState<{ from?: string; to?: string }>({})
  const [truckAnimation, setTruckAnimation] = React.useState(false)

  const fromInputRef = React.useRef<HTMLInputElement>(null)
  const toInputRef = React.useRef<HTMLInputElement>(null)

  // Filter suggestions
  const filterSuggestions = (value: string): string[] => {
    if (!value.trim()) return POPULAR_CITIES.slice(0, 5)
    return POPULAR_CITIES.filter(city =>
      city.toLowerCase().includes(value.toLowerCase())
    ).slice(0, 5)
  }

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFromLocation(value)
    setFromSuggestions(filterSuggestions(value))
    setShowFromSuggestions(true)
    setErrors({ ...errors, from: undefined })
  }

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setToLocation(value)
    setToSuggestions(filterSuggestions(value))
    setShowToSuggestions(true)
    setErrors({ ...errors, to: undefined })
  }

  const selectFromCity = (city: string) => {
    setFromLocation(city)
    setShowFromSuggestions(false)
    setTruckAnimation(true)
    setTimeout(() => setTruckAnimation(false), 600)
  }

  const selectToCity = (city: string) => {
    setToLocation(city)
    setShowToSuggestions(false)
    setTruckAnimation(true)
    setTimeout(() => setTruckAnimation(false), 600)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: { from?: string; to?: string } = {}

    if (!fromLocation.trim()) {
      newErrors.from = 'Please enter your current location'
    }
    if (!toLocation.trim()) {
      newErrors.to = 'Please enter your destination'
    }
    if (fromLocation.trim() === toLocation.trim()) {
      newErrors.to = 'Destination must be different from current location'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit?.({ from: fromLocation, to: toLocation })
  }

  return (
    <FormLayout currentStep={1} onBack={onBack} showProgress={false}>
      <form onSubmit={handleSubmit} className="animate-slide-up space-y-8 has-sticky-button">
        {/* Headline */}
        <div className="space-y-2 text-center">
          <h1 className="font-display text-display sm:text-display-md lg:text-display-lg text-neutral-900">
            Where are you moving?
          </h1>
          <p className="text-body text-neutral-500">
            Get instant quotes from top-rated movers in your area
          </p>
        </div>

        {/* Animated Truck Visual */}
        <div className="relative h-24 flex items-center justify-center">
          <div className="absolute inset-x-0 top-1/2 h-0.5 bg-neutral-200" />
          <div className={cn(
            'relative transition-all duration-500',
            truckAnimation && 'animate-bounce'
          )}>
            <Truck className="w-12 h-12 text-primary-700" />
          </div>
        </div>

        {/* Location Inputs */}
        <div className="space-y-4 max-w-[410px] mx-auto">
          {/* From Location */}
          <div className="relative">
            <label className="block text-body-sm font-medium text-neutral-800 mb-2">
              Moving from
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 pointer-events-none" />
              <input
                ref={fromInputRef}
                type="text"
                value={fromLocation}
                onChange={handleFromChange}
                onFocus={() => {
                  setShowFromSuggestions(true)
                  setFromSuggestions(filterSuggestions(fromLocation))
                }}
                onBlur={() => setTimeout(() => setShowFromSuggestions(false), 200)}
                placeholder="Current city"
                className={cn(
                  'w-full min-h-[48px] pl-10 pr-4 py-3 rounded-[8px] border bg-white',
                  'text-body text-neutral-800 placeholder:text-neutral-500',
                  'focus:outline-none focus:ring-2 focus:ring-focus focus:border-primary-700',
                  errors.from ? 'border-feedback-error' : 'border-neutral-200'
                )}
              />
            </div>
            {errors.from && (
              <p className="mt-2 text-body-sm text-feedback-error">{errors.from}</p>
            )}

            {/* From Suggestions Dropdown */}
            {showFromSuggestions && fromSuggestions.length > 0 && (
              <ul className="absolute z-50 w-full bg-white border border-neutral-200 rounded-lg mt-1 shadow-lg max-h-60 overflow-auto">
                {fromSuggestions.map((city, index) => (
                  <li
                    key={index}
                    onClick={() => selectFromCity(city)}
                    className="px-4 py-3 hover:bg-neutral-100 cursor-pointer transition-colors flex items-center gap-3"
                  >
                    <MapPin className="w-4 h-4 text-neutral-500" />
                    <span className="text-sm text-neutral-900">{city}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Arrow Divider */}
          <div className="flex justify-center">
            <MoveRight className="w-6 h-6 text-neutral-400" />
          </div>

          {/* To Location */}
          <div className="relative">
            <label className="block text-body-sm font-medium text-neutral-800 mb-2">
              Moving to
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-700 pointer-events-none" />
              <input
                ref={toInputRef}
                type="text"
                value={toLocation}
                onChange={handleToChange}
                onFocus={() => {
                  setShowToSuggestions(true)
                  setToSuggestions(filterSuggestions(toLocation))
                }}
                onBlur={() => setTimeout(() => setShowToSuggestions(false), 200)}
                placeholder="Destination city"
                className={cn(
                  'w-full min-h-[48px] pl-10 pr-4 py-3 rounded-[8px] border bg-white',
                  'text-body text-neutral-800 placeholder:text-neutral-500',
                  'focus:outline-none focus:ring-2 focus:ring-focus focus:border-primary-700',
                  errors.to ? 'border-feedback-error' : 'border-neutral-200'
                )}
              />
            </div>
            {errors.to && (
              <p className="mt-2 text-body-sm text-feedback-error">{errors.to}</p>
            )}

            {/* To Suggestions Dropdown */}
            {showToSuggestions && toSuggestions.length > 0 && (
              <ul className="absolute z-50 w-full bg-white border border-neutral-200 rounded-lg mt-1 shadow-lg max-h-60 overflow-auto">
                {toSuggestions.map((city, index) => (
                  <li
                    key={index}
                    onClick={() => selectToCity(city)}
                    className="px-4 py-3 hover:bg-neutral-100 cursor-pointer transition-colors flex items-center gap-3"
                  >
                    <MapPin className="w-4 h-4 text-primary-700" />
                    <span className="text-sm text-neutral-900">{city}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Social Proof Stats */}
        <div className="bg-primary-300 rounded-xl p-5 max-w-[410px] mx-auto">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary-700">50K+</p>
              <p className="text-xs text-neutral-600">Moves completed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-700">4.8★</p>
              <p className="text-xs text-neutral-600">Average rating</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-700">$400</p>
              <p className="text-xs text-neutral-600">Avg. savings</p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <StickyButtonContainer>
          <Button type="submit" fullWidth showTrailingIcon>
            Get Free Quotes
          </Button>
        </StickyButtonContainer>
      </form>
    </FormLayout>
  )
}

export default MoversLocationScreen
