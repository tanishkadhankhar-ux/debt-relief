'use client'

import * as React from 'react'
import { Check, ShieldCheck, Edit3 } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { TrustBadges } from '@/components/layout/TrustBadges'
import { ProgressIndicator } from '@/components/layout/ProgressIndicator'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { AddressAutocomplete, type ParsedAddress } from '@/components/ui/AddressAutocomplete'
import { formatCurrency, cn } from '@/lib/utils'

interface AddressScreenProps {
  firstName?: string
  debtAmount?: number
  initialValue?: {
    line1: string
    line2?: string
    zipCode: string
  }
  onBack?: () => void
  onSubmit?: (address: { line1: string; line2?: string; zipCode: string }) => void
}

/**
 * AddressScreen
 * 
 * Step 10 of the funnel - "Your Address"
 * Two-column layout with context card and smart address autocomplete
 */
export function AddressScreen({ 
  firstName,
  debtAmount = 25000,
  initialValue, 
  onBack, 
  onSubmit 
}: AddressScreenProps) {
  // Form state
  const [selectedAddress, setSelectedAddress] = React.useState<ParsedAddress | null>(
    initialValue ? {
      street: initialValue.line1,
      city: '',
      state: '',
      zip: initialValue.zipCode,
      apt: initialValue.line2,
    } : null
  )
  const [isManualEntry, setIsManualEntry] = React.useState(!!initialValue)
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  
  // Manual entry form state
  const [manualStreet, setManualStreet] = React.useState(initialValue?.line1 || '')
  const [manualCity, setManualCity] = React.useState('')
  const [manualState, setManualState] = React.useState('')
  const [manualZip, setManualZip] = React.useState(initialValue?.zipCode || '')
  const [manualApt, setManualApt] = React.useState(initialValue?.line2 || '')
  
  // Calculate savings (40% reduction estimate)
  const savings = Math.round(debtAmount * 0.4)
  
  // Handle address selection from autocomplete
  const handleAddressSelect = (address: ParsedAddress) => {
    setSelectedAddress(address)
    setErrors({})
  }
  
  // Update selected address fields
  const updateAddressField = (field: keyof ParsedAddress, value: string) => {
    if (selectedAddress) {
      setSelectedAddress({ ...selectedAddress, [field]: value })
    }
  }
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (isManualEntry) {
      if (!manualStreet || manualStreet.length < 5) {
        newErrors.street = 'Please enter your street address'
      }
      if (!manualCity || manualCity.length < 2) {
        newErrors.city = 'Please enter your city'
      }
      if (!manualState || manualState.length < 2) {
        newErrors.state = 'Please enter your state'
      }
      if (!manualZip || !/^\d{5}$/.test(manualZip)) {
        newErrors.zip = 'Please enter a valid 5-digit ZIP code'
      }
    } else if (selectedAddress) {
      if (!selectedAddress.street || selectedAddress.street.length < 5) {
        newErrors.street = 'Please enter your street address'
      }
      if (!selectedAddress.zip || !/^\d{5}$/.test(selectedAddress.zip)) {
        newErrors.zip = 'Please enter a valid 5-digit ZIP code'
      }
    } else {
      newErrors.address = 'Please enter your address'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    if (isManualEntry) {
      onSubmit?.({
        line1: `${manualStreet}, ${manualCity}, ${manualState}`,
        line2: manualApt || undefined,
        zipCode: manualZip,
      })
    } else if (selectedAddress) {
      onSubmit?.({
        line1: `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}`,
        line2: selectedAddress.apt || undefined,
        zipCode: selectedAddress.zip,
      })
    }
  }
  
  // Switch to manual entry
  const enableManualEntry = () => {
    setIsManualEntry(true)
    if (selectedAddress) {
      setManualStreet(selectedAddress.street)
      setManualCity(selectedAddress.city)
      setManualState(selectedAddress.state)
      setManualZip(selectedAddress.zip)
      setManualApt(selectedAddress.apt || '')
    }
  }
  
  // "Why we ask" reasons
  const whyWeAskReasons = [
    "Find state-specific debt relief programs",
    "Verify your identity securely",
    "Connect you with local partners"
  ]
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <Header />
      
      {/* Progress Indicator */}
      <ProgressIndicator currentStep={11} onBack={onBack} />
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 flex-1">
          {/* Page Headline - Celebratory momentum */}
          <h1 className="font-display text-display sm:text-display-md lg:text-display-lg text-neutral-900 text-center mb-8">
            {firstName ? `You're on your way to debt relief, ${firstName}.` : "You're on your way to debt relief."}
          </h1>
          
          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            {/* Left Column - Context Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 order-1 lg:order-none">
              {/* Section Label */}
              <p className="text-xs uppercase tracking-wide text-neutral-500 mb-4">
                One last step
              </p>
              
              {/* Savings Reminder */}
              <div className="bg-secondary-300 rounded-xl p-4 mb-5">
                <p className="text-sm text-neutral-500">Potential Savings</p>
                <p className="text-2xl font-bold text-feedback-success mt-1">
                  {formatCurrency(savings)}*
                </p>
                <p className="text-sm text-neutral-500 mt-1">
                  Timeline: 24-36 months
                </p>
              </div>
              
              {/* Why We Ask */}
              <p className="text-sm font-semibold text-neutral-900 mb-3">
                Why we need your address:
              </p>
              
              <div className="space-y-2">
                {whyWeAskReasons.map((reason, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-feedback-success flex-shrink-0" />
                    <p className="text-sm text-neutral-800">{reason}</p>
                  </div>
                ))}
              </div>
              
              {/* Privacy Assurance */}
              <div className="flex items-start gap-2 mt-4 pt-4 border-t border-gray-100">
                <ShieldCheck className="w-5 h-5 text-primary-700 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-neutral-500">
                  Your address is never shared without your consent.
                </p>
              </div>
              
              {/* Disclaimer */}
              <p className="text-xs text-neutral-500 mt-4">
                *Estimated savings. Results vary.
              </p>
            </div>
            
            {/* Right Column - Address Form */}
            <div className="order-2 lg:order-none">
              <form onSubmit={handleSubmit} className="animate-slide-up">
                {/* Subheading */}
                <p className="text-neutral-500 text-sm mb-6">
                  Your address helps us find the best debt relief options where you 
                  live, including protections and benefits.
                </p>
                
                {!isManualEntry ? (
                  <>
                    {/* Smart Address Autocomplete */}
                    <AddressAutocomplete 
                      onAddressSelect={handleAddressSelect}
                      error={errors.address}
                    />
                    
                    {/* Manual entry link */}
                    <button
                      type="button"
                      onClick={enableManualEntry}
                      className="mt-2 text-sm text-primary-700 hover:text-primary-750 underline flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      Enter address manually
                    </button>
                    
                    {/* Expanded fields after selection */}
                    {selectedAddress && (
                      <div className="mt-6 space-y-4 animate-fade-in">
                        {/* Street Address - pre-filled, editable */}
                        <Input
                          label="Street Address"
                          value={selectedAddress.street}
                          onChange={(e) => updateAddressField('street', e.target.value)}
                          error={errors.street}
                        />
                        
                        {/* City, State, ZIP in a row */}
                        <div className="grid grid-cols-3 gap-3">
                          <Input
                            label="City"
                            value={selectedAddress.city}
                            onChange={(e) => updateAddressField('city', e.target.value)}
                            error={errors.city}
                          />
                          <Input
                            label="State"
                            value={selectedAddress.state}
                            onChange={(e) => updateAddressField('state', e.target.value)}
                            error={errors.state}
                          />
                          <Input
                            label="ZIP Code"
                            value={selectedAddress.zip}
                            onChange={(e) => updateAddressField('zip', e.target.value)}
                            maxLength={5}
                            error={errors.zip}
                          />
                        </div>
                        
                        {/* Apt/Suite - always optional */}
                        <Input
                          label="Apt, suite, etc. (optional)"
                          placeholder="Apartment 4B"
                          value={selectedAddress.apt || ''}
                          onChange={(e) => updateAddressField('apt', e.target.value)}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  /* Manual Entry Mode */
                  <div className="space-y-4 animate-fade-in">
                    <Input
                      label="Street Address"
                      placeholder="123 Main Street"
                      value={manualStreet}
                      onChange={(e) => setManualStreet(e.target.value)}
                      error={errors.street}
                    />
                    
                    {/* City, State, ZIP in a row */}
                    <div className="grid grid-cols-3 gap-3">
                      <Input
                        label="City"
                        placeholder="New York"
                        value={manualCity}
                        onChange={(e) => setManualCity(e.target.value)}
                        error={errors.city}
                      />
                      <Input
                        label="State"
                        placeholder="NY"
                        value={manualState}
                        onChange={(e) => setManualState(e.target.value)}
                        maxLength={2}
                        error={errors.state}
                      />
                      <Input
                        label="ZIP Code"
                        placeholder="10001"
                        value={manualZip}
                        onChange={(e) => setManualZip(e.target.value)}
                        maxLength={5}
                        error={errors.zip}
                      />
                    </div>
                    
                    {/* Apt/Suite - always optional */}
                    <Input
                      label="Apt, suite, etc. (optional)"
                      placeholder="Apartment 4B"
                      value={manualApt}
                      onChange={(e) => setManualApt(e.target.value)}
                    />
                  </div>
                )}
                
                {/* Submit Button */}
                <Button 
                  type="submit" 
                  fullWidth 
                  className={cn(
                    'mt-6',
                    !isManualEntry && !selectedAddress && 'opacity-50'
                  )}
                  disabled={!isManualEntry && !selectedAddress}
                >
                  See Your Options
                </Button>
                
                {/* Privacy Note */}
                <p className="text-xs text-neutral-500 mt-4 text-center">
                  Your address is used to verify your identity and find location-specific 
                  debt relief options. We never share your address with third parties 
                  without your consent.
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>
      
      {/* Trust Badges */}
      <TrustBadges />
      
      {/* Footer */}
      <Footer />
    </div>
  )
}

export default AddressScreen
