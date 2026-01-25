/**
 * Funnel Data Types
 * 
 * Type definitions for the debt relief lead gen funnel
 */

export type DebtTypeOption = 'credit-card' | 'personal-loan' | 'both'

export const DEBT_TYPE_OPTIONS = [
  { value: 'credit-card', label: 'Credit Card Debt' },
  { value: 'personal-loan', label: 'Personal Loan' },
  { value: 'both', label: 'Both' },
] as const

export interface FunnelData {
  // Step 1: Location
  state?: string
  
  // Step 2: Debt Types (multi-select)
  debtTypes?: DebtTypeOption[]
  
  // Step 3: Debt Amount
  debtAmount?: number
  
  // Step 4: Income
  annualIncome?: number
  
  // Step 5: Date of Birth
  dateOfBirth?: {
    month: string
    day: string
    year: string
  }
  
  // Step 6: Name
  firstName?: string
  lastName?: string
  
  // Step 7: Email
  email?: string
  
  // Step 8: Phone
  phone?: string
  phoneConsent?: boolean
  
  // Step 9: Address
  address?: {
    line1: string
    line2?: string
    zipCode: string
  }
}

export interface SavingsEstimate {
  currentDebt: number
  newDebtAmount: number
  savings: number
  monthlyPayment: number
  timeline: string // e.g., "24-48 Months"
}

export interface DebtProfile {
  name: string
  debtAmount: number
  savings: SavingsEstimate
  matchCount: number // e.g., 200000 people with similar profiles
  ageRange: string // e.g., "38-48 years"
}

// Form validation schemas (for use with zod)
export const VALIDATION = {
  debtAmount: {
    min: 10000,
    max: 100000,
  },
  income: {
    min: 10000,
    max: 500000,
  },
  age: {
    min: 18,
    max: 120,
  },
  name: {
    minLength: 2,
    maxLength: 50,
  },
  phone: {
    pattern: /^\(\d{3}\) \d{3}-\d{4}$/,
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  zipCode: {
    pattern: /^\d{5}(-\d{4})?$/,
  },
}

// US States for dropdown
export const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
] as const
