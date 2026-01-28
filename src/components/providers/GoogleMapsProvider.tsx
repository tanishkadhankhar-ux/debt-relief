'use client'

import * as React from 'react'

// Extend Window interface for Google Maps
declare global {
  interface Window {
    google?: {
      maps?: {
        places?: unknown
      }
    }
  }
}

interface GoogleMapsProviderProps {
  children: React.ReactNode
}

/**
 * GoogleMapsProvider
 * 
 * Loads the Google Maps JavaScript API with Places library
 * Required for address autocomplete functionality
 */
export function GoogleMapsProvider({ children }: GoogleMapsProviderProps) {
  const [isLoaded, setIsLoaded] = React.useState(false)

  React.useEffect(() => {
    // Check if already loaded
    if (window.google?.maps?.places) {
      setIsLoaded(true)
      return
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

    if (!apiKey) {
      console.warn('Google Maps API key not found. Address autocomplete will use fallback mode.')
      setIsLoaded(true)
      return
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
    if (existingScript) {
      existingScript.addEventListener('load', () => setIsLoaded(true))
      return
    }

    // Load the script
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = () => setIsLoaded(true)
    script.onerror = () => {
      console.error('Failed to load Google Maps API')
      setIsLoaded(true) // Still render children with fallback
    }

    document.head.appendChild(script)

    return () => {
      // Cleanup is tricky with Google Maps, so we leave the script
    }
  }, [])

  // Always render children - components handle their own loading states
  return <>{children}</>
}

export default GoogleMapsProvider
