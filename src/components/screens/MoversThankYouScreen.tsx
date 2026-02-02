'use client'

import * as React from 'react'
import { CheckCircle2, Mail, Phone, Clock, TrendingDown } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui'

interface MoversThankYouScreenProps {
  firstName?: string
  email?: string
}

/**
 * MoversThankYouScreen
 *
 * Success page after form submission
 * Shows confirmation and next steps
 */
export function MoversThankYouScreen({
  firstName = 'there',
  email,
}: MoversThankYouScreenProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-2xl mx-auto text-center animate-slide-up">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-feedback-success/10 mb-6">
            <CheckCircle2 className="w-12 h-12 text-feedback-success" />
          </div>

          {/* Headline */}
          <h1 className="font-display text-display-md sm:text-display-lg text-neutral-900 mb-4">
            Thanks, {firstName}! Your quotes are on the way 🎉
          </h1>
          <p className="text-body text-neutral-500 mb-8">
            We&apos;re matching you with the best movers for your needs.
            You&apos;ll start receiving personalized quotes shortly.
          </p>

          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-primary-300 rounded-xl p-5">
              <Mail className="w-8 h-8 text-primary-700 mx-auto mb-3" />
              <h3 className="font-semibold text-neutral-900 mb-1">Check your email</h3>
              <p className="text-sm text-neutral-600">
                {email ? `Quotes sent to ${email}` : 'Quotes sent to your email'}
              </p>
            </div>

            <div className="bg-primary-300 rounded-xl p-5">
              <Phone className="w-8 h-8 text-primary-700 mx-auto mb-3" />
              <h3 className="font-semibold text-neutral-900 mb-1">Expect a call</h3>
              <p className="text-sm text-neutral-600">
                Movers may contact you directly for details
              </p>
            </div>

            <div className="bg-primary-300 rounded-xl p-5">
              <Clock className="w-8 h-8 text-primary-700 mx-auto mb-3" />
              <h3 className="font-semibold text-neutral-900 mb-1">Quick response</h3>
              <p className="text-sm text-neutral-600">
                Most quotes arrive within 2-4 hours
              </p>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-secondary-300 rounded-xl p-6 text-left mb-8">
            <h3 className="font-semibold text-neutral-900 mb-4 text-center">
              What happens next:
            </h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-700 text-white flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <p className="text-sm text-neutral-800">
                  <strong>Review quotes:</strong> Compare offers from multiple movers
                </p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-700 text-white flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <p className="text-sm text-neutral-800">
                  <strong>Ask questions:</strong> Contact movers directly for clarification
                </p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-700 text-white flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <p className="text-sm text-neutral-800">
                  <strong>Book your move:</strong> Choose the best mover for your needs
                </p>
              </div>
            </div>
          </div>

          {/* Pro Tips */}
          <div className="bg-white border border-neutral-200 rounded-xl p-6 text-left">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown className="w-5 h-5 text-feedback-success" />
              <h3 className="font-semibold text-neutral-900">Pro tips to save more:</h3>
            </div>
            <ul className="space-y-2 text-sm text-neutral-700">
              <li>• Book mid-week moves (Tuesday-Thursday) for better rates</li>
              <li>• Declutter before moving to reduce volume and cost</li>
              <li>• Pack yourself to save on packing services</li>
              <li>• Ask about discounts for flexible moving dates</li>
            </ul>
          </div>

          {/* CTA */}
          <div className="mt-8">
            <Button
              type="button"
              variant="secondary"
              onClick={() => window.location.href = '/'}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default MoversThankYouScreen
