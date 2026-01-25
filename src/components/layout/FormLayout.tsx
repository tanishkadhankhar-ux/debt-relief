import * as React from 'react'
import { cn } from '@/lib/utils'
import { Header } from './Header'
import { Footer } from './Footer'
import { TrustBadges } from './TrustBadges'
import { ProgressIndicator } from './ProgressIndicator'

interface FormLayoutProps {
  children: React.ReactNode
  currentStep?: number
  onBack?: () => void
  showProgress?: boolean
  sideContent?: React.ReactNode
  className?: string
}

/**
 * FormLayout Component
 * 
 * Standard layout wrapper for all form screens
 * Includes Header, sticky Progress Indicator with Back button, and Trust Badges
 * 
 * @example
 * <FormLayout 
 *   currentStep={1} 
 *   onBack={handleBack}
 *   sideContent={<SavingsCalculator />}
 * >
 *   <form>...</form>
 * </FormLayout>
 */
export function FormLayout({ 
  children, 
  currentStep = 1, 
  onBack, 
  showProgress = true,
  sideContent,
  className 
}: FormLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <Header />
      
      {/* Sticky Progress Indicator with Back Button */}
      {showProgress ? (
        <ProgressIndicator currentStep={currentStep} onBack={onBack} />
      ) : onBack ? (
        /* Minimal back bar when progress is hidden but back is needed */
        <div className="w-full bg-white sticky top-12 z-40">
          <div className="h-14 relative max-w-6xl mx-auto px-4 sm:px-6">
            <button
              onClick={onBack}
              className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 flex items-center gap-2 text-neutral-900 hover:text-primary-700 transition-colors"
              aria-label="Go back"
            >
              <svg 
                width="16" 
                height="24" 
                viewBox="0 0 16 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-6"
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
          </div>
        </div>
      ) : null}
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <div className="w-full max-w-content mx-auto px-4 sm:px-6 py-8 flex-1">
          {/* Content Area */}
          <div
            className={cn(
              'flex flex-col gap-6',
              className
            )}
          >
            {/* Main Form Content */}
            <div className="w-full">
              {children}
            </div>
            
            {/* Side Content (Calculator, Preview, etc.) */}
            {sideContent && (
              <div className="w-full">
                {sideContent}
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Trust Badges */}
      <TrustBadges />
      
      {/* Footer */}
      <Footer />
    </div>
  )
}

export default FormLayout
