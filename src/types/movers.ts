/**
 * Movers Funnel Data Types
 */

export type RoomSizeOption = 'studio' | '1-bedroom' | '2-bedroom' | '3-bedroom' | '4-bedroom' | '5-plus-bedroom'

export const ROOM_SIZE_OPTIONS = [
  { value: 'studio', label: 'Studio', description: '~500 sq ft' },
  { value: '1-bedroom', label: '1 Bedroom', description: '~700 sq ft' },
  { value: '2-bedroom', label: '2 Bedrooms', description: '~1,000 sq ft' },
  { value: '3-bedroom', label: '3 Bedrooms', description: '~1,500 sq ft' },
  { value: '4-bedroom', label: '4 Bedrooms', description: '~2,000 sq ft' },
  { value: '5-plus-bedroom', label: '5+ Bedrooms', description: '~2,500+ sq ft' },
] as const

export interface MoversData {
  fromLocation?: string
  toLocation?: string
  rooms?: RoomSizeOption
  email?: string
  moveDate?: string
  firstName?: string
  lastName?: string
  phone?: string
}

export interface SavedQuote {
  estimatedCost: { min: number; max: number }
  distance: number
  timeframe: string
}

// Popular US cities for autocomplete
export const POPULAR_CITIES = [
  'New York, NY',
  'Los Angeles, CA',
  'Chicago, IL',
  'Houston, TX',
  'Phoenix, AZ',
  'Philadelphia, PA',
  'San Antonio, TX',
  'San Diego, CA',
  'Dallas, TX',
  'San Jose, CA',
  'Austin, TX',
  'Jacksonville, FL',
  'Fort Worth, TX',
  'Columbus, OH',
  'Indianapolis, IN',
  'Charlotte, NC',
  'San Francisco, CA',
  'Seattle, WA',
  'Denver, CO',
  'Boston, MA',
  'Miami, FL',
  'Atlanta, GA',
  'Portland, OR',
  'Las Vegas, NV',
  'Nashville, TN',
]
