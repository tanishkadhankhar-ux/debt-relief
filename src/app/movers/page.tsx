'use client'

import * as React from 'react'
import { createClient } from '@supabase/supabase-js'
import {
  MoversLocationScreen,
  MoversRoomSizeScreen,
  MoversEmailScreen,
  MoversDateScreen,
  MoversContactScreen,
  MoversThankYouScreen,
} from '@/components/screens'
import type { MoversData, RoomSizeOption } from '@/types/movers'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Funnel steps
type FunnelStep = 'location' | 'roomSize' | 'email' | 'moveDate' | 'contact' | 'thankYou'

const STEP_ORDER: FunnelStep[] = [
  'location',
  'roomSize',
  'email',
  'moveDate',
  'contact',
  'thankYou',
]

/**
 * Movers Page - Funnel Orchestrator
 *
 * Manages the state and navigation between all movers funnel screens
 */
export default function MoversPage() {
  const [currentStep, setCurrentStep] = React.useState<FunnelStep>('location')
  const [funnelData, setFunnelData] = React.useState<MoversData>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)

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
  const updateFunnelData = (data: Partial<MoversData>) => {
    setFunnelData((prev) => ({ ...prev, ...data }))
  }

  // Submit to Supabase
  const submitLead = async (finalData: MoversData) => {
    setIsSubmitting(true)
    try {
      const { error } = await supabase.from('moving_leads').insert([
        {
          from_location: finalData.fromLocation!,
          to_location: finalData.toLocation!,
          rooms: finalData.rooms!,
          email: finalData.email!,
          move_date: finalData.moveDate!,
          first_name: finalData.firstName!,
          last_name: finalData.lastName!,
          phone: finalData.phone!,
        },
      ])

      if (error) {
        console.error('Error submitting lead:', error)
        // Still proceed to thank you page even if submission fails
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
      goToNextStep()
    }
  }

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 'location':
        return (
          <MoversLocationScreen
            initialFrom={funnelData.fromLocation}
            initialTo={funnelData.toLocation}
            onSubmit={({ from, to }) => {
              updateFunnelData({ fromLocation: from, toLocation: to })
              goToNextStep()
            }}
          />
        )

      case 'roomSize':
        return (
          <MoversRoomSizeScreen
            initialValue={funnelData.rooms}
            fromLocation={funnelData.fromLocation}
            toLocation={funnelData.toLocation}
            onBack={goToPreviousStep}
            onSubmit={(rooms: RoomSizeOption) => {
              updateFunnelData({ rooms })
              goToNextStep()
            }}
          />
        )

      case 'email':
        return (
          <MoversEmailScreen
            initialValue={funnelData.email}
            onBack={goToPreviousStep}
            onSubmit={(email) => {
              updateFunnelData({ email })
              goToNextStep()
            }}
          />
        )

      case 'moveDate':
        return (
          <MoversDateScreen
            initialValue={funnelData.moveDate}
            onBack={goToPreviousStep}
            onSubmit={(moveDate) => {
              updateFunnelData({ moveDate })
              goToNextStep()
            }}
          />
        )

      case 'contact':
        return (
          <MoversContactScreen
            initialValue={
              funnelData.firstName && funnelData.lastName && funnelData.phone
                ? {
                    firstName: funnelData.firstName,
                    lastName: funnelData.lastName,
                    phone: funnelData.phone,
                  }
                : undefined
            }
            onBack={goToPreviousStep}
            onSubmit={({ firstName, lastName, phone }) => {
              const finalData = {
                ...funnelData,
                firstName,
                lastName,
                phone,
              }
              updateFunnelData({ firstName, lastName, phone })
              submitLead(finalData)
            }}
          />
        )

      case 'thankYou':
        return (
          <MoversThankYouScreen
            firstName={funnelData.firstName}
            email={funnelData.email}
          />
        )

      default:
        return null
    }
  }

  return (
    <>
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 shadow-xl text-center">
            <div className="w-16 h-16 border-4 border-primary-700 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-lg font-semibold text-neutral-900">
              Submitting your information...
            </p>
          </div>
        </div>
      )}
      {renderStep()}
    </>
  )
}
