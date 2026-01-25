import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface HeaderProps {
  className?: string
}

/**
 * Header Component
 * 
 * Forbes Advisor branded header with logo
 * Centered layout with box shadow
 * 
 * @example
 * <Header />
 */
export function Header({ className }: HeaderProps) {
  return (
    <header 
      className={cn(
        'w-full bg-white sticky top-0 z-50',
        className
      )}
      style={{
        boxShadow: '0 0 1px 0 rgba(0, 0, 0, 0.05), 0 4px 8px -1px rgba(0, 0, 0, 0.10)'
      }}
    >
      <div className="w-full max-w-[1440px] mx-auto h-12 px-20 flex justify-center items-center gap-2.5">
        {/* Forbes Advisor Logo */}
        <Image
          src="/forbes-advisor-logo.svg"
          alt="Forbes Advisor"
          width={167}
          height={21}
          priority
        />
      </div>
    </header>
  )
}

export default Header
