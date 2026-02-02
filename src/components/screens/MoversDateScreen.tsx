'use client'

import * as React from 'react'
import { Calendar, TrendingDown, TrendingUp } from 'lucide-react'
import { FormLayout } from '@/components/layout/FormLayout'
import { Button, StickyButtonContainer } from '@/components/ui'
import { cn } from '@/lib/utils'

interface MoversDateScreenProps {
  initialValue?: string
  onBack?: () => void
  onSubmit?: (date: string) => void
}

type DateOption = {
  value: string
  label: string
  description: string
  isPopular?: boolean
  discount?: string
}

/**
 * MoversDateScreen
 *
 * Step 4: When are you moving?
 * Features quick date options with visual indicators for pricing
 */
export function MoversDateScreen({
  initialValue = '',
  onBack,
  onSubmit,
}: MoversDateScreenProps) {
  const [selectedDate, setSelectedDate] = React.useState<string>(initialValue)
  const [customDate, setCustomDate] = React.useState<string>('')
  const [showCustomPicker, setShowCustomPicker] = React.useState(false)

  // Generate date options
  const getDateOptions = (): DateOption[] => {
    const today = new Date()
    const options: DateOption[] = []

    // Within 2 weeks - most expensive
    const twoWeeks = new Date(today)
    twoWeeks.setDate(today.getDate() + 10)
    options.push({
      value: twoWeeks.toISOString().split('T')[0],
      label: 'Within 2 weeks',
      description: twoWeeks.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      isPopular: true,
    })

    // 2-4 weeks - moderate pricing
    const threeWeeks = new Date(today)
    threeWeeks.setDate(today.getDate() + 21)
    options.push({
      value: threeWeeks.toISOString().split('T')[0],
      label: '2-4 weeks',
      description: threeWeeks.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      discount: 'Save 10%',
    })

    // 1-2 months - best pricing
    const twoMonths = new Date(today)
    twoMonths.setMonth(today.getMonth() + 1)
    twoMonths.setDate(15)
    options.push({
      value: twoMonths.toISOString().split('T')[0],
      label: '1-2 months',
      description: twoMonths.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      discount: 'Save 20%',
    })

    // 2+ months - best deals
    const threeMonths = new Date(today)
    threeMonths.setMonth(today.getMonth() + 3)
    options.push({
      value: threeMonths.toISOString().split('T')[0],
      label: '2+ months',
      description: threeMonths.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      discount: 'Save 25%',
    })

    return options
  }

  const dateOptions = getDateOptions()

  const handleSelectOption = (value: string) => {
    setSelectedDate(value)
    setShowCustomPicker(false)
  }

  const handleCustomDate = () => {
    setShowCustomPicker(true)
    setSelectedDate('')
  }

  const handleCustomDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomDate(e.target.value)
    setSelectedDate(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedDate) {
      onSubmit?.(selectedDate)
    }
  }

  // Get minimum date (tomorrow)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  return (
    <FormLayout currentStep={4} onBack={onBack} showProgress={false}>
      <form onSubmit={handleSubmit} className="animate-slide-up space-y-8 has-sticky-button">
        {/* Headline */}
        <div className="space-y-2 text-center">
          <h1 className="font-display text-display sm:text-display-md lg:text-display-lg text-neutral-900">
            When are you planning to move?
          </h1>
          <p className="text-body text-neutral-500">
            Book early and save more on your move
          </p>
        </div>

        {/* Date Options */}
        <div className="space-y-3 max-w-[410px] mx-auto">
          {dateOptions.map((option) => {
            const isSelected = selectedDate === option.value

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelectOption(option.value)}
                className={cn(
                  'w-full p-4 rounded-xl border-2 transition-all duration-200',
                  'hover:scale-102 hover:shadow-md',
                  'focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2',
                  'text-left',
                  isSelected
                    ? 'border-primary-700 bg-primary-300 shadow-md'
                    : 'border-neutral-200 bg-white hover:border-primary-700'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-neutral-900">
                        {option.label}
                      </h3>
                      {option.isPopular && (
                        <span className="px-2 py-0.5 bg-secondary-500 text-neutral-900 text-xs font-medium rounded-full">
                          Most popular
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-500">Around {option.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {option.discount ? (
                      <>
                        <TrendingDown className="w-5 h-5 text-feedback-success" />
                        <span className="text-xs font-semibold text-feedback-success">
                          {option.discount}
                        </span>
                      </>
                    ) : (
                      <TrendingUp className="w-5 h-5 text-neutral-400" />
                    )}
                  </div>
                </div>
              </button>
            )
          })}

          {/* Custom Date Button */}
          <button
            type="button"
            onClick={handleCustomDate}
            className={cn(
              'w-full p-4 rounded-xl border-2 transition-all duration-200',
              'hover:scale-102 hover:shadow-md',
              'focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2',
              'text-left',
              showCustomPicker
                ? 'border-primary-700 bg-primary-300 shadow-md'
                : 'border-neutral-200 bg-white hover:border-primary-700'
            )}
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-neutral-500" />
              <span className="font-semibold text-neutral-900">Choose specific date</span>
            </div>
          </button>

          {/* Custom Date Picker */}
          {showCustomPicker && (
            <div className="animate-fade-in p-4 bg-white border border-neutral-200 rounded-xl">
              <label className="block text-sm font-medium text-neutral-800 mb-2">
                Select your moving date
              </label>
              <input
                type="date"
                value={customDate}
                onChange={handleCustomDateChange}
                min={minDate}
                className="w-full min-h-[48px] px-4 py-3 rounded-[8px] border border-neutral-200 bg-white text-body text-neutral-800 focus:outline-none focus:ring-2 focus:ring-focus focus:border-primary-700"
              />
            </div>
          )}
        </div>

        {/* Pricing Info */}
        <div className="bg-secondary-300 rounded-xl p-5 max-w-[410px] mx-auto">
          <p className="text-sm text-neutral-800 text-center">
            💰 <strong>Pro tip:</strong> Booking 1+ month in advance can save you up to 25%!
            Mid-week moves are also typically less expensive.
          </p>
        </div>

        {/* Submit Button */}
        <StickyButtonContainer>
          <Button
            type="submit"
            fullWidth
            showTrailingIcon
            disabled={!selectedDate}
            className={!selectedDate ? 'opacity-50' : ''}
          >
            Continue
          </Button>
        </StickyButtonContainer>
      </form>
    </FormLayout>
  )
}

export default MoversDateScreen
