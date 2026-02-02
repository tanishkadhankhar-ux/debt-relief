'use client'

import * as React from 'react'
import { Home, Package } from 'lucide-react'
import { FormLayout } from '@/components/layout/FormLayout'
import { Button, StickyButtonContainer } from '@/components/ui'
import { cn } from '@/lib/utils'
import { ROOM_SIZE_OPTIONS, type RoomSizeOption } from '@/types/movers'

interface MoversRoomSizeScreenProps {
  initialValue?: RoomSizeOption
  fromLocation?: string
  toLocation?: string
  onBack?: () => void
  onSubmit?: (rooms: RoomSizeOption) => void
}

/**
 * MoversRoomSizeScreen
 *
 * Step 2: How much space needs moving?
 * Features interactive cards with visual feedback and animations
 */
export function MoversRoomSizeScreen({
  initialValue,
  fromLocation,
  toLocation,
  onBack,
  onSubmit,
}: MoversRoomSizeScreenProps) {
  const [selectedSize, setSelectedSize] = React.useState<RoomSizeOption | undefined>(initialValue)
  const [hoveredSize, setHoveredSize] = React.useState<RoomSizeOption | null>(null)

  const handleSelect = (size: RoomSizeOption) => {
    setSelectedSize(size)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedSize) {
      onSubmit?.(selectedSize)
    }
  }

  // Generate box icons based on room size
  const getBoxCount = (size: RoomSizeOption): number => {
    switch (size) {
      case 'studio': return 1
      case '1-bedroom': return 2
      case '2-bedroom': return 3
      case '3-bedroom': return 4
      case '4-bedroom': return 5
      case '5-plus-bedroom': return 6
      default: return 1
    }
  }

  return (
    <FormLayout currentStep={2} onBack={onBack} showProgress={false}>
      <form onSubmit={handleSubmit} className="animate-slide-up space-y-8 has-sticky-button">
        {/* Headline */}
        <div className="space-y-2 text-center">
          <h1 className="font-display text-display sm:text-display-md lg:text-display-lg text-neutral-900">
            How much are you moving?
          </h1>
          <p className="text-body text-neutral-500">
            Select the size that best matches your current home
          </p>
          {fromLocation && toLocation && (
            <p className="text-body-sm text-primary-700">
              {fromLocation} → {toLocation}
            </p>
          )}
        </div>

        {/* Room Size Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {ROOM_SIZE_OPTIONS.map((option) => {
            const isSelected = selectedSize === option.value
            const isHovered = hoveredSize === option.value
            const boxCount = getBoxCount(option.value)

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                onMouseEnter={() => setHoveredSize(option.value)}
                onMouseLeave={() => setHoveredSize(null)}
                className={cn(
                  'relative p-6 rounded-xl border-2 transition-all duration-300',
                  'hover:scale-105 hover:shadow-lg',
                  'focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2',
                  isSelected
                    ? 'border-primary-700 bg-primary-300 shadow-md'
                    : 'border-neutral-200 bg-white hover:border-primary-700'
                )}
              >
                {/* Home Icon */}
                <div className="flex justify-center mb-3">
                  <Home
                    className={cn(
                      'w-8 h-8 transition-colors',
                      isSelected ? 'text-primary-700' : 'text-neutral-500'
                    )}
                  />
                </div>

                {/* Label */}
                <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                  {option.label}
                </h3>
                <p className="text-sm text-neutral-500 mb-4">{option.description}</p>

                {/* Animated Boxes */}
                <div className="flex justify-center gap-1 flex-wrap">
                  {Array.from({ length: boxCount }).map((_, index) => (
                    <Package
                      key={index}
                      className={cn(
                        'w-6 h-6 transition-all duration-300',
                        isSelected || isHovered ? 'text-primary-700 animate-bounce' : 'text-neutral-300'
                      )}
                      style={{ animationDelay: `${index * 100}ms` }}
                    />
                  ))}
                </div>

                {/* Selected Indicator */}
                {isSelected && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary-700 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Info Box */}
        <div className="bg-secondary-300 rounded-xl p-5 max-w-[410px] mx-auto">
          <p className="text-sm text-neutral-800 text-center">
            💡 <strong>Tip:</strong> Not sure about your size? Don&apos;t worry!
            Movers will provide a more accurate estimate after viewing your items.
          </p>
        </div>

        {/* Submit Button */}
        <StickyButtonContainer>
          <Button
            type="submit"
            fullWidth
            showTrailingIcon
            disabled={!selectedSize}
            className={!selectedSize ? 'opacity-50' : ''}
          >
            Continue
          </Button>
        </StickyButtonContainer>
      </form>
    </FormLayout>
  )
}

export default MoversRoomSizeScreen
