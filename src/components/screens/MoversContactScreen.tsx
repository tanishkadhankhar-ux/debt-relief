'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle2, Sparkles, Phone } from 'lucide-react'
import { FormLayout } from '@/components/layout/FormLayout'
import { Button, StickyButtonContainer } from '@/components/ui'
import { Input } from '@/components/ui/Input'
import { formatPhoneNumber, cn } from '@/lib/utils'

const contactSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .regex(/^[a-zA-Z\s]+$/, 'First name must contain only letters'),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Last name must contain only letters'),
  phone: z
    .string()
    .regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Please enter a valid phone number'),
})

type ContactFormData = z.infer<typeof contactSchema>

interface MoversContactScreenProps {
  initialValue?: {
    firstName: string
    lastName: string
    phone: string
  }
  onBack?: () => void
  onSubmit?: (data: { firstName: string; lastName: string; phone: string }) => void
}

const benefits = [
  'Compare up to 5 verified movers',
  'Get personalized quotes instantly',
  'Save an average of $400',
  'Free cancellation anytime',
]

/**
 * MoversContactScreen
 *
 * Step 5 (Final): Name and phone with gamification
 * Features completion progress and benefits list
 */
export function MoversContactScreen({
  initialValue,
  onBack,
  onSubmit,
}: MoversContactScreenProps) {
  const [completionProgress, setCompletionProgress] = React.useState(0)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: initialValue?.firstName || '',
      lastName: initialValue?.lastName || '',
      phone: initialValue?.phone || '',
    },
  })

  const phoneValue = watch('phone')
  const firstNameValue = watch('firstName')
  const lastNameValue = watch('lastName')

  // Calculate completion progress
  React.useEffect(() => {
    let progress = 0
    if (firstNameValue && firstNameValue.length >= 2) progress += 33
    if (lastNameValue && lastNameValue.length >= 2) progress += 33
    if (phoneValue && phoneValue.length === 14) progress += 34
    setCompletionProgress(progress)
  }, [firstNameValue, lastNameValue, phoneValue])

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setValue('phone', formatted, { shouldValidate: true })
  }

  const onFormSubmit = (data: ContactFormData) => {
    onSubmit?.(data)
  }

  return (
    <FormLayout currentStep={5} onBack={onBack} showProgress={false}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="animate-slide-up space-y-8 has-sticky-button">
        {/* Headline with celebration */}
        <div className="space-y-2 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-secondary-500 animate-pulse" />
            <h1 className="font-display text-display sm:text-display-md lg:text-display-lg text-neutral-900">
              Almost there!
            </h1>
            <Sparkles className="w-6 h-6 text-secondary-500 animate-pulse" />
          </div>
          <p className="text-body text-neutral-500">
            Just a few more details to get your personalized moving quotes
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-[410px] mx-auto">
          <div className="flex justify-between text-sm text-neutral-600 mb-2">
            <span>Form completion</span>
            <span className="font-semibold text-primary-700">{completionProgress}%</span>
          </div>
          <div className="h-3 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-700 to-primary-750 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${completionProgress}%` }}
            />
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4 max-w-[410px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="John"
              error={errors.firstName?.message}
              {...register('firstName')}
            />
            <Input
              label="Last Name"
              placeholder="Smith"
              error={errors.lastName?.message}
              {...register('lastName')}
            />
          </div>

          <div>
            <label className="block text-body-sm font-medium text-neutral-800 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 pointer-events-none" />
              <input
                type="tel"
                value={phoneValue}
                onChange={handlePhoneChange}
                placeholder="(555) 555-5555"
                className={cn(
                  'w-full min-h-[48px] pl-10 pr-4 py-3 rounded-[8px] border bg-white',
                  'text-body text-neutral-800 placeholder:text-neutral-500',
                  'focus:outline-none focus:ring-2 focus:ring-focus focus:border-primary-700',
                  errors.phone ? 'border-feedback-error' : 'border-neutral-200'
                )}
              />
            </div>
            {errors.phone && (
              <p className="mt-2 text-body-sm text-feedback-error">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* Benefits List */}
        <div className="bg-primary-300 rounded-xl p-5 max-w-[410px] mx-auto">
          <p className="text-sm font-semibold text-neutral-900 mb-3">
            What happens next:
          </p>
          <div className="space-y-2">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary-700 flex-shrink-0" />
                <span className="text-sm text-neutral-800">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Signals */}
        <div className="grid grid-cols-3 gap-4 max-w-[410px] mx-auto text-center">
          <div>
            <p className="text-xl font-bold text-neutral-900">2 min</p>
            <p className="text-xs text-neutral-600">Average response</p>
          </div>
          <div>
            <p className="text-xl font-bold text-neutral-900">Licensed</p>
            <p className="text-xs text-neutral-600">Verified movers</p>
          </div>
          <div>
            <p className="text-xl font-bold text-neutral-900">$0</p>
            <p className="text-xs text-neutral-600">No booking fees</p>
          </div>
        </div>

        {/* Submit Button */}
        <StickyButtonContainer>
          <Button type="submit" fullWidth>
            Get My Free Quotes
          </Button>
        </StickyButtonContainer>

        {/* Privacy Note */}
        <p className="text-xs text-neutral-500 text-center max-w-[410px] mx-auto">
          By clicking &quot;Get My Free Quotes&quot;, you agree to be contacted by our partner
          moving companies. Standard message and data rates may apply.
        </p>
      </form>
    </FormLayout>
  )
}

export default MoversContactScreen
