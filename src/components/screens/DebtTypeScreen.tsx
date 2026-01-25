'use client'

import * as React from 'react'
import { Check } from 'lucide-react'
import { FormLayout } from '@/components/layout/FormLayout'
import { LottieIcon } from '@/components/ui/LottieIcon'
import { cn } from '@/lib/utils'
import { type DebtTypeOption } from '@/types/funnel'

// Import Lottie animation data
import creditCardAnimation from '../../../public/lottie/credit-score.json'
import personalLoanAnimation from '../../../public/lottie/personal-loan.json'
import bothAnimation from '../../../public/lottie/credit-card.json'

type DebtOption = {
  value: DebtTypeOption
  label: string
  lottie: object
  containerClass?: string
}

const DEBT_OPTIONS: DebtOption[] = [
  { value: 'credit-card', label: 'Credit Card Debt', lottie: creditCardAnimation },
  { value: 'personal-loan', label: 'Personal Loan', lottie: personalLoanAnimation },
  { value: 'both', label: 'Both', lottie: bothAnimation, containerClass: 'w-40 h-20' },
]

interface DebtTypeScreenProps {
  initialValue?: DebtTypeOption
  onBack?: () => void
  onSubmit?: (debtType: DebtTypeOption) => void
}

/**
 * DebtTypeScreen
 * 
 * Step 2 of the funnel - "What type of debt do you need help with?"
 * Single-click selection that auto-advances to next step
 */
export function DebtTypeScreen({ 
  initialValue, 
  onBack, 
  onSubmit 
}: DebtTypeScreenProps) {
  const [selectedType, setSelectedType] = React.useState<DebtTypeOption | undefined>(initialValue)
  
  const handleSelect = (value: DebtTypeOption) => {
    setSelectedType(value)
    // Auto-advance after brief visual feedback
    setTimeout(() => {
      onSubmit?.(value)
    }, 300)
  }
  
  return (
    <FormLayout currentStep={1} onBack={onBack}>
      <div className="animate-slide-up space-y-8">
        {/* Headline */}
        <div className="space-y-2 text-center">
          <h1 className="font-display text-display sm:text-display-md lg:text-display-lg text-neutral-900 text-center">
            <span className="block">What type of debt do you</span>
            <span className="block">need help with?</span>
          </h1>
        </div>
        
        {/* Debt Type Options - 3 Column Grid */}
        <div className="grid grid-cols-3 gap-4">
          {DEBT_OPTIONS.map((option) => {
            const isSelected = selectedType === option.value
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={cn(
                  'flex flex-col items-center justify-center gap-3 p-6 rounded-lg border transition-all duration-200 min-h-[180px]',
                  'hover:border-primary-700 hover:scale-[1.02]',
                  isSelected 
                    ? 'border-primary-700 bg-primary-300' 
                    : 'border-neutral-200 bg-white'
                )}
              >
                {/* Animated Icon */}
                <div className={cn('flex items-center justify-center', option.containerClass || 'w-20 h-20')}>
                  <LottieIcon 
                    animationData={option.lottie} 
                    className="w-full h-full"
                  />
                </div>
                
                {/* Label */}
                <span className="text-base font-medium text-neutral-800 text-center leading-tight">
                  {option.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-6 text-sm text-neutral-600">
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-[#0C7663]" />
            Risk-free
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-[#0C7663]" />
            No obligation
          </span>
        </div>
      </div>
    </FormLayout>
  )
}

export default DebtTypeScreen
