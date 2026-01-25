'use client'

import * as React from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { FormLayout } from '@/components/layout/FormLayout'
import { Button } from '@/components/ui/Button'
import { Slider } from '@/components/ui/Slider'
import { formatCurrency, calculateSavings } from '@/lib/utils'

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
  const savings = calculateSavings(debtAmount)
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(income)
  }
  
  const markers = [
    { value: 10000, label: '10K' },
    { value: 50000, label: '50K' },
    { value: 100000, label: '100K' },
    { value: 150000, label: '150K' },
    { value: 200000, label: '200K+' },
  ]
  
  // Format income display
  const formatIncome = (value: number) => {
    if (value >= 200000) return '$200K+'
    return formatCurrency(value)
  }
  
  return (
    <FormLayout 
      currentStep={4} 
      onBack={onBack}
      sideContent={<SavingsProjection debtAmount={debtAmount} income={income} savings={savings} />}
    >
      <form onSubmit={handleSubmit} className="animate-slide-up space-y-6">
        {/* Headline */}
        <div className="space-y-2 text-center">
          <h1 className="font-display text-display sm:text-display-md lg:text-display-lg text-neutral-900 text-center">
            What is your annual income?
          </h1>
          <p className="text-body text-neutral-500 text-center">
            Please share your total income before taxes.
          </p>
        </div>
        
        {/* Income Display */}
        <div className="bg-primary-300 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-body text-neutral-800">Your income</span>
            <span className="text-headline-xl text-primary-700 font-bold">
              {formatIncome(income)}/yr
            </span>
          </div>
          
          {/* Slider */}
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
        
        {/* Why we ask accordion */}
        <button
          type="button"
          onClick={() => setShowWhyWeAsk(!showWhyWeAsk)}
          className="flex items-center gap-2 text-primary-700 text-body-sm font-medium hover:underline"
        >
          Why we ask for this information?
          {showWhyWeAsk ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        
        {showWhyWeAsk && (
          <div className="bg-neutral-100 rounded-lg p-4 animate-slide-up">
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
        
        {/* Mobile Savings Projection */}
        <div className="lg:hidden">
          <SavingsProjection debtAmount={debtAmount} income={income} savings={savings} />
        </div>
        
        {/* Submit Button */}
        <Button type="submit" fullWidth>
          Give Us Your Details
        </Button>
      </form>
    </FormLayout>
  )
}

/**
 * SavingsProjection Component
 * Shows debt projection based on income
 */
function SavingsProjection({ 
  debtAmount,
  income,
  savings 
}: { 
  debtAmount: number
  income: number
  savings: ReturnType<typeof calculateSavings>
}) {
  const debtToIncomeRatio = ((debtAmount / income) * 100).toFixed(1)
  
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-card">
      <h3 className="text-body font-semibold text-neutral-900 mb-4">
        Your debt projection
      </h3>
      
      {/* Debt to Income Indicator */}
      <div className="mb-6 p-4 bg-neutral-100 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-body-sm text-neutral-500">Debt-to-income ratio</span>
          <span className="text-body font-semibold text-neutral-900">{debtToIncomeRatio}%</span>
        </div>
        <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary-700 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(parseFloat(debtToIncomeRatio), 100)}%` }}
          />
        </div>
        <p className="text-caption text-neutral-500 mt-2">
          {parseFloat(debtToIncomeRatio) <= 36 
            ? 'Your debt-to-income ratio is in a healthy range'
            : parseFloat(debtToIncomeRatio) <= 50 
              ? 'Your debt-to-income ratio is manageable'
              : 'Your debt-to-income ratio is high — debt relief could help'}
        </p>
      </div>
      
      {/* Stats */}
      <div className="space-y-3">
        <div className="flex justify-between py-2 border-b border-neutral-200">
          <span className="text-body-sm text-neutral-500">Your debt</span>
          <span className="text-body-sm text-neutral-900 font-medium">
            {formatCurrency(debtAmount)}
          </span>
        </div>
        <div className="flex justify-between py-2 border-b border-neutral-200">
          <span className="text-body-sm text-neutral-500">*New debt amount</span>
          <span className="text-body-sm text-feedback-success font-medium">
            {formatCurrency(savings.newDebtAmount)}
          </span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-body-sm text-neutral-500">*New monthly payments</span>
          <span className="text-body-sm text-neutral-900 font-medium">
            {formatCurrency(savings.monthlyPayment)}/mo
          </span>
        </div>
      </div>
      
      <p className="text-caption text-neutral-500 mt-4">
        *Estimates based on typical debt relief outcomes
      </p>
    </div>
  )
}

export default IncomeScreen
