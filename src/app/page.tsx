'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Home Page - Redirects to Movers Flow
 *
 * Main landing page redirects to the movers lead generation flow
 * Visit /debt-relief for the debt relief flow
 * Visit /home-selector for a choice between flows
 */
export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.push('/movers')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary-700 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-body text-neutral-500">Loading...</p>
      </div>
    </div>
  )
}
