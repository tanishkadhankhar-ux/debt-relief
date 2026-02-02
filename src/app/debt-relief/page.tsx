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
  ProcessingScreen,
  DebtProfileScreen,
  EmailScreen,
  PhoneScreen,
  AddressScreen,
  PartnerMatchingScreen,
  ResultsPage,
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
  | 'processing'
  | 'debtProfile'
  | 'email'
  | 'phone'
  | 'address'
  | 'partnerMatching'
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
  'processing',
  'email',
  'debtProfile',
  'phone',
  'address',
  'partnerMatching',
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
  
  // Scroll to top when step changes
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [currentStep])
  
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
      
      case 'processing':
        return (
          <ProcessingScreen
            onNext={goToNextStep}
          />
        )
      
      case 'debtProfile':
        return (
          <DebtProfileScreen
            firstName={funnelData.firstName}
            debtType={funnelData.debtType}
            debtAmount={funnelData.debtAmount || 20000}
            income={funnelData.annualIncome || 50000}
            state={funnelData.state}
            dateOfBirth={funnelData.dateOfBirth}
            initialPhone={funnelData.phone}
            initialShowPhoneForm={!!funnelData.phone}
            onBack={goToPreviousStep}
            onSubmit={() => {
              goToNextStep()
            }}
            onPhoneSubmit={({ phone, consent }) => {
              // Phone form is now embedded in DebtProfileScreen
              // Save phone data and skip to address step
              updateFunnelData({ phone, phoneConsent: consent })
              setCurrentStep('address')
            }}
          />
        )
      
      case 'email':
        return (
          <EmailScreen
            initialValue={funnelData.email}
            firstName={funnelData.firstName}
            debtAmount={funnelData.debtAmount || 20000}
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
            firstName={funnelData.firstName}
            debtAmount={funnelData.debtAmount}
            initialValue={funnelData.address}
            onBack={() => {
              // Skip the standalone phone step - go back to debtProfile with phone form
              setCurrentStep('debtProfile')
            }}
            onSubmit={(address) => {
              updateFunnelData({ address })
              goToNextStep()
            }}
          />
        )
      
      case 'partnerMatching':
        return (
          <PartnerMatchingScreen
            firstName={funnelData.firstName}
            onNext={goToNextStep}
          />
        )
      
      case 'complete':
        return (
          <ResultsPage
            firstName={funnelData.firstName || 'there'}
            debtAmount={funnelData.debtAmount || 20000}
            debtType={funnelData.debtType || 'credit-card'}
            income={funnelData.annualIncome || 50000}
          />
        )
      
      default:
        return null
    }
  }
  
  return renderStep()
}

