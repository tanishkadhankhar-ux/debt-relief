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
  { value: 'both', label: 'Both', lottie: bothAnimation, containerClass: 'w-24 h-16 sm:w-40 sm:h-20' },
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
    <FormLayout currentStep={2} onBack={onBack}>
      <div className="animate-slide-up space-y-8">
        {/* Headline */}
        <div className="space-y-2 text-center">
          <h1 className="font-display text-display sm:text-display-md lg:text-display-lg text-neutral-900 text-center">
            <span className="block">What type of debt do you</span>
            <span className="block">need help with?</span>
          </h1>
        </div>
        
        {/* Debt Type Options - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {DEBT_OPTIONS.map((option) => {
            const isSelected = selectedType === option.value
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={cn(
                  // Mobile: horizontal layout, Desktop: vertical layout
                  'flex sm:flex-col items-center justify-between sm:justify-center',
                  'gap-4 sm:gap-3 p-4 sm:p-6 rounded-lg border transition-all duration-200',
                  'sm:min-h-[180px]',
                  'hover:border-primary-700 hover:scale-[1.02]',
                  isSelected 
                    ? 'border-primary-700 bg-primary-300' 
                    : 'border-neutral-200 bg-white'
                )}
              >
                {/* Label - Left on mobile, below icon on desktop */}
                <span className="text-base font-medium text-neutral-800 text-left sm:text-center leading-tight order-1 sm:order-2">
                  {option.label}
                </span>
                
                {/* Animated Icon - Right on mobile, above label on desktop */}
                <div className={cn(
                  'flex items-center justify-center flex-shrink-0 order-2 sm:order-1',
                  option.containerClass || 'w-16 h-16 sm:w-20 sm:h-20'
                )}>
                  <LottieIcon 
                    animationData={option.lottie} 
                    className="w-full h-full"
                  />
                </div>
              </button>
            )
          })}
        </div>

        {/* How it works section */}
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-center text-xl font-bold text-[#1E2125] leading-6">
            How it works
          </h2>
          <div className="w-full bg-[#FEF9EF] rounded-lg p-4 flex flex-col sm:flex-row items-stretch gap-4">
            {/* Point 1 */}
            <div className="flex-1 flex items-center gap-4">
              <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#1E2125" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-sm font-normal text-[#1E2125] leading-5">
                Our debt relief partners work to reduce what you owe
              </p>
            </div>
            
            {/* Divider - horizontal on mobile, vertical on desktop */}
            <div className="h-px sm:h-auto sm:w-px bg-[#C0C0C0]"></div>
            
            {/* Point 2 */}
            <div className="flex-1 flex items-center gap-4">
              <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z" stroke="#1E2125" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 10H21" stroke="#1E2125" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-sm font-normal text-[#1E2125] leading-5">
                You stop paying every creditor separately. Just one reduced bill by up to 50%
              </p>
            </div>
          </div>
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
