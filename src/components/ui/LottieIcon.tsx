'use client'

import Lottie from 'lottie-react'
import { cn } from '@/lib/utils'

interface LottieIconProps {
  animationData: object
  className?: string
}

/**
 * LottieIcon Component
 * 
 * Renders a Lottie animation that auto-plays and loops
 * 
 * @example
 * <LottieIcon 
 *   animationData={creditCardAnimation} 
 *   className="w-32 h-32"
 * />
 */
export function LottieIcon({ 
  animationData, 
  className = 'w-32 h-32'
}: LottieIconProps) {
  return (
    <Lottie
      animationData={animationData}
      loop={true}
      autoplay={true}
      className={cn(className)}
      style={{ width: '100%', height: '100%' }}
    />
  )
}

export default LottieIcon
