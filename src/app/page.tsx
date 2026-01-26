'use client'

import * as React from 'react'
import {
  LocationScreen,
  DebtTypeScreen,
  DidYouKnowScreen,
  DebtAmountScreen,
  IncomeScreen,
  ResultsPreviewScreen,
  DateOfBirthScreen,
  NameScreen,
  DebtProfileScreen,
  EmailScreen,
  PhoneScreen,
  AddressScreen,
} from '@/components/screens'
import type { FunnelData, DebtTypeOption } from '@/types/funnel'

// Funnel steps
type FunnelStep =
  | 'location'
  | 'debtType'
  | 'didYouKnow'
  | 'debtAmount'
  | 'income'
  | 'resultsPreview'
  | 'dateOfBirth'
  | 'name'
  | 'debtProfile'
  | 'email'
  | 'phone'
  | 'address'
  | 'complete'

// Step order for navigation
const STEP_ORDER: FunnelStep[] = [
  'location',
  'debtType',
  'didYouKnow',
  'debtAmount',
  'income',
  'resultsPreview',
  'dateOfBirth',
  'name',
  'debtProfile',
  'email',
  'phone',
  'address',
  'complete',
]

/**
 * Home Page - Funnel Orchestrator
 * 
 * Manages the state and navigation between all funnel screens
 */
export default function Home() {
  const [currentStep, setCurrentStep] = React.useState<FunnelStep>('location')
  const [funnelData, setFunnelData] = React.useState<FunnelData>({})
  
  // Navigation helpers
  const goToNextStep = () => {
    const currentIndex = STEP_ORDER.indexOf(currentStep)
    if (currentIndex < STEP_ORDER.length - 1) {
      setCurrentStep(STEP_ORDER[currentIndex + 1])
    }
  }
  
  const goToPreviousStep = () => {
    const currentIndex = STEP_ORDER.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(STEP_ORDER[currentIndex - 1])
    }
  }
  
  // Update funnel data helper
  const updateFunnelData = (data: Partial<FunnelData>) => {
    setFunnelData((prev) => ({ ...prev, ...data }))
  }
  
  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 'location':
        return (
          <LocationScreen
            initialValue={funnelData.state}
            onSubmit={(state) => {
              updateFunnelData({ state })
              goToNextStep()
            }}
          />
        )
      
      case 'debtType':
        return (
          <DebtTypeScreen
            initialValue={funnelData.debtType}
            onBack={goToPreviousStep}
            onSubmit={(debtType: DebtTypeOption) => {
              updateFunnelData({ debtType })
              goToNextStep()
            }}
          />
        )
      
      case 'didYouKnow':
        return (
          <DidYouKnowScreen
            debtType={funnelData.debtType}
            onBack={goToPreviousStep}
            onNext={goToNextStep}
          />
        )
      
      case 'debtAmount':
        return (
          <DebtAmountScreen
            initialValue={funnelData.debtAmount}
            onBack={goToPreviousStep}
            onSubmit={(debtAmount) => {
              updateFunnelData({ debtAmount })
              goToNextStep()
            }}
          />
        )
      
      case 'income':
        return (
          <IncomeScreen
            initialValue={funnelData.annualIncome}
            debtAmount={funnelData.debtAmount || 20000}
            onBack={goToPreviousStep}
            onSubmit={(annualIncome) => {
              updateFunnelData({ annualIncome })
              goToNextStep()
            }}
          />
        )
      
      case 'resultsPreview':
        return (
          <ResultsPreviewScreen
            debtAmount={funnelData.debtAmount || 20000}
            debtType={funnelData.debtType || 'credit-card'}
            income={funnelData.annualIncome || 50000}
            onBack={goToPreviousStep}
            onNext={goToNextStep}
          />
        )
      
      case 'dateOfBirth':
        return (
          <DateOfBirthScreen
            initialValue={funnelData.dateOfBirth}
            onBack={goToPreviousStep}
            onSubmit={(dateOfBirth) => {
              updateFunnelData({ dateOfBirth })
              goToNextStep()
            }}
          />
        )
      
      case 'name':
        return (
          <NameScreen
            initialValue={
              funnelData.firstName && funnelData.lastName
                ? { firstName: funnelData.firstName, lastName: funnelData.lastName }
                : undefined
            }
            onBack={goToPreviousStep}
            onSubmit={({ firstName, lastName }) => {
              updateFunnelData({ firstName, lastName })
              goToNextStep()
            }}
          />
        )
      
      case 'debtProfile':
        return (
          <DebtProfileScreen
            firstName={funnelData.firstName || 'User'}
            debtAmount={funnelData.debtAmount || 20000}
            onBack={goToPreviousStep}
            onSubmit={() => {
              goToNextStep()
            }}
          />
        )
      
      case 'email':
        return (
          <EmailScreen
            initialValue={funnelData.email}
            onBack={goToPreviousStep}
            onSubmit={(email) => {
              updateFunnelData({ email })
              goToNextStep()
            }}
          />
        )
      
      case 'phone':
        return (
          <PhoneScreen
            initialValue={funnelData.phone}
            onBack={goToPreviousStep}
            onSubmit={({ phone, consent }) => {
              updateFunnelData({ phone, phoneConsent: consent })
              goToNextStep()
            }}
          />
        )
      
      case 'address':
        return (
          <AddressScreen
            initialValue={funnelData.address}
            onBack={goToPreviousStep}
            onSubmit={(address) => {
              updateFunnelData({ address })
              goToNextStep()
            }}
          />
        )
      
      case 'complete':
        return <CompletionScreen funnelData={funnelData} onRestart={() => {
          setFunnelData({})
          setCurrentStep('location')
        }} />
      
      default:
        return null
    }
  }
  
  return renderStep()
}

/**
 * Completion Screen
 * Shows success message after completing the funnel
 */
function CompletionScreen({ 
  funnelData, 
  onRestart 
}: { 
  funnelData: FunnelData
  onRestart: () => void 
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-card max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-feedback-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg 
            className="w-10 h-10 text-feedback-success" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        </div>
        
        {/* Headline */}
        <h1 className="text-headline-lg text-neutral-900 mb-2">
          You&apos;re All Set, {funnelData.firstName}!
        </h1>
        <p className="text-body text-neutral-500 mb-6">
          We&apos;ve received your information and will be in touch shortly with 
          personalized debt relief options.
        </p>
        
        {/* Summary */}
        <div className="bg-neutral-100 rounded-lg p-4 mb-6 text-left">
          <h2 className="text-body font-semibold text-neutral-900 mb-3">
            Your Submission Summary
          </h2>
          <div className="space-y-2 text-body-sm">
            <div className="flex justify-between">
              <span className="text-neutral-500">State</span>
              <span className="text-neutral-900">{funnelData.state}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Debt Type</span>
              <span className="text-neutral-900 capitalize">{funnelData.debtType?.replace('-', ' ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Debt Amount</span>
              <span className="text-neutral-900">${funnelData.debtAmount?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Annual Income</span>
              <span className="text-neutral-900">${funnelData.annualIncome?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Email</span>
              <span className="text-neutral-900">{funnelData.email}</span>
            </div>
          </div>
        </div>
        
        {/* What's Next */}
        <div className="bg-primary-300 rounded-lg p-4 mb-6 text-left">
          <h2 className="text-body font-semibold text-neutral-900 mb-2">
            What&apos;s Next?
          </h2>
          <ul className="text-body-sm text-neutral-800 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-primary-700 font-semibold">1.</span>
              Check your email for your debt relief plan
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-700 font-semibold">2.</span>
              A debt specialist will call you within 24 hours
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-700 font-semibold">3.</span>
              Review and compare your personalized options
            </li>
          </ul>
        </div>
        
        {/* Restart Button */}
        <button
          onClick={onRestart}
          className="w-full bg-primary-700 text-white font-semibold rounded-[8px] px-6 py-3 min-h-[48px] hover:bg-primary-750 transition-colors"
        >
          Start Over
        </button>
        
        {/* Disclaimer */}
        <p className="text-caption text-neutral-500 mt-4">
          Questions? Contact us at support@forbesadvisor.com
        </p>
      </div>
    </div>
  )
}
