'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface ProgressIndicatorProps {
  currentStep: number
  onBack?: () => void
  className?: string
}

const steps = [
  { id: 1, label: 'Your debt profile', subtitle: 'Tell us about your debt situation' },
  { id: 2, label: 'Your details', subtitle: 'Almost there! Just a few more details' },
  { id: 3, label: 'Reduce your debt', subtitle: 'Final step to see your options' },
]

const TOTAL_SEGMENTS = 6
const SEGMENTS_PER_STEP = TOTAL_SEGMENTS / steps.length // 2 segments per step

/**
 * ProgressIndicator Component
 * 
 * Segmented pill-style progress bar with dynamic subtitle
 * Shows progress through the funnel with visual segments
 * 
 * @example
 * <ProgressIndicator currentStep={1} onBack={handleBack} />
 */
export function ProgressIndicator({ currentStep, onBack, className }: ProgressIndicatorProps) {
  // Calculate filled segments based on current step
  const filledSegments = currentStep * SEGMENTS_PER_STEP
  const currentStepData = steps.find(s => s.id === currentStep)

  return (
    <div className={cn('w-full bg-white sticky top-12 z-40', className)}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        {/* Back Button Row */}
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-neutral-900 hover:text-primary-700 transition-colors mb-4"
            aria-label="Go back"
          >
            <svg 
              width="16" 
              height="24" 
              viewBox="0 0 16 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-5"
            >
              <path 
                d="M10 6L4 12L10 18" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-sm font-normal leading-5">Back</span>
          </button>
        )}

        {/* Subtitle */}
        <p className="text-center text-sm text-neutral-600 mb-2">
          {currentStepData?.subtitle}
        </p>

        {/* Segmented Progress Bar */}
        <div className="flex justify-center gap-1.5">
          {[...Array(TOTAL_SEGMENTS)].map((_, index) => (
            <div
              key={index}
              className={cn(
                'h-1.5 rounded-full transition-colors duration-300',
                'w-8 sm:w-10 md:w-12',
                index < filledSegments 
                  ? 'bg-[#0C7663]' 
                  : 'bg-[#D7DCE5]'
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProgressIndicator
