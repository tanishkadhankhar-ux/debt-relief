'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FormLayout } from '@/components/layout/FormLayout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

// Validation schema
const nameSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .regex(/^[a-zA-Z]+$/, 'First name must contain only letters'),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .regex(/^[a-zA-Z]+$/, 'Last name must contain only letters'),
})

type NameFormData = z.infer<typeof nameSchema>

interface NameScreenProps {
  initialValue?: {
    firstName: string
    lastName: string
  }
  onBack?: () => void
  onSubmit?: (data: { firstName: string; lastName: string }) => void
}

/**
 * NameScreen
 * 
 * Step 6 of the funnel - "Your name"
 * Shows First Name and Last Name inputs side by side on desktop
 */
export function NameScreen({ 
  initialValue, 
  onBack, 
  onSubmit 
}: NameScreenProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NameFormData>({
    resolver: zodResolver(nameSchema),
    defaultValues: {
      firstName: initialValue?.firstName || '',
      lastName: initialValue?.lastName || '',
    },
  })
  
  const onFormSubmit = (data: NameFormData) => {
    onSubmit?.(data)
  }
  
  return (
    <FormLayout currentStep={6} onBack={onBack}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="animate-slide-up space-y-6">
        {/* Headline */}
        <div className="space-y-2 text-center">
          <h1 className="font-display text-display sm:text-display-md lg:text-display-lg text-neutral-900 text-center">
            Your name
          </h1>
          <p className="text-body text-neutral-500 text-center">
            Using your exact first and last name helps verify your identity and 
            create your debt profile, so we can quickly personalize your best 
            debt relief options
          </p>
        </div>
        
        {/* Name Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="First Name"
            placeholder="Enter your first name"
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <Input
            label="Last Name"
            placeholder="Enter your last name"
            error={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>
        
        {/* Submit Button */}
        <Button type="submit" fullWidth>
          Continue
        </Button>
      </form>
    </FormLayout>
  )
}

export default NameScreen
