'use client'

import * as React from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { FormLayout } from '@/components/layout/FormLayout'
import { Button } from '@/components/ui/Button'
import { Slider } from '@/components/ui/Slider'
import { formatCurrency, calculateSavings } from '@/lib/utils'

/**
 * MoneyPyramid Component
 * Displays a pyramid of money icons that grows based on income tier
 */
interface MoneyPyramidProps {
  income: number
}

function MoneyPyramid({ income }: MoneyPyramidProps) {
  const getTier = (income: number): number => {
    if (income < 40000) return 1
    if (income < 80000) return 2
    if (income < 140000) return 3
    return 4
  }

  const tier = getTier(income)
  
  // Build rows: row 1 has 1 icon, row 2 has 2, etc.
  const rows = Array.from({ length: tier }, (_, i) => i + 1)

  return (
    <div className="flex flex-col items-center -space-y-2">
      {rows.map((count, rowIndex) => (
        <div
          key={`row-${rowIndex}-${tier}`}
          className={`flex -space-x-2 animate-money-fade-in pyramid-row-${rowIndex + 1}`}
        >
          {Array.from({ length: count }).map((_, iconIndex) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={`icon-${rowIndex}-${iconIndex}`}
              src="/Money.svg"
              alt=""
              width={52}
              height={40}
              className={`w-[52px] h-[40px] animate-money-fade-in pyramid-icon-${iconIndex}`}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

interface IncomeScreenProps {
  initialValue?: number
  debtAmount?: number
  onBack?: () => void
  onSubmit?: (income: number) => void
}

/**
 * IncomeScreen
 * 
 * Step 4 of the funnel - "What is your annual income?"
 * Shows a slider for income with savings projection
 */
export function IncomeScreen({ 
  initialValue = 50000,
  debtAmount = 20000,
  onBack, 
  onSubmit 
}: IncomeScreenProps) {
  const [income, setIncome] = React.useState(initialValue)
  const [showWhyWeAsk, setShowWhyWeAsk] = React.useState(false)
  
  // Calculate savings with income-aware monthly payments
  const baseSavings = calculateSavings(debtAmount)
  
  // Calculate affordable monthly payment (10-15% of monthly income)
  const monthlyIncome = income / 12
  const maxAffordablePayment = Math.round(monthlyIncome * 0.15)
  
  // Suggest a payment within the affordable range, but at least enough to pay off in 48 months
  const minRequiredPayment = Math.round(baseSavings.newDebtAmount / 48)
  const suggestedPayment = Math.max(minRequiredPayment, Math.min(maxAffordablePayment, Math.round(monthlyIncome * 0.12)))
  
  // Calculate payoff timeline based on suggested payment
  const payoffMonths = Math.ceil(baseSavings.newDebtAmount / suggestedPayment)
  
  const savings = {
    ...baseSavings,
    monthlyPayment: suggestedPayment,
    payoffMonths
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(income)
  }
  
  const markers = [
    { value: 20000, label: '20K' },
    { value: 60000, label: '60K' },
    { value: 100000, label: '100K' },
    { value: 200000, label: '200K+' },
  ]
  
  // Format income display with K notation for large values
  const formatIncomeDisplay = (value: number) => {
    if (value >= 200000) return { amount: '$200K+', suffix: '' }
    if (value >= 1000) {
      return { 
        amount: formatCurrency(value), 
        suffix: '/year' 
      }
    }
    return { amount: formatCurrency(value), suffix: '/year' }
  }
  
  const incomeDisplay = formatIncomeDisplay(income)
  
  return (
    <FormLayout 
      currentStep={4} 
      onBack={onBack}
    >
      <form onSubmit={handleSubmit} className="animate-slide-up space-y-6 flex flex-col items-center">
        {/* Headline */}
        <div className="w-full space-y-2 text-center">
          <h1 className="font-display text-display sm:text-display-md lg:text-display-lg text-neutral-900 text-center">
            What is your annual income?
          </h1>
          <p className="text-body text-neutral-500 text-center">
            Please share your total income before taxes.
          </p>
          
          {/* Why we ask accordion */}
          <button
            type="button"
            onClick={() => setShowWhyWeAsk(!showWhyWeAsk)}
            className="inline-flex items-center justify-center gap-2 text-primary-700 text-body-sm font-medium hover:underline"
          >
            Why we ask for this information?
            {showWhyWeAsk ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          
          {showWhyWeAsk && (
            <div className="w-full bg-neutral-100 rounded-lg p-4 animate-slide-up text-left">
              <p className="text-body-sm text-neutral-800">
                Your income helps us determine the best debt relief options for your situation. 
                Debt-to-income ratio is an important factor that debt relief providers use to 
                create a personalized plan that fits your budget.
              </p>
              <p className="text-body-sm text-neutral-500 mt-2">
                This information is kept confidential and only shared with potential debt relief partners.
              </p>
            </div>
          )}
        </div>
        
        {/* Income Card - Matching Figma Design */}
        <div className="w-full bg-white rounded-lg px-8 py-6 flex flex-col items-center gap-4">
          {/* Money Pyramid - responds to income slider */}
          <MoneyPyramid income={income} />
          
          {/* Income Display */}
          <div className="flex flex-col items-center gap-1">
            <div className="pb-2 border-b border-neutral-200">
              <span className="text-3xl font-bold font-display text-neutral-900">
                {incomeDisplay.amount}
              </span>
              {incomeDisplay.suffix && (
                <span className="text-3xl font-bold font-display text-neutral-500">
                  {incomeDisplay.suffix}
                </span>
              )}
            </div>
            <span className="text-caption text-neutral-800">
              Your income before taxes
            </span>
          </div>
          
          {/* Slider Section */}
          <div className="w-full max-w-xs">
            <Slider
              min={10000}
              max={200000}
              step={5000}
              value={[income]}
              onValueChange={([value]) => setIncome(value)}
              markers={markers}
              showValue={false}
            />
          </div>
          
          {/* Debt Summary Section */}
          <div className="w-full bg-neutral-100 rounded-lg p-3 border border-neutral-200">
            {/* Your debt row */}
            <div className="flex justify-between items-center py-1">
              <span className="text-sm text-neutral-800">Your debt</span>
              <span className="text-base font-medium text-neutral-700">
                {formatCurrency(debtAmount)}
              </span>
            </div>
            
            {/* New debt amount row */}
            <div className="flex justify-between items-center py-1">
              <span className="text-sm text-neutral-800">New debt amount</span>
              <span className="text-base font-medium text-feedback-success">
                {formatCurrency(savings.newDebtAmount)}
              </span>
            </div>
            
            {/* Divider */}
            <div className="h-px bg-neutral-300 my-2" />
            
            {/* New monthly payments row */}
            <div className="flex justify-between items-center py-1">
              <span className="text-sm text-neutral-800">Suggested monthly payment</span>
              <span className="text-base font-medium text-feedback-success">
                {formatCurrency(savings.monthlyPayment)}/mo
              </span>
            </div>
            
            {/* Payoff timeline */}
            <div className="flex justify-between items-center py-1">
              <span className="text-sm text-neutral-800">Estimated payoff</span>
              <span className="text-base font-medium text-neutral-700">
                {savings.payoffMonths} months
              </span>
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="w-full">
          <Button type="submit" fullWidth showTrailingIcon>
            Continue
          </Button>
        </div>
      </form>
    </FormLayout>
  )
}

export default IncomeScreen
