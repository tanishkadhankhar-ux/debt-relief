'use client'

import * as React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FormLayout } from '@/components/layout/FormLayout'
import { Button, StickyButtonContainer, OTPVerificationModal } from '@/components/ui'
import { Input } from '@/components/ui/Input'
import { Checkbox } from '@/components/ui/Checkbox'
import { formatPhoneNumber } from '@/lib/utils'

// Validation schema
const phoneSchema = z.object({
  phone: z
    .string()
    .regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Please enter a valid phone number'),
  consent: z
    .boolean()
    .refine((val) => val === true, 'You must agree to continue'),
})

type PhoneFormData = z.infer<typeof phoneSchema>

interface PhoneScreenProps {
  initialValue?: string
  onBack?: () => void
  onSubmit?: (data: { phone: string; consent: boolean }) => void
  onSkipOTP?: () => void
}

/**
 * PhoneScreen
 * 
 * Step 9 of the funnel - "Confirm Your phone number"
 * Shows formatted phone input and legal consent checkbox
 * Opens OTP verification modal on submit
 */
export function PhoneScreen({ 
  initialValue = '', 
  onBack, 
  onSubmit,
  onSkipOTP 
}: PhoneScreenProps) {
  const [showOTPModal, setShowOTPModal] = React.useState(false)
  const [pendingFormData, setPendingFormData] = React.useState<PhoneFormData | null>(null)
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: initialValue,
      consent: false,
    },
  })
  
  const phoneValue = watch('phone')
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setValue('phone', formatted, { shouldValidate: true })
  }
  
  // Show OTP modal when form is valid
  const onFormSubmit = (data: PhoneFormData) => {
    setPendingFormData(data)
    setShowOTPModal(true)
  }
  
  // Handle OTP verification (dummy for now)
  const handleOTPVerify = (otp: string) => {
    console.log('OTP verified:', otp)
    setShowOTPModal(false)
    if (pendingFormData) {
      onSubmit?.(pendingFormData)
    }
  }
  
  // Handle OTP skip
  const handleOTPSkip = () => {
    setShowOTPModal(false)
    if (onSkipOTP) {
      onSkipOTP()
    } else if (pendingFormData) {
      onSubmit?.(pendingFormData)
    }
  }
  
  // Handle resend OTP (dummy for now)
  const handleResendOTP = () => {
    console.log('Resending OTP...')
    // In a real implementation, this would trigger an API call
  }
  
  return (
    <FormLayout currentStep={10} onBack={onBack}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="animate-slide-up space-y-6 has-sticky-button">
        {/* Headline */}
        <div className="space-y-2 text-center">
          <h1 className="font-display text-display sm:text-display-md lg:text-display-lg text-neutral-900 text-center">
            Confirm Your phone number
          </h1>
          <p className="text-body text-neutral-500 text-center">
            Enter your phone number to confirm your identity and move one step 
            closer to finding the right debt relief option. We&apos;ll text a 
            one-time code to verify.
          </p>
        </div>
        
        {/* Phone Input */}
        <div>
          <Input
            label="Phone number"
            type="tel"
            placeholder="(555) 555-5555"
            value={phoneValue}
            onChange={handlePhoneChange}
            error={errors.phone?.message}
          />
          <input type="hidden" {...register('phone')} />
        </div>
        
        {/* Legal Consent */}
        <div className="p-4 bg-neutral-100 rounded-lg">
          <Controller
            name="consent"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                label={
                  <span className="text-body-sm text-neutral-800">
                    By clicking &quot;Agree & Continue&quot; I consent to be contacted by 
                    Spinwheel and/or its{' '}
                    <a href="#" className="text-primary-700 underline">
                      marketing partners
                    </a>{' '}
                    using automated technology (including autodialers and pre-recorded 
                    and artificial voice messages) at the phone number I have provided, 
                    which may include my wireless number, for marketing purposes. I 
                    understand that consent is not required to use Spinwheel&apos;s services 
                    and agree to the{' '}
                    <a href="#" className="text-primary-700 underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-primary-700 underline">
                      Privacy Statement
                    </a>
                    . Message and data rates may apply. Message frequency varies.
                  </span>
                }
              />
            )}
          />
          {errors.consent && (
            <p className="mt-2 text-body-sm text-feedback-error" role="alert">
              {errors.consent.message}
            </p>
          )}
        </div>
        
        {/* Submit Button - Sticky on mobile */}
        <StickyButtonContainer>
          <Button type="submit" fullWidth showTrailingIcon>
            Agree & Continue
          </Button>
        </StickyButtonContainer>
      </form>
      
      {/* OTP Verification Modal */}
      <OTPVerificationModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        onVerify={handleOTPVerify}
        onSkip={handleOTPSkip}
        onResend={handleResendOTP}
      />
    </FormLayout>
  )
}

export default PhoneScreen
