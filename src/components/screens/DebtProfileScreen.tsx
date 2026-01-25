'use client'

import * as React from 'react'
import { Users, Clock, Receipt } from 'lucide-react'
import { FormLayout } from '@/components/layout/FormLayout'
import { Button } from '@/components/ui/Button'
import { formatCurrency, calculateSavings } from '@/lib/utils'

interface DebtProfileScreenProps {
  firstName: string
  debtAmount: number
  onBack?: () => void
  onSubmit?: () => void
}

/**
 * DebtProfileScreen
 * 
 * Step 7 of the funnel - Results page showing personalized debt profile
 * Shows donut chart, savings stats, timeline, and social proof
 */
export function DebtProfileScreen({ 
  firstName,
  debtAmount,
  onBack, 
  onSubmit 
}: DebtProfileScreenProps) {
  const savings = calculateSavings(debtAmount)
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.()
  }
  
  return (
    <FormLayout currentStep={7} onBack={onBack}>
      <form onSubmit={handleSubmit} className="animate-slide-up space-y-6">
        {/* Headline */}
        <div className="space-y-2 text-center">
          <h1 className="font-display text-display sm:text-display-md lg:text-display-lg text-neutral-900 text-center">
            Here&apos;s your debt profile, {firstName}
          </h1>
          <p className="text-body text-neutral-500 text-center">
            Your debt profile matches with more than 200,000 people across the USA 
            who are in 38-48 years age range
          </p>
        </div>
        
        {/* Main Results Card */}
        <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-card">
          {/* Donut Chart */}
          <div className="flex justify-center mb-6">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle (total debt) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#F3F5FB"
                  strokeWidth="14"
                />
                {/* Reduced amount (savings) - green */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#0C7663"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray={`${0.4 * 251.2} 251.2`}
                />
                {/* Remaining debt - blue */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#007AC8"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray={`${0.6 * 251.2} 251.2`}
                  strokeDashoffset={`${-0.4 * 251.2}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-caption text-neutral-500">New debt</span>
                <span className="text-headline-md text-neutral-900 font-bold">
                  {formatCurrency(savings.newDebtAmount)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex justify-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary-700" />
              <span className="text-body-sm text-neutral-500">New debt amount</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-feedback-success" />
              <span className="text-body-sm text-neutral-500">Potential savings</span>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-neutral-100 rounded-lg p-4 text-center">
              <div className="text-headline-md text-neutral-900 font-bold">
                {formatCurrency(debtAmount)}
              </div>
              <div className="text-body-sm text-neutral-500">Your debt</div>
            </div>
            <div className="bg-primary-300 rounded-lg p-4 text-center">
              <div className="text-headline-md text-feedback-success font-bold">
                {formatCurrency(savings.savings)}
              </div>
              <div className="text-body-sm text-neutral-500">Potential reduction</div>
            </div>
          </div>
        </div>
        
        {/* Timeline Card */}
        <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-card">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-300 flex items-center justify-center">
              <Clock className="w-6 h-6 text-primary-700" />
            </div>
            <div className="flex-1">
              <div className="text-headline-md text-neutral-900 font-bold">
                24-48 Months
              </div>
              <p className="text-body-sm text-neutral-500">
                Estimated time to become debt-free
              </p>
            </div>
          </div>
          
          {/* Timeline Visual */}
          <div className="mt-4 pt-4 border-t border-neutral-200">
            <div className="flex justify-between mb-2">
              <span className="text-caption text-neutral-500">Today</span>
              <span className="text-caption text-neutral-500">Debt-free</span>
            </div>
            <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-gradient-to-r from-primary-700 to-feedback-success rounded-full" />
            </div>
          </div>
        </div>
        
        {/* Social Proof */}
        <div className="bg-neutral-100 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <Users className="w-5 h-5 text-primary-700" />
            <span className="text-body font-semibold text-neutral-900">
              Our partners have helped more than 3 million people
            </span>
          </div>
          <p className="text-body-sm text-neutral-500 pl-8">
            Join thousands who have successfully reduced their debt
          </p>
        </div>
        
        {/* Monthly Payment */}
        <div className="bg-primary-300 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Receipt className="w-5 h-5 text-primary-700" />
            <div>
              <p className="text-body text-neutral-800">
                You could be paying a single bill as low as
              </p>
              <p className="text-headline-md text-primary-700 font-bold">
                {formatCurrency(savings.monthlyPayment)}/month
              </p>
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <Button type="submit" fullWidth>
          Continue To See Your Options
        </Button>
        
        {/* Disclaimer */}
        <p className="text-caption text-neutral-500 text-center">
          *Estimates based on typical debt relief outcomes. Actual results may vary 
          based on individual circumstances.
        </p>
      </form>
    </FormLayout>
  )
}

export default DebtProfileScreen
