'use client'

import * as React from 'react'
import { FormLayout } from '@/components/layout/FormLayout'
import { Button } from '@/components/ui/Button'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { LottieIcon } from '@/components/ui/LottieIcon'
import { formatCurrency } from '@/lib/utils'
import type { DebtTypeOption } from '@/types/funnel'

// Import Lottie animation data
import interstitialAnimation from '../../../public/lottie/interstitial-1.json'

interface ResultsPreviewScreenProps {
  debtAmount: number
  debtType: DebtTypeOption
  income: number
  onBack?: () => void
  onNext?: () => void
}

/**
 * Format debt type to readable string
 */
function formatDebtType(debtType: DebtTypeOption): string {
  switch (debtType) {
    case 'credit-card':
      return 'credit card'
    case 'personal-loan':
      return 'personal loan'
    case 'both':
      return 'credit card and personal loan'
    default:
      return 'debt'
  }
}

/**
 * Calculate payoff months based on debt and income
 * Formula: (debtAmount * 0.6) / (income * 0.1 / 12)
 * Clamped between 24-48 months
 */
function calculatePayoffMonths(debtAmount: number, income: number): number {
  const remainingDebt = debtAmount * 0.6
  const monthlyBudget = (income * 0.1) / 12
  const rawMonths = Math.round(remainingDebt / monthlyBudget)
  // Clamp between 24-48 months for realistic range
  return Math.max(24, Math.min(48, rawMonths))
}

/**
 * Get contextual DTI message based on ratio
 * Provides accurate, helpful messaging without misleading claims
 */
function getDTIMessage(ratio: number): string {
  if (ratio < 30) {
    return `Your debt-to-income ratio of ${ratio}% is low, which gives you more options for relief programs.`
  } else if (ratio < 50) {
    return `Your debt-to-income ratio of ${ratio}% is moderate. Many relief programs work well for people in your situation.`
  } else {
    return `Your debt-to-income ratio of ${ratio}% shows you're carrying significant debt relative to income — which is exactly what debt relief programs are designed to help with.`
  }
}

/**
 * ResultsPreviewScreen
 * 
 * Interstitial "value moment" screen that shows personalized results
 * based on what the user has shared. Builds trust and momentum
 * before asking for contact information.
 */
export function ResultsPreviewScreen({
  debtAmount,
  debtType,
  income,
  onBack,
  onNext,
}: ResultsPreviewScreenProps) {
  // Calculate all values
  const savings = Math.round(debtAmount * 0.4)
  const payoffMonths = calculatePayoffMonths(debtAmount, income)
  const debtToIncomeRatio = Math.round((debtAmount / income) * 100)

  return (
    <FormLayout currentStep={5} onBack={onBack}>
      <div className="flex flex-col items-center text-center">
        {/* Lottie Animation - plays immediately, no fade-in */}
        <div className="w-20 h-20 mb-4">
          <LottieIcon 
            animationData={interstitialAnimation} 
            className="w-full h-full"
          />
        </div>

        {/* Headline - 0.2s delay */}
        <h1 
          className="font-display text-display sm:text-display-md lg:text-display-lg text-neutral-900 animate-fade-in-up"
          style={{ animationDelay: '200ms' }}
        >
          Good news — here&apos;s what we found.
        </h1>

        {/* Personalized Intro - 0.4s delay */}
        <p 
          className="text-body text-neutral-500 mt-4 max-w-md mx-auto animate-fade-in-up"
          style={{ animationDelay: '400ms' }}
        >
          Based on your {formatCurrency(debtAmount)} in {formatDebtType(debtType)} debt 
          and {formatCurrency(income)} income, you could be a strong candidate for debt relief.
        </p>

        {/* Savings Card - 0.6s delay */}
        <div 
          className="w-full bg-primary-300 rounded-xl p-8 mt-8 animate-fade-in-up"
          style={{ animationDelay: '600ms' }}
        >
          {/* Label */}
          <p className="text-body-sm text-neutral-600">
            You could save up to
          </p>

          {/* Savings Amount */}
          <div className="my-3">
            <span className="text-4xl md:text-5xl font-bold font-display text-primary-700">
              <AnimatedCounter
                value={savings}
                prefix="$"
                duration={1200}
                className="inline"
              />
              <span className="text-2xl align-top">*</span>
            </span>
          </div>

          {/* Payoff Line */}
          <p className="text-body text-neutral-700">
            and pay off your reduced balance in as little as <span className="font-semibold">{payoffMonths} months</span>
          </p>
        </div>

        {/* Supporting Line - 0.8s delay */}
        <p 
          className="text-body-sm text-neutral-500 mt-6 max-w-sm mx-auto animate-fade-in-up"
          style={{ animationDelay: '800ms' }}
        >
          {getDTIMessage(debtToIncomeRatio)}
        </p>

        {/* Disclaimer - 0.9s delay */}
        <p 
          className="text-caption text-neutral-400 mt-4 max-w-sm mx-auto animate-fade-in-up"
          style={{ animationDelay: '900ms' }}
        >
          *Estimated savings. Actual results vary based on your specific debt situation and enrolled program.
        </p>

        {/* CTA Button - 1.0s delay */}
        <div 
          className="w-full mt-8 animate-fade-in-up"
          style={{ animationDelay: '1000ms' }}
        >
          <Button 
            type="button" 
            fullWidth 
            showTrailingIcon
            onClick={onNext}
          >
            See my debt profile
          </Button>
        </div>
      </div>
    </FormLayout>
  )
}

export default ResultsPreviewScreen
