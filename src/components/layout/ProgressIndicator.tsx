'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface ProgressIndicatorProps {
  currentStep: number
  onBack?: () => void
  className?: string
}

// Step-specific subtitles for more granular feedback
const stepSubtitles: Record<number, string> = {
  1: 'Tell us about your debt situation',
  2: 'What kind of debt do you have?',
  3: 'How much debt do you have?',
  4: 'Tell us about your income',
  5: 'A few details about you',
  6: 'Almost there!',
  7: 'Your personalized debt profile',
  8: 'Where should we send your results?',
  9: 'Verify your phone number',
  10: 'Final step - your address',
}

const TOTAL_SEGMENTS = 6
const TOTAL_STEPS = 10

/**
 * ProgressIndicator Component
 * 
 * Segmented pill-style progress bar with progressive fill within each segment
 * Shows progress through the funnel with dynamic subtitle
 * 
 * currentStep: 1-10 representing each screen in the funnel
 * 
 * @example
 * <ProgressIndicator currentStep={1} onBack={handleBack} />
 */
export function ProgressIndicator({ currentStep, onBack, className }: ProgressIndicatorProps) {
  // Calculate how much of the total progress we've made (0 to 1)
  const totalProgress = currentStep / TOTAL_STEPS
  
  // Calculate how many full segments + partial fill
  const progressInSegments = totalProgress * TOTAL_SEGMENTS
  const fullSegments = Math.floor(progressInSegments)
  const partialFill = (progressInSegments - fullSegments) * 100 // percentage of current segment
  
  // Get subtitle for current step
  const subtitle = stepSubtitles[currentStep] || 'Continue your application'

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
          {subtitle}
        </p>

        {/* Segmented Progress Bar with progressive fill */}
        <div className="flex justify-center gap-1.5">
          {[...Array(TOTAL_SEGMENTS)].map((_, index) => {
            // Determine fill state for this segment
            const isFull = index < fullSegments
            const isPartial = index === fullSegments
            const isEmpty = index > fullSegments
            
            return (
              <div
                key={index}
                className="h-1.5 rounded-full w-8 sm:w-10 md:w-12 bg-[#D7DCE5] overflow-hidden"
              >
                <div 
                  className="h-full bg-[#0C7663] rounded-full transition-all duration-500 ease-out"
                  style={{ 
                    width: isFull ? '100%' : isPartial ? `${partialFill}%` : '0%' 
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ProgressIndicator
