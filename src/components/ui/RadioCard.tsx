import * as React from 'react'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { cn } from '@/lib/utils'

/**
 * RadioGroup & RadioCard Components
 * 
 * Card-style radio buttons for selections like debt type
 * Uses LLM theme tokens - selected state uses primary-300 background
 * 
 * @example
 * <RadioGroup value={debtType} onValueChange={setDebtType}>
 *   <RadioCard value="credit-card" icon={<CreditCard />}>
 *     Credit card
 *   </RadioCard>
 *   <RadioCard value="loan" icon={<Banknote />}>
 *     Loan
 *   </RadioCard>
 *   <RadioCard value="both">Both</RadioCard>
 * </RadioGroup>
 */

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    ref={ref}
    className={cn('flex flex-col gap-3', className)}
    {...props}
  />
))
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

interface RadioCardProps extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  icon?: React.ReactNode
  description?: string
  children: React.ReactNode
}

const RadioCard = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioCardProps
>(({ className, icon, description, children, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      'group flex flex-col items-center justify-center gap-2 w-full bg-white border border-neutral-200 rounded-[8px]',
      'p-4 cursor-pointer transition-all duration-200 min-h-[100px]',
      'hover:border-primary-700',
      'data-[state=checked]:border-primary-700 data-[state=checked]:bg-primary-300',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  >
    {/* Icon (optional) */}
    {icon && (
      <div className="text-neutral-500 group-data-[state=checked]:text-primary-700">
        {icon}
      </div>
    )}
    
    {/* Content */}
    <div className="text-center">
      <div className="text-body font-medium text-neutral-800">
        {children}
      </div>
      {description && (
        <div className="text-body-sm text-neutral-500 mt-1">
          {description}
        </div>
      )}
    </div>
    
    {/* Custom radio indicator */}
    <div className={cn(
      'flex items-center justify-center w-5 h-5 rounded-full border-2',
      'border-neutral-200 transition-colors duration-200',
      'group-data-[state=checked]:border-primary-700 group-data-[state=checked]:bg-primary-700'
    )}>
      <div className={cn(
        'w-2 h-2 rounded-full bg-white scale-0 transition-transform duration-200',
        'group-data-[state=checked]:scale-100'
      )} />
    </div>
  </RadioGroupPrimitive.Item>
))
RadioCard.displayName = 'RadioCard'

export { RadioGroup, RadioCard }
