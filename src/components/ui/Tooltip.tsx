'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface TooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  className?: string
}

/**
 * Tooltip Component
 * 
 * Simple hover tooltip for displaying additional information
 * Uses design system colors: white background, primary-700 accent, neutral text
 * 
 * @example
 * <Tooltip content="This is helpful information">
 *   <HelpCircle className="w-4 h-4" />
 * </Tooltip>
 */
export function Tooltip({ content, children, className }: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  
  return (
    <div 
      className="relative inline-flex"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      <button
        type="button"
        className="cursor-help focus:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-1 rounded-full"
        aria-label="More information"
      >
        {children}
      </button>
      
      {isVisible && (
        <div 
          className={cn(
            'absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2',
            'px-3 py-2.5 rounded-[8px]',
            'bg-white border border-neutral-200 shadow-card',
            'text-body-sm text-neutral-800 leading-relaxed',
            'max-w-[240px] w-max',
            'animate-fade-in',
            className
          )}
          role="tooltip"
        >
          {/* Accent bar */}
          <div className="absolute top-0 left-3 right-3 h-0.5 bg-primary-700 rounded-full" />
          <div className="pt-1">
            {content}
          </div>
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2">
            <div className="relative">
              {/* Border arrow */}
              <div className="border-[6px] border-transparent border-t-neutral-200" />
              {/* Fill arrow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-white" style={{ top: '-1px' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Tooltip
