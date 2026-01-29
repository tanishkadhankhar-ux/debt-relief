'use client'

import * as React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, ShieldCheck, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './Button'

interface OTPVerificationModalProps {
  isOpen: boolean
  onClose: () => void
  onVerify: (otp: string) => void
  onSkip?: () => void
  onResend?: () => void
}

/**
 * OTPVerificationModal
 * 
 * A modal dialog for verifying phone numbers via 6-digit OTP code.
 * Features auto-focus navigation between input fields.
 */
export function OTPVerificationModal({
  isOpen,
  onClose,
  onVerify,
  onSkip,
  onResend,
}: OTPVerificationModalProps) {
  const [otp, setOtp] = React.useState<string[]>(Array(6).fill(''))
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])
  
  // Focus first input when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setOtp(Array(6).fill(''))
      setTimeout(() => {
        inputRefs.current[0]?.focus()
      }, 100)
    }
  }, [isOpen])
  
  const handleChange = (index: number, value: string) => {
    // Only allow single digit
    if (value.length > 1) {
      value = value.slice(-1)
    }
    
    // Only allow numbers
    if (value && !/^\d$/.test(value)) {
      return
    }
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    
    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }
  
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace - move to previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    
    // Handle left arrow
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    
    // Handle right arrow
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }
  
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    
    if (pastedData) {
      const newOtp = [...otp]
      pastedData.split('').forEach((char, index) => {
        if (index < 6) {
          newOtp[index] = char
        }
      })
      setOtp(newOtp)
      
      // Focus the next empty input or the last one
      const nextEmptyIndex = newOtp.findIndex(val => !val)
      if (nextEmptyIndex !== -1) {
        inputRefs.current[nextEmptyIndex]?.focus()
      } else {
        inputRefs.current[5]?.focus()
      }
    }
  }
  
  const handleSubmit = () => {
    const otpString = otp.join('')
    if (otpString.length === 6) {
      onVerify(otpString)
    }
  }
  
  const isComplete = otp.every(digit => digit !== '')
  
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-32px)] max-w-[440px] bg-white rounded-lg shadow-xl animate-in fade-in zoom-in-95 duration-200 focus:outline-none">
          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-2">
              <Dialog.Title className="font-display text-[28px] sm:text-[32px] leading-tight text-neutral-900">
                Verify your number
              </Dialog.Title>
              <Dialog.Close asChild>
                <button 
                  className="flex-shrink-0 p-1 rounded-md hover:bg-neutral-100 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-6 h-6 text-neutral-900" />
                </button>
              </Dialog.Close>
            </div>
            
            <Dialog.Description className="text-sm text-neutral-800 mb-6">
              We&apos;ve sent a 6-digit OTP to your number. Enter it below to continue.
            </Dialog.Description>
            
            {/* OTP Input Fields */}
            <div className="flex justify-center gap-2 sm:gap-3 mb-3" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => { inputRefs.current[index] = el }}
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={cn(
                    "w-[48px] h-[56px] sm:w-[54px] sm:h-[64px] text-center text-xl font-medium",
                    "bg-white border border-neutral-300 rounded-lg",
                    "focus:outline-none focus:ring-2 focus:ring-primary-700 focus:border-primary-700",
                    "transition-all duration-200",
                    digit ? "text-neutral-900" : "text-neutral-400"
                  )}
                  placeholder="0"
                />
              ))}
            </div>
            
            {/* Secured Badge */}
            <div className="flex items-center gap-1.5 mb-4">
              <ShieldCheck className="w-4 h-4 text-feedback-success" />
              <span className="text-xs font-semibold text-feedback-success">
                Secured by Forbes.com
              </span>
            </div>
            
            {/* Resend OTP */}
            <div className="flex items-center gap-1 mb-4">
              <span className="text-base font-medium text-neutral-900">
                Didn&apos;t receive it?
              </span>
              <button 
                type="button"
                onClick={onResend}
                className="text-base font-bold text-primary-700 hover:underline"
              >
                Resend OTP
              </button>
            </div>
            
            {/* Info Box */}
            <div className="flex items-start gap-2 p-3 bg-[#F0F3FF] rounded-sm mb-6">
              <CheckCircle className="w-4 h-4 text-[#0D2B23] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[#0D2B23] leading-relaxed">
                We need to verify your phone number to protect your information and connect you with the most suitable partners
              </p>
            </div>
            
            {/* Next Button */}
            <Button 
              type="button"
              fullWidth 
              showTrailingIcon
              onClick={handleSubmit}
              disabled={!isComplete}
            >
              Next
            </Button>
            
            {/* Skip Link */}
            <button
              type="button"
              onClick={onSkip}
              className="w-full text-center text-sm font-semibold text-neutral-500 mt-4 hover:text-neutral-700 transition-colors"
            >
              Skip for now
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default OTPVerificationModal
