'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Star, Shield, Clock } from 'lucide-react'
import { FormLayout } from '@/components/layout/FormLayout'
import { Button, StickyButtonContainer } from '@/components/ui'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type EmailFormData = z.infer<typeof emailSchema>

interface MoversEmailScreenProps {
  initialValue?: string
  onBack?: () => void
  onSubmit?: (email: string) => void
}

const testimonials = [
  {
    name: 'Sarah M.',
    location: 'Chicago, IL',
    text: 'Saved $600 by comparing quotes! The movers were professional and careful with our belongings.',
    rating: 5,
  },
  {
    name: 'Michael T.',
    location: 'Austin, TX',
    text: 'Super easy process. Got 3 quotes within hours and picked the best one for our budget.',
    rating: 5,
  },
  {
    name: 'Jessica R.',
    location: 'Seattle, WA',
    text: 'Moving stress-free! The comparison tool helped me find honest, reliable movers.',
    rating: 5,
  },
]

/**
 * MoversEmailScreen
 *
 * Step 3: Email with social proof and testimonials
 * Features rotating testimonials to build trust
 */
export function MoversEmailScreen({
  initialValue = '',
  onBack,
  onSubmit,
}: MoversEmailScreenProps) {
  const [currentTestimonial, setCurrentTestimonial] = React.useState(0)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: initialValue,
    },
  })

  // Rotate testimonials
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const onFormSubmit = (data: EmailFormData) => {
    onSubmit?.(data.email)
  }

  const testimonial = testimonials[currentTestimonial]

  return (
    <FormLayout currentStep={3} onBack={onBack} showProgress={false}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="animate-slide-up space-y-8 has-sticky-button">
        {/* Headline */}
        <div className="space-y-2 text-center">
          <h1 className="font-display text-display sm:text-display-md lg:text-display-lg text-neutral-900">
            Where should we send your quotes?
          </h1>
          <p className="text-body text-neutral-500">
            Compare quotes from vetted movers in minutes
          </p>
        </div>

        {/* Email Input */}
        <div className="max-w-[410px] mx-auto">
          <Input
            label="Email address"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-4 max-w-[410px] mx-auto">
          <div className="text-center">
            <Mail className="w-6 h-6 text-primary-700 mx-auto mb-2" />
            <p className="text-xs text-neutral-600">No spam ever</p>
          </div>
          <div className="text-center">
            <Shield className="w-6 h-6 text-primary-700 mx-auto mb-2" />
            <p className="text-xs text-neutral-600">100% secure</p>
          </div>
          <div className="text-center">
            <Clock className="w-6 h-6 text-primary-700 mx-auto mb-2" />
            <p className="text-xs text-neutral-600">Quotes in hours</p>
          </div>
        </div>

        {/* Rotating Testimonial */}
        <div
          key={currentTestimonial}
          className="bg-white border border-neutral-200 rounded-xl p-5 max-w-[410px] mx-auto shadow-card animate-fade-in"
        >
          <div className="flex gap-1 mb-3">
            {Array.from({ length: testimonial.rating }).map((_, i) => (
              <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
          <p className="text-sm text-neutral-800 italic mb-3">
            &ldquo;{testimonial.text}&rdquo;
          </p>
          <p className="text-xs text-neutral-500">
            — {testimonial.name}, {testimonial.location}
          </p>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mt-4">
            {testimonials.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentTestimonial(index)}
                className={cn(
                  'h-2 rounded-full transition-all',
                  index === currentTestimonial
                    ? 'bg-primary-700 w-6'
                    : 'bg-neutral-300 w-2'
                )}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Social Proof Numbers */}
        <div className="bg-primary-300 rounded-xl p-5 max-w-[410px] mx-auto">
          <p className="text-sm font-semibold text-neutral-900 text-center mb-3">
            Join 50,000+ happy customers
          </p>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary-700">4.8★</p>
              <p className="text-xs text-neutral-600">Average rating</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-700">98%</p>
              <p className="text-xs text-neutral-600">Would recommend</p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <StickyButtonContainer>
          <Button type="submit" fullWidth showTrailingIcon>
            Get My Quotes
          </Button>
        </StickyButtonContainer>

        {/* Privacy Note */}
        <p className="text-xs text-neutral-500 text-center max-w-[410px] mx-auto">
          We respect your privacy. Your email will only be used to send you moving quotes.
        </p>
      </form>
    </FormLayout>
  )
}

export default MoversEmailScreen
