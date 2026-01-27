'use client'

import * as React from 'react'
import { PiggyBank, CheckCircle2, Star } from 'lucide-react'
import { FormLayout } from '@/components/layout/FormLayout'
import { cn } from '@/lib/utils'

const STEPS = [
  'Analyzing your responses...',
  'Calculating your savings...',
  'Matching relief programs...',
  'Preparing your personalized plan...',
]

interface ProcessingScreenProps {
  onNext?: () => void
}

/**
 * ProcessingScreen
 * 
 * Animated "building your profile" screen that creates anticipation
 * while appearing to process the user's information.
 * Auto-advances to the next screen after ~5.5 seconds.
 */
export function ProcessingScreen({ onNext }: ProcessingScreenProps) {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [progress, setProgress] = React.useState(0)
  
  React.useEffect(() => {
    // Step through checklist items every ~1.2 seconds
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= STEPS.length - 1) {
          clearInterval(stepInterval)
          return prev
        }
        return prev + 1
      })
    }, 1200)

    // Animate progress bar smoothly
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 1
      })
    }, 50) // 5 seconds to complete

    // Auto-advance after animation completes
    const timeout = setTimeout(() => {
      onNext?.()
    }, 5500)

    return () => {
      clearInterval(stepInterval)
      clearInterval(progressInterval)
      clearTimeout(timeout)
    }
  }, [onNext])

  const renderStep = (text: string, index: number) => {
    const isComplete = index < currentStep
    const isCurrent = index === currentStep
    const isPending = index > currentStep

    return (
      <div key={index} className="flex items-center gap-3">
        {isComplete && (
          <CheckCircle2 className="w-5 h-5 text-feedback-success fill-feedback-success" />
        )}
        {isCurrent && (
          <CheckCircle2 className="w-5 h-5 text-feedback-success opacity-50" />
        )}
        {isPending && (
          <div className="w-5 h-5 rounded-full border-2 border-neutral-200" />
        )}
        <span
          className={cn(
            'text-body transition-colors duration-300',
            isPending ? 'text-neutral-500' : 'text-neutral-800'
          )}
        >
          {text}
        </span>
      </div>
    )
  }

  return (
    <FormLayout currentStep={8} showProgress={false}>
      <div className="flex flex-col items-center py-4 animate-slide-up">
        {/* Icon */}
        <div className="w-16 h-16 mx-auto flex items-center justify-center bg-primary-300 rounded-full">
          <PiggyBank className="w-8 h-8 text-primary-700" />
        </div>

        {/* Headline */}
        <h1 className="font-display text-display sm:text-display-md text-neutral-900 text-center mt-6">
          Building your debt relief profile...
        </h1>

        {/* Checklist */}
        <div className="flex flex-col items-center gap-3 mt-6">
          {STEPS.map((step, index) => renderStep(step, index))}
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-sm mx-auto mt-6">
          <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="bg-feedback-success h-full rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-caption text-neutral-500 text-center mt-2">
            {progress}% complete
          </p>
        </div>

        {/* Testimonial Card */}
        <div className="bg-secondary-300 rounded-xl p-6 mt-8">
          <p className="text-caption uppercase tracking-widest text-primary-700 text-center font-medium">
            WHAT OTHERS ARE SAYING
          </p>
          <div className="text-primary-700 opacity-30 text-4xl text-center mt-2 leading-none font-display">
            &ldquo;
          </div>
          <p className="text-body text-neutral-800 italic text-center mt-2 px-4">
            I was overwhelmed by $52,000 in credit card debt. Within 30 months, 
            I settled for $31,000 and finally feel free.
          </p>
          <div className="flex justify-center gap-1 mt-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-5 h-5 text-secondary-500 fill-secondary-500"
              />
            ))}
          </div>
          <p className="text-body-sm text-neutral-500 text-center mt-2">
            Sarah P. — Texas
          </p>
        </div>

        {/* Trust Badges */}
        <div className="flex justify-center items-center gap-6 mt-8">
          <div className="text-center">
            <p className="text-headline-sm font-bold text-neutral-900">1M+</p>
            <p className="text-caption text-neutral-500">Americans helped</p>
          </div>
          <div className="h-8 w-px bg-neutral-200" />
          <div className="text-center">
            <p className="text-headline-sm font-bold text-neutral-900">24/7</p>
            <p className="text-caption text-neutral-500">US Support</p>
          </div>
          <div className="h-8 w-px bg-neutral-200" />
          <div className="text-center">
            <p className="text-headline-sm font-bold text-neutral-900">4.8★</p>
            <p className="text-caption text-neutral-500">Trustpilot</p>
          </div>
        </div>
      </div>
    </FormLayout>
  )
}

export default ProcessingScreen
