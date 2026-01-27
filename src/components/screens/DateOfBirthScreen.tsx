'use client'

import * as React from 'react'
import { FormLayout } from '@/components/layout/FormLayout'
import { Button } from '@/components/ui/Button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/Select'

interface DateOfBirthScreenProps {
  initialValue?: {
    month: string
    day: string
    year: string
  }
  onBack?: () => void
  onSubmit?: (dob: { month: string; day: string; year: string }) => void
}

// Generate month options
const MONTHS = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
]

// Generate day options (1-31)
const DAYS = Array.from({ length: 31 }, (_, i) => ({
  value: String(i + 1).padStart(2, '0'),
  label: String(i + 1),
}))

// Generate year options (18+ years old, going back 100 years)
const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: 100 }, (_, i) => ({
  value: String(currentYear - 18 - i),
  label: String(currentYear - 18 - i),
}))

/**
 * DateOfBirthScreen
 * 
 * Step 5 of the funnel - "Your date of birth"
 * Shows 3 Select dropdowns (Month, Day, Year) with age validation
 */
export function DateOfBirthScreen({ 
  initialValue, 
  onBack, 
  onSubmit 
}: DateOfBirthScreenProps) {
  const [month, setMonth] = React.useState(initialValue?.month || '')
  const [day, setDay] = React.useState(initialValue?.day || '')
  const [year, setYear] = React.useState(initialValue?.year || '')
  const [error, setError] = React.useState<string | null>(null)
  
  const validateAge = (m: string, d: string, y: string): boolean => {
    if (!m || !d || !y) return false
    
    const birthDate = new Date(`${y}-${m}-${d}`)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age >= 18
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!month || !day || !year) {
      setError('Please select your complete date of birth')
      return
    }
    
    if (!validateAge(month, day, year)) {
      setError('You must be at least 18 years old')
      return
    }
    
    setError(null)
    onSubmit?.({ month, day, year })
  }
  
  // Get number of days in selected month/year
  const getDaysInMonth = (m: string, y: string): number => {
    if (!m || !y) return 31
    return new Date(parseInt(y), parseInt(m), 0).getDate()
  }
  
  const daysInMonth = getDaysInMonth(month, year)
  const filteredDays = DAYS.filter(d => parseInt(d.value) <= daysInMonth)
  
  return (
    <FormLayout currentStep={6} onBack={onBack}>
      <form onSubmit={handleSubmit} className="animate-slide-up space-y-6">
        {/* Headline */}
        <div className="space-y-2 text-center">
          <h1 className="font-display text-display sm:text-display-md lg:text-display-lg text-neutral-900 text-center">
            When were you born?
          </h1>
          <p className="text-body text-neutral-500 text-center">
            Certain debt relief programs have age-based eligibility. This helps us 
            match you with options you actually qualify for.
          </p>
        </div>
        
        {/* Date Selects */}
        <div className="grid grid-cols-3 gap-4">
          {/* Month */}
          <div>
            <label className="block text-body-sm font-medium text-neutral-800 mb-2">
              Month
            </label>
            <Select value={month} onValueChange={(v) => {
              setMonth(v)
              setError(null)
            }}>
              <SelectTrigger error={!!error && !month}>
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Day */}
          <div>
            <label className="block text-body-sm font-medium text-neutral-800 mb-2">
              Day
            </label>
            <Select value={day} onValueChange={(v) => {
              setDay(v)
              setError(null)
            }}>
              <SelectTrigger error={!!error && !day}>
                <SelectValue placeholder="Day" />
              </SelectTrigger>
              <SelectContent>
                {filteredDays.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Year */}
          <div>
            <label className="block text-body-sm font-medium text-neutral-800 mb-2">
              Year
            </label>
            <Select value={year} onValueChange={(v) => {
              setYear(v)
              setError(null)
            }}>
              <SelectTrigger error={!!error && !year}>
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((y) => (
                  <SelectItem key={y.value} value={y.value}>
                    {y.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Error Message */}
        {error && (
          <p className="text-body-sm text-feedback-error" role="alert">
            {error}
          </p>
        )}
        
        {/* Submit Button */}
        <Button type="submit" fullWidth>
          Continue
        </Button>
      </form>
    </FormLayout>
  )
}

export default DateOfBirthScreen
