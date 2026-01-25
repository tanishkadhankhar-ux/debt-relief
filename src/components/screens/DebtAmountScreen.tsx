'use client'

import * as React from 'react'
import { FormLayout } from '@/components/layout/FormLayout'
import { Button } from '@/components/ui/Button'
import { Slider } from '@/components/ui/Slider'
import { formatCurrency, calculateSavings } from '@/lib/utils'

interface DebtAmountScreenProps {
  initialValue?: number
  onBack?: () => void
  onSubmit?: (value: number) => void
}

/**
 * DebtAmountScreen
 * 
 * Step 3 of the funnel - "How much debt do you have?"
 * Shows a slider to select debt amount with live savings calculator
 * 
 * @example
 * <DebtAmountScreen 
 *   initialValue={15000}
 *   onBack={handleBack}
 *   onSubmit={(value) => router.push('/income')}
 * />
 */
export function DebtAmountScreen({ 
  initialValue = 20000, 
  onBack, 
  onSubmit 
}: DebtAmountScreenProps) {
  const [debtAmount, setDebtAmount] = React.useState(initialValue)
  const savings = calculateSavings(debtAmount)
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(debtAmount)
  }
  
  const markers = [
    { value: 10000, label: '10K' },
    { value: 30000, label: '30K' },
    { value: 50000, label: '50K' },
    { value: 60000, label: '60K+' },
  ]
  
  return (
    <FormLayout 
      currentStep={3} 
      onBack={onBack}
      sideContent={<SavingsPreview debtAmount={debtAmount} savings={savings} />}
    >
      <form onSubmit={handleSubmit} className="animate-slide-up space-y-6">
        {/* Headline */}
        <div className="space-y-2 text-center">
          <h1 className="font-display text-display sm:text-display-md lg:text-display-lg text-neutral-900 text-center">
            How much debt do you have?
          </h1>
          <p className="text-body text-neutral-500 text-center">
            You could reduce your debt amount by 50%
          </p>
        </div>
        
        {/* Debt Amount Display */}
        <div className="bg-primary-300 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-body text-neutral-800">Your debt</span>
            <span className="text-headline-xl text-primary-700 font-bold">
              {formatCurrency(debtAmount)}
            </span>
          </div>
          
          {/* Slider */}
          <Slider
            min={10000}
            max={60000}
            step={1000}
            value={[debtAmount]}
            onValueChange={([value]) => setDebtAmount(value)}
            markers={markers}
            showValue={false}
          />
        </div>
        
        {/* Savings Summary (Mobile) */}
        <div className="lg:hidden">
          <SavingsPreview debtAmount={debtAmount} savings={savings} />
        </div>
        
        {/* Submit Button */}
        <Button type="submit" fullWidth>
          Tell Us About Your Income
        </Button>
        
        {/* Disclaimer */}
        <p className="text-caption text-neutral-500 text-center">
          *This is a savings estimate. Your actual savings amount is subject to change 
          due to a variety of factors such as your debt to income ratio and interest rates.
        </p>
      </form>
    </FormLayout>
  )
}

/**
 * SavingsPreview Component
 * Shows the debt reduction calculation
 */
function SavingsPreview({ 
  debtAmount, 
  savings 
}: { 
  debtAmount: number
  savings: ReturnType<typeof calculateSavings>
}) {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-card">
      <h3 className="text-body font-semibold text-neutral-900 mb-4">
        Your savings estimate
      </h3>
      
      {/* Donut Chart Placeholder */}
      <div className="flex justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#F3F5FB"
              strokeWidth="12"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#007AC8"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${0.6 * 251.2} 251.2`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-caption text-neutral-500">Your debt</span>
            <span className="text-headline-md text-neutral-900 font-bold">
              {formatCurrency(debtAmount)}
            </span>
          </div>
        </div>
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
        <div className="flex justify-between py-2 border-b border-neutral-200">
          <span className="text-body-sm text-neutral-500">*Estimated savings</span>
          <span className="text-body-sm text-feedback-success font-medium">
            {formatCurrency(savings.savings)}
          </span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-body-sm text-neutral-500">*New monthly payments</span>
          <span className="text-body-sm text-neutral-900 font-medium">
            {formatCurrency(savings.monthlyPayment)}/mo
          </span>
        </div>
      </div>
    </div>
  )
}

export default DebtAmountScreen
