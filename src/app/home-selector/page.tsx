'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Truck, DollarSign } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui'

/**
 * Home Selector Page
 *
 * Simple landing page to choose between different lead gen flows
 */
export default function HomeSelectorPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-display-md sm:text-display-lg text-neutral-900 mb-4">
            Choose Your Journey
          </h1>
          <p className="text-body text-neutral-500 mb-12">
            Select the service you&apos;re interested in
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Movers Flow */}
            <div className="bg-white border-2 border-neutral-200 rounded-2xl p-8 hover:border-primary-700 hover:shadow-lg transition-all duration-200">
              <div className="w-16 h-16 rounded-full bg-primary-300 flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-primary-700" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-3">
                Moving Services
              </h2>
              <p className="text-body text-neutral-600 mb-6">
                Compare quotes from top-rated movers. Save time and money on your next move.
              </p>
              <ul className="text-left text-sm text-neutral-700 mb-6 space-y-2">
                <li>✓ Compare up to 5 quotes</li>
                <li>✓ Licensed & insured movers</li>
                <li>✓ Save an average of $400</li>
                <li>✓ Free, no obligation</li>
              </ul>
              <Button
                fullWidth
                onClick={() => router.push('/movers')}
              >
                Get Moving Quotes
              </Button>
            </div>

            {/* Debt Relief Flow */}
            <div className="bg-white border-2 border-neutral-200 rounded-2xl p-8 hover:border-primary-700 hover:shadow-lg transition-all duration-200">
              <div className="w-16 h-16 rounded-full bg-primary-300 flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-primary-700" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-3">
                Debt Relief
              </h2>
              <p className="text-body text-neutral-600 mb-6">
                Get matched with debt relief options. Reduce what you owe by up to 50%.
              </p>
              <ul className="text-left text-sm text-neutral-700 mb-6 space-y-2">
                <li>✓ Reduce debt by 30-50%</li>
                <li>✓ Lower monthly payments</li>
                <li>✓ 24-48 month programs</li>
                <li>✓ No upfront fees</li>
              </ul>
              <Button
                fullWidth
                onClick={() => router.push('/debt-relief')}
              >
                Check Eligibility
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
