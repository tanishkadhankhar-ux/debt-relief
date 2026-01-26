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
      <div className="animate-slide-up flex flex-col items-center text-center">
        {/* Lottie Animation */}
        <div className="w-20 h-20 mb-4">
          <LottieIcon 
            animationData={interstitialAnimation} 
            className="w-full h-full"
          />
        </div>

        {/* Headline */}
        <h1 className="font-display text-display sm:text-display-md lg:text-display-lg text-neutral-900">
          Good news — here&apos;s what we found.
        </h1>

        {/* Personalized Intro */}
        <p className="text-body text-neutral-500 mt-4 max-w-md mx-auto">
          Based on your {formatCurrency(debtAmount)} in {formatDebtType(debtType)} debt 
          and {formatCurrency(income)} income, you could be a strong candidate for debt relief.
        </p>

        {/* Savings Card */}
        <div className="w-full bg-primary-300 rounded-xl p-8 mt-8">
          {/* Label */}
          <p className="text-body-sm text-neutral-600">
            You could save up to
          </p>

          {/* Savings Amount */}
          <div className="my-3">
            <AnimatedCounter
              value={savings}
              prefix="$"
              duration={1200}
              className="text-4xl md:text-5xl font-bold font-display text-primary-700"
            />
          </div>

          {/* Payoff Line */}
          <p className="text-body text-neutral-700">
            and be debt-free in as little as <span className="font-semibold">{payoffMonths} months</span>
          </p>
        </div>

        {/* Supporting Line */}
        <p className="text-body-sm text-neutral-500 mt-6 max-w-sm mx-auto">
          Your debt-to-income ratio of <span className="font-medium">{debtToIncomeRatio}%</span> puts 
          you in a favorable range for most relief programs.
        </p>

        {/* CTA Button */}
        <div className="w-full mt-8">
          <Button 
            type="button" 
            fullWidth 
            showTrailingIcon
            onClick={onNext}
          >
            Continue to Get Matched
          </Button>
        </div>
      </div>
    </FormLayout>
  )
}

export default ResultsPreviewScreen
