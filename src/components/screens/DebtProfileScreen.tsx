'use client'

import * as React from 'react'
import { 
  AlertTriangle, 
  Handshake, 
  TrendingDown, 
  Calendar,
  Users,
  Check,
  HelpCircle
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { TrustBadges } from '@/components/layout/TrustBadges'
import { ProgressIndicator } from '@/components/layout/ProgressIndicator'
import { Button, StickyButtonContainer, OTPVerificationModal } from '@/components/ui'
import { Input } from '@/components/ui/Input'
import { Checkbox } from '@/components/ui/Checkbox'
import { Tooltip } from '@/components/ui/Tooltip'
import { formatCurrency, formatPhoneNumber, cn } from '@/lib/utils'
import type { DebtTypeOption } from '@/types/funnel'
import { US_STATES } from '@/types/funnel'

interface DebtProfileScreenProps {
  firstName?: string
  debtType?: DebtTypeOption
  debtAmount: number
  income: number
  state?: string
  dateOfBirth?: { month: string; day: string; year: string }
  initialPhone?: string
  initialShowPhoneForm?: boolean
  onBack?: () => void
  onSubmit?: () => void
  onPhoneSubmit?: (data: { phone: string; consent: boolean }) => void
}

// Map debt type to display label
const DEBT_TYPE_LABELS: Record<DebtTypeOption, string> = {
  'credit-card': 'Credit Card',
  'personal-loan': 'Personal Loan',
  'both': 'Credit Card & Loan',
}

// Determine ratio badge based on debt-to-income ratio
function getRatioBadge(ratio: number): { label: string; className: string } {
  if (ratio < 30) {
    return { label: 'Low', className: 'bg-green-100 text-green-700' }
  } else if (ratio <= 50) {
    return { label: 'Moderate', className: 'bg-yellow-100 text-yellow-700' }
  } else {
    return { label: 'Elevated', className: 'bg-red-100 text-red-700' }
  }
}

// Calculate age from date of birth
function calculateAge(dob: { month: string; day: string; year: string }): number {
  const birthDate = new Date(`${dob.year}-${dob.month}-${dob.day}`)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

// Get age range bracket
function getAgeRange(age: number): string {
  if (age < 30) return '25-30 years'
  if (age < 40) return '30-40 years'
  if (age < 50) return '40-50 years'
  if (age < 60) return '50-60 years'
  return '60+ years'
}

// Partner logos for carousel
const partnerLogos = [
  { src: '/accredited_logo.png', alt: 'Accredited' },
  { src: '/ClearOne.png', alt: 'ClearOne' },
  { src: '/freedom-debt-relief_logo.png', alt: 'Freedom Debt Relief' },
  { src: '/JGW_logo.png', alt: 'JG Wentworth' },
  { src: '/National_logo.png', alt: 'National Debt Relief' },
]

// Partner Logo Carousel Component
function PartnerCarousel() {
  // Double the logos array for seamless infinite scroll
  const duplicatedLogos = [...partnerLogos, ...partnerLogos]
  
  return (
    <div className="mt-6">
      <p className="text-xs uppercase tracking-wide text-neutral-500 text-center mb-3">
        Trusted partners
      </p>
      <div className="relative overflow-hidden w-full">
        {/* Left fade mask */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        {/* Right fade mask */}
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        {/* Scrolling track */}
        <div className="flex animate-scroll w-max">
          {duplicatedLogos.map((logo, index) => (
            <div 
              key={index} 
              className="flex-shrink-0 px-6 flex items-center"
            >
              <img 
                src={logo.src} 
                alt={logo.alt} 
                className="h-8 w-auto max-w-[120px] object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Phone Number Form Component
interface PhoneFormProps {
  phone: string
  consent: boolean
  phoneError: string
  consentError: string
  onPhoneChange: (value: string) => void
  onConsentChange: (checked: boolean) => void
  onSubmit: (e: React.FormEvent) => void
  isAnimating: boolean
}

function PhoneNumberForm({ 
  phone, 
  consent, 
  phoneError,
  consentError,
  onPhoneChange, 
  onConsentChange, 
  onSubmit,
  isAnimating 
}: PhoneFormProps) {
  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    onPhoneChange(formatted)
  }

  return (
    <div className={cn(
      'transition-all duration-500',
      isAnimating ? 'animate-fade-in-up' : ''
    )}>
      {/* Subheading */}
      <p className="text-body text-neutral-500 mb-8">
        Enter your phone number to confirm your identity and move one step closer to finding the right debt relief option.
      </p>

      <form id="phone-form" onSubmit={onSubmit}>
        {/* Phone Input */}
        <Input
          label="Phone number"
          type="tel"
          value={phone}
          onChange={handlePhoneInput}
          placeholder="(555) 555-5555"
          error={phoneError}
          maxLength={14}
        />

        {/* Consent Checkbox */}
        <div className={cn(
          "bg-gray-50 rounded-xl p-4 mt-4 max-h-[200px] overflow-y-auto",
          consentError && "ring-2 ring-feedback-error"
        )}>
          <Checkbox
            checked={consent}
            onCheckedChange={(checked) => onConsentChange(checked === true)}
            label={
              <span className="text-sm text-neutral-800 leading-relaxed">
                By clicking &quot;Agree &amp; Continue&quot; I consent to be contacted by Spinwheel and/or its{' '}
                <a href="#" className="text-primary-700 underline">marketing partners</a>{' '}
                using automated technology (including autodialers and pre-recorded and artificial voice messages) at the phone number I have provided, which may include my wireless number, for marketing purposes. I understand that consent is not required to use Spinwheel&apos;s services and agree to the{' '}
                <a href="#" className="text-primary-700 underline">Terms of Service</a>{' '}
                and{' '}
                <a href="#" className="text-primary-700 underline">Privacy Statement</a>. Message and data rates may apply. Message frequency varies.
              </span>
            }
          />
        </div>
        {consentError && (
          <p className="mt-2 text-body-sm text-feedback-error" role="alert">
            {consentError}
          </p>
        )}

        {/* CTA Button - Desktop only (inline) */}
        <div className="hidden sm:block mt-6">
          <Button 
            type="submit" 
            fullWidth
          >
            Agree &amp; Continue
          </Button>
        </div>
      </form>

    </div>
  )
}

/**
 * DebtProfileScreen
 * 
 * Personalized debt profile card displayed after email submission.
 * Two-column layout on desktop with image + overlay, stacked on mobile.
 */
export function DebtProfileScreen({ 
  firstName,
  debtType = 'credit-card',
  debtAmount,
  income,
  state,
  dateOfBirth,
  initialPhone = '',
  initialShowPhoneForm = false,
  onBack, 
  onSubmit,
  onPhoneSubmit
}: DebtProfileScreenProps) {
  // State for phone form view
  const [showPhoneForm, setShowPhoneForm] = React.useState(initialShowPhoneForm)
  const [isAnimating, setIsAnimating] = React.useState(false)
  
  // Phone form state
  const [phone, setPhone] = React.useState(initialPhone)
  const [consent, setConsent] = React.useState(!!initialPhone)
  const [phoneError, setPhoneError] = React.useState('')
  const [consentError, setConsentError] = React.useState('')
  
  // OTP modal state
  const [showOTPModal, setShowOTPModal] = React.useState(false)
  
  // Calculate values
  const ratio = Math.round((debtAmount / income) * 100)
  const savings = Math.round(debtAmount * 0.4)
  const ratioBadge = getRatioBadge(ratio)
  
  // Get state label
  const stateLabel = state 
    ? US_STATES.find(s => s.value === state)?.label || state 
    : null
  
  // Calculate age range if DOB provided
  const ageRange = dateOfBirth 
    ? getAgeRange(calculateAge(dateOfBirth))
    : null
  
  // Handle "See My Options" click - transition to phone form
  const handleSeeOptions = (e: React.FormEvent) => {
    e.preventDefault()
    setIsAnimating(true)
    setShowPhoneForm(true)
    // Reset animation flag after animation completes
    setTimeout(() => setIsAnimating(false), 500)
  }
  
  // Handle phone form submission - show OTP modal
  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    let hasError = false
    
    // Validate phone number
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/
    if (!phoneRegex.test(phone)) {
      setPhoneError('Please enter a valid phone number')
      hasError = true
    } else {
      setPhoneError('')
    }
    
    // Validate consent
    if (!consent) {
      setConsentError('You must agree to continue')
      hasError = true
    } else {
      setConsentError('')
    }
    
    if (hasError) {
      return
    }
    
    // Show OTP verification modal
    setShowOTPModal(true)
  }
  
  // Handle OTP verification (dummy for now)
  const handleOTPVerify = (otp: string) => {
    console.log('OTP verified:', otp)
    setShowOTPModal(false)
    onPhoneSubmit?.({ phone, consent })
  }
  
  // Handle OTP skip
  const handleOTPSkip = () => {
    setShowOTPModal(false)
    onPhoneSubmit?.({ phone, consent })
  }
  
  // Handle resend OTP (dummy for now)
  const handleResendOTP = () => {
    console.log('Resending OTP...')
  }
  
  // Clear consent error when user checks the box
  const handleConsentChange = (checked: boolean) => {
    setConsent(checked)
    if (checked) {
      setConsentError('')
    }
  }
  
  // Handle back - if on phone form, go back to profile; otherwise use onBack
  const handleBack = () => {
    if (showPhoneForm) {
      setShowPhoneForm(false)
    } else {
      onBack?.()
    }
  }
  
  const title = firstName ? `Here's your debt profile, ${firstName}` : 'Here\'s your debt profile'
  
  // Build social proof message
  const socialProofMessage = stateLabel && ageRange ? (
    <>
      Your debt profile matches with more than <strong>40,000 people</strong> in <strong>{stateLabel}</strong> who are in the <strong>{ageRange}</strong> age range. Our partners have helped <strong>5 million people</strong> across the US with profiles like yours.
    </>
  ) : (
    <>
      Your debt profile matches thousands of Americans in a similar financial situation. Our partners have helped <strong>5 million people</strong> across the US with profiles like yours.
    </>
  )
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <Header />
      
      {/* Progress Indicator - shown when phone form is visible */}
      {showPhoneForm && (
        <ProgressIndicator currentStep={10} onBack={handleBack} />
      )}
      
      {/* Back button - shown when phone form is NOT visible */}
      {!showPhoneForm && onBack && (
        <div className="w-full bg-white sticky top-12 z-40">
          <div className="h-14 relative max-w-6xl mx-auto px-4 sm:px-6">
            <button
              onClick={handleBack}
              className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 flex items-center gap-2 text-neutral-900 hover:text-primary-700 transition-colors"
              aria-label="Go back"
            >
              <svg 
                width="16" 
                height="24" 
                viewBox="0 0 16 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-6"
              >
                <path 
                  d="M10 6L4 12L10 18" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-sm font-normal leading-5">Back</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Hidden form for profile card submit */}
        {!showPhoneForm && (
          <form id="profile-form" onSubmit={handleSeeOptions} className="contents" />
        )}
        
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-24 sm:pb-8 flex-1">
          {/* Page headline */}
          <h1 className="font-display text-display sm:text-display-md lg:text-display-lg text-neutral-900 text-center mb-8">
            {showPhoneForm 
              ? `Ready to see your options, ${firstName || 'there'}?`
              : `Here's your debt profile, ${firstName || 'there'}`
            }
          </h1>
          
          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            {/* Mobile: Image with overlay OR Phone Form */}
            <div className="lg:hidden">
              {showPhoneForm ? (
                /* Phone Form for Mobile */
                <PhoneNumberForm
                  phone={phone}
                  consent={consent}
                  phoneError={phoneError}
                  consentError={consentError}
                  onPhoneChange={setPhone}
                  onConsentChange={handleConsentChange}
                  onSubmit={handlePhoneSubmit}
                  isAnimating={isAnimating}
                />
              ) : (
                /* Image with overlay */
                <div className="flex flex-col">
                  <div className="relative rounded-2xl overflow-hidden">
                    {/* Image */}
                    <img 
                      src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&auto=format&fit=crop&q=80"
                      alt="Person feeling relieved about their financial situation"
                      className="w-full h-64 object-cover"
                    />
                    
                    {/* Profile ready badge - top right */}
                    <div className="absolute top-4 right-4 inline-flex items-center gap-2 bg-white rounded-full px-3 py-1.5 shadow-sm text-sm">
                      <Check className="w-4 h-4 text-feedback-success" />
                      Profile ready
                    </div>
                    
                    {/* Overlay card - bottom */}
                    <div className="absolute inset-x-4 bottom-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-300 flex items-center justify-center flex-shrink-0">
                          <Users className="w-5 h-5 text-primary-700" />
                        </div>
                        <p className="text-sm text-neutral-800 leading-relaxed">
                          {socialProofMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Partner logos carousel */}
                  <PartnerCarousel />
                </div>
              )}
            </div>
            
            {/* Left Column - Profile Card OR What You'll Receive */}
            <div className="animate-fade-in-up">
              {showPhoneForm ? (
                /* Condensed Profile + Value List Card */
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-gray-100">
                  {/* Mini Title */}
                  <p className="text-xs uppercase tracking-wide text-neutral-500 mb-4">
                    Based on what you told us
                  </p>
                  
                  {/* Potential Savings Box */}
                  <div className="bg-secondary-300 rounded-xl p-5 mb-5">
                    <p className="text-sm text-neutral-500">Potential Savings</p>
                    <p className="text-3xl font-bold text-feedback-success mt-1">
                      {formatCurrency(savings)}*
                    </p>
                    <p className="text-sm text-neutral-500 mt-1">
                      Timeline: 24-36 months
                    </p>
                  </div>
                  
                  {/* Condensed Profile Summary */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-5">
                    {/* Row 1 - Total Debt */}
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-sm text-neutral-500">Total Debt</span>
                      <span className="text-sm font-semibold text-neutral-800">
                        {formatCurrency(debtAmount)}
                      </span>
                    </div>
                    
                    {/* Row 2 - Debt Type */}
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-sm text-neutral-500 flex items-center gap-1">
                        Debt Type
                        <Tooltip content="Based on your selection earlier. This determines which relief programs may be the best fit for you.">
                          <HelpCircle className="w-3.5 h-3.5 text-neutral-400 hover:text-neutral-600 transition-colors" />
                        </Tooltip>
                      </span>
                      <span className="text-sm font-semibold text-neutral-800">
                        {DEBT_TYPE_LABELS[debtType]}
                      </span>
                    </div>
                    
                    {/* Row 3 - DTI Ratio */}
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-neutral-500 flex items-center gap-1">
                        DTI Ratio
                        <Tooltip content={`Your debt-to-income ratio is calculated by dividing your total debt (${formatCurrency(debtAmount)}) by your annual income (${formatCurrency(income)}). A higher ratio often means debt relief programs can help more.`}>
                          <HelpCircle className="w-3.5 h-3.5 text-neutral-400 hover:text-neutral-600 transition-colors" />
                        </Tooltip>
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-neutral-800">{ratio}%</span>
                        <span className={cn(
                          'px-2 py-0.5 rounded-full text-xs font-medium',
                          ratioBadge.className
                        )}>
                          {ratioBadge.label}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Value List Header */}
                  <p className="text-sm font-semibold text-neutral-900 mb-3">
                    Verify to unlock:
                  </p>
                  
                  {/* Value List */}
                  <div className="space-y-2">
                    {[
                      "Personalized debt relief options",
                      "Side-by-side partner comparison",
                      "No obligation — compare and decide"
                    ].map((title, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-feedback-success flex-shrink-0" />
                        <p className="text-sm text-neutral-800">{title}</p>
                      </div>
                    ))}
                  </div>
                  
                  {/* Disclaimer */}
                  <p className="text-xs text-neutral-400 mt-4">
                    *Estimated savings. Results vary.
                  </p>
                </div>
              ) : (
                /* Debt Profile Card */
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-gray-100">
                  {/* Stats Box */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    {/* Row 1 - Debt-to-Income Ratio (highlighted) */}
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-neutral-500" />
                        <span className="text-sm text-neutral-800">Debt-to-Income Ratio</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-900">{ratio}%</span>
                        <span className={cn(
                          'px-2 py-0.5 rounded-full text-xs font-medium',
                          ratioBadge.className
                        )}>
                          {ratioBadge.label}
                        </span>
                      </div>
                    </div>
                    
                    {/* Row 2 - Debt Type */}
                    <div className="flex justify-between py-3 border-b border-gray-200">
                      <span className="text-sm text-neutral-800">Debt Type</span>
                      <span className="font-semibold text-neutral-900">
                        {DEBT_TYPE_LABELS[debtType]}
                      </span>
                    </div>
                    
                    {/* Row 3 - Total Debt */}
                    <div className="flex justify-between py-3 border-b border-gray-200">
                      <span className="text-sm text-neutral-800">Total Debt</span>
                      <span className="font-semibold text-neutral-900">
                        {formatCurrency(debtAmount)}
                      </span>
                    </div>
                    
                    {/* Row 4 - Annual Income */}
                    <div className="flex justify-between pt-3">
                      <span className="text-sm text-neutral-800">Annual Income</span>
                      <span className="font-semibold text-neutral-900">
                        {formatCurrency(income)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Recommended Approach */}
                  <div className="mt-6">
                    <p className="text-xs uppercase tracking-wide text-neutral-500 mb-3">
                      Recommended Approach
                    </p>
                    <div className="inline-flex flex-wrap gap-2">
                      <span className="bg-primary-300 text-primary-700 px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5">
                        <Handshake className="w-4 h-4" />
                        Debt Negotiation
                      </span>
                      <span className="bg-primary-300 text-primary-700 px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5">
                        <TrendingDown className="w-4 h-4" />
                        Lower Interest
                      </span>
                      <span className="bg-primary-300 text-primary-700 px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        Payment Plan
                      </span>
                    </div>
                  </div>
                  
                  {/* Savings Box */}
                  <div className="bg-secondary-300 rounded-xl p-4 mt-6">
                    <p className="text-neutral-500 text-sm">Potential Savings</p>
                    <p className="text-2xl font-bold text-feedback-success">
                      {formatCurrency(savings)}
                    </p>
                    <p className="text-neutral-500 text-sm mt-1">
                      Timeline: 24-36 months
                    </p>
                  </div>
                  
                  {/* Partner logos carousel - Desktop only, moved from right panel */}
                  <div className="hidden lg:block">
                    <PartnerCarousel />
                  </div>
                </div>
              )}
            </div>
            
            {/* Right Column - Image with overlay OR Phone Form (Desktop only) */}
            <div className="hidden lg:block">
              {showPhoneForm ? (
                /* Phone Form for Desktop */
                <PhoneNumberForm
                  phone={phone}
                  consent={consent}
                  phoneError={phoneError}
                  consentError={consentError}
                  onPhoneChange={setPhone}
                  onConsentChange={handleConsentChange}
                  onSubmit={handlePhoneSubmit}
                  isAnimating={isAnimating}
                />
              ) : (
                /* Image with overlay + CTA Button */
                <div className="flex flex-col">
                  <div className="relative rounded-2xl overflow-hidden">
                    {/* Image */}
                    <img 
                      src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&auto=format&fit=crop&q=80"
                      alt="Person feeling relieved about their financial situation"
                      className="w-full h-96 object-cover"
                    />
                    
                    {/* Profile ready badge - top right */}
                    <div className="absolute top-4 right-4 inline-flex items-center gap-2 bg-white rounded-full px-3 py-1.5 shadow-sm text-sm">
                      <Check className="w-4 h-4 text-feedback-success" />
                      Profile ready
                    </div>
                    
                    {/* Overlay card - bottom */}
                    <div className="absolute inset-x-4 bottom-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-300 flex items-center justify-center flex-shrink-0">
                          <Users className="w-5 h-5 text-primary-700" />
                        </div>
                        <p className="text-sm text-neutral-800 leading-relaxed">
                          {socialProofMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* CTA Button - below image on desktop */}
                  <div className="mt-6">
                    <Button type="submit" form="profile-form" fullWidth showTrailingIcon>
                      See My Options
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
        </div>
        
        {/* CTA Button - Sticky on mobile only, outside of animated container */}
        {!showPhoneForm ? (
          <StickyButtonContainer className="sm:hidden">
            <Button type="submit" form="profile-form" fullWidth showTrailingIcon>
              See My Options
            </Button>
          </StickyButtonContainer>
        ) : (
          <StickyButtonContainer className="sm:hidden">
            <Button type="submit" form="phone-form" fullWidth>
              Agree &amp; Continue
            </Button>
          </StickyButtonContainer>
        )}
      </main>
      
      {/* Trust Badges */}
      <TrustBadges />
      
      {/* Footer */}
      <Footer />
      
      {/* OTP Verification Modal */}
      <OTPVerificationModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        onVerify={handleOTPVerify}
        onSkip={handleOTPSkip}
        onResend={handleResendOTP}
      />
    </div>
  )
}

export default DebtProfileScreen
