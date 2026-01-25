'use client'

import * as React from 'react'
import { FormLayout } from '@/components/layout/FormLayout'
import { Button } from '@/components/ui/Button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/Select'
import { USMap } from '@/components/ui/USMap'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { US_STATES } from '@/types/funnel'
import { 
  getStateStats, 
  stateAbbreviationToName, 
  stateNameToAbbreviation,
  defaultStats 
} from '@/data/stateStats'

interface LocationScreenProps {
  initialValue?: string
  onBack?: () => void
  onSubmit?: (state: string) => void
}

/**
 * LocationScreen
 * 
 * Step 1 of the funnel - "See How Much You Could Save with Debt Relief"
 * Shows a state dropdown with interactive US map visualization and stats
 */
// Default state to show pin on initial load
const DEFAULT_STATE = 'KS' // Kansas - central US state

export function LocationScreen({ 
  initialValue = '', 
  onBack, 
  onSubmit 
}: LocationScreenProps) {
  // Selected state abbreviation (e.g., "CA") - used by dropdown
  // Default to Kansas if no initial value provided, so pin is visible on load
  const [selectedStateAbbr, setSelectedStateAbbr] = React.useState(initialValue || DEFAULT_STATE)
  // Hovered state full name (e.g., "California") - used by map
  const [hoveredState, setHoveredState] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  
  // Convert selected abbreviation to full name for map
  const selectedStateName = selectedStateAbbr 
    ? stateAbbreviationToName[selectedStateAbbr] ?? null 
    : null
  
  // Stats ONLY update on click, not hover
  const stats = selectedStateName ? getStateStats(selectedStateName) : defaultStats
  
  // Handle map state selection (receives full name)
  const handleMapStateSelect = (stateName: string) => {
    const abbreviation = stateNameToAbbreviation[stateName]
    if (abbreviation) {
      setSelectedStateAbbr(abbreviation)
      setError(null)
    }
  }
  
  // Handle dropdown change (receives abbreviation)
  const handleDropdownChange = (abbreviation: string) => {
    setSelectedStateAbbr(abbreviation)
    setError(null)
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedStateAbbr) {
      setError('Please select your state')
      return
    }
    setError(null)
    onSubmit?.(selectedStateAbbr)
  }
  
  return (
    <FormLayout 
      currentStep={1} 
      onBack={onBack}
      showProgress={false}
    >
      <form onSubmit={handleSubmit} className="animate-slide-up space-y-6">
        {/* Headline */}
        <div className="space-y-2 text-center">
          <h1 className="font-display text-display sm:text-display-md lg:text-display-lg text-neutral-900 text-center">
            <span className="block">See How Much You Could</span>
            <span className="block">Save with Debt Relief</span>
          </h1>
          <p className="text-body text-neutral-500 text-center">
            Struggling with $15K+ in credit card or loan debt? Get matched with relief 
            options that could cut your payments in half.
          </p>
        </div>
        
        {/* State Dropdown */}
        <div className="w-full max-w-[410px] mx-auto">
          <label className="block text-body-sm font-medium text-neutral-800 mb-2">
            Select your state
          </label>
          <Select value={selectedStateAbbr} onValueChange={handleDropdownChange}>
            <SelectTrigger error={!!error}>
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {US_STATES.map((state) => (
                <SelectItem key={state.value} value={state.value}>
                  {state.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error && (
            <p className="mt-2 text-body-sm text-feedback-error" role="alert">
              {error}
            </p>
          )}
        </div>
        
        {/* Map + Stats Section */}
        <MapVisual 
          selectedState={selectedStateName}
          hoveredState={hoveredState}
          onStateSelect={handleMapStateSelect}
          onStateHover={setHoveredState}
          avgDebt={stats.avgDebt}
          avgSavings={stats.avgSavings}
        />
        
        {/* Submit Button */}
        <Button type="submit" fullWidth showTrailingIcon>
          Continue
        </Button>
      </form>
    </FormLayout>
  )
}

interface MapVisualProps {
  selectedState: string | null
  hoveredState: string | null
  onStateSelect: (stateName: string) => void
  onStateHover: (stateName: string | null) => void
  avgDebt: number
  avgSavings: number
}

/**
 * MapVisual Component
 * Shows interactive US map visualization with dynamic stats
 * Stats only update on click, hover is just for map highlighting
 */
function MapVisual({
  selectedState,
  hoveredState,
  onStateSelect,
  onStateHover,
  avgDebt,
  avgSavings,
}: MapVisualProps) {
  return (
    <div className="relative pt-6">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
        <div className="inline-flex items-center gap-2 rounded bg-secondary-500 px-2 py-1">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 1L9.79 5.73L15 6.46L11.25 9.85L12.18 15L8 12.52L3.82 15L4.75 9.85L1 6.46L6.21 5.73L8 1Z" stroke="#000000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-xs leading-4 text-neutral-900 font-medium">
            Reduce your payments by up to 50%
          </span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Interactive US Map */}
        <div className="flex justify-center w-full flex-[3]">
          <USMap
            selectedState={selectedState}
            hoveredState={hoveredState}
            onStateSelect={onStateSelect}
            onStateHover={onStateHover}
            className="w-full max-w-sm md:max-w-none"
          />
        </div>
        
        {/* Stats */}
        <div className="py-2 flex flex-row md:flex-col gap-8 md:gap-12 justify-center md:justify-start">
          {/* State name indicator (shows selected state) */}
          {selectedState && (
            <div className="hidden md:block text-left">
              <span className="text-sm font-medium text-primary-700">{selectedState}</span>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <AnimatedCounter
              value={avgDebt}
              prefix="$"
              className="font-display text-2xl font-bold leading-8 text-neutral-800"
              duration={800}
            />
            <div className="text-xs font-normal leading-4 text-neutral-900">Avg debt enrolled</div>
          </div>
          <div className="flex flex-col gap-2">
            <AnimatedCounter
              value={avgSavings}
              prefix="$"
              className="font-display text-2xl font-bold leading-8 text-primary-700"
              duration={800}
            />
            <div className="text-xs font-normal leading-4 text-neutral-900">Average saved by<br />customers like you</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LocationScreen
