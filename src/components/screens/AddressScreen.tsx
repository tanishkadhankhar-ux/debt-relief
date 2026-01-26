'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FormLayout } from '@/components/layout/FormLayout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

// Validation schema
const addressSchema = z.object({
  line1: z.string().min(5, 'Please enter your street address'),
  line2: z.string().optional(),
  zipCode: z.string().regex(/^\d{5}$/, 'Please enter a valid 5-digit zip code'),
})

type AddressFormData = z.infer<typeof addressSchema>

interface AddressScreenProps {
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
 * Shows address fields (line 1, line 2, zip code)
 */
export function AddressScreen({ 
  initialValue, 
  onBack, 
  onSubmit 
}: AddressScreenProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      line1: initialValue?.line1 || '',
      line2: initialValue?.line2 || '',
      zipCode: initialValue?.zipCode || '',
    },
  })
  
  const onFormSubmit = (data: AddressFormData) => {
    onSubmit?.(data)
  }
  
  return (
    <FormLayout currentStep={11} onBack={onBack}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="animate-slide-up space-y-6">
        {/* Headline */}
        <div className="space-y-2 text-center">
          <h1 className="font-display text-display sm:text-display-md lg:text-display-lg text-neutral-900 text-center">
            Your Address
          </h1>
          <p className="text-body text-neutral-500 text-center">
            Your address helps us find the best debt relief options where you 
            live, including protections and benefits.
          </p>
        </div>
        
        {/* Address Fields */}
        <div className="space-y-4">
          <Input
            label="Street Address"
            placeholder="123 Main Street"
            error={errors.line1?.message}
            {...register('line1')}
          />
          
          <Input
            label="Apt, suite, etc. (optional)"
            placeholder="Apartment 4B"
            error={errors.line2?.message}
            {...register('line2')}
          />
          
          <div className="w-full sm:w-1/2">
            <Input
              label="ZIP Code"
              placeholder="12345"
              maxLength={5}
              error={errors.zipCode?.message}
              {...register('zipCode')}
            />
          </div>
        </div>
        
        {/* Submit Button */}
        <Button type="submit" fullWidth>
          See Your Options
        </Button>
        
        {/* Privacy note */}
        <p className="text-caption text-neutral-500 text-center">
          Your address is used to verify your identity and find location-specific 
          debt relief options. We never share your address with third parties 
          without your consent.
        </p>
      </form>
    </FormLayout>
  )
}

export default AddressScreen
