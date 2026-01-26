'use client'

import * as React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FormLayout } from '@/components/layout/FormLayout'
import { Button } from '@/components/ui/Button'
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
}

/**
 * PhoneScreen
 * 
 * Step 9 of the funnel - "Confirm Your phone number"
 * Shows formatted phone input and legal consent checkbox
 */
export function PhoneScreen({ 
  initialValue = '', 
  onBack, 
  onSubmit 
}: PhoneScreenProps) {
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
  
  const onFormSubmit = (data: PhoneFormData) => {
    onSubmit?.(data)
  }
  
  return (
    <FormLayout currentStep={10} onBack={onBack}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="animate-slide-up space-y-6">
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
        
        {/* Submit Button */}
        <Button type="submit" fullWidth>
          Agree & Continue
        </Button>
      </form>
    </FormLayout>
  )
}

export default PhoneScreen
