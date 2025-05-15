import { Prisma } from '@prisma/client'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { ZodError } from 'zod'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Convert prisma object into a regular JS object
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

// Format number with decimal places
export function formatNumberWithDecimal(number: number) {
  const [int, decimal] = number.toString().split('.')
  return decimal ? `${int}.${decimal.padEnd(2, '0')}` : `${int}.00`
}

// Format Errors
export function formatError(error: unknown): string {
  if (error instanceof ZodError) {
    // Handle Zod Error
    const fieldErrors = Object.keys(error.errors).map((field) => {
      const message = error.errors[Number(field)].message
      return typeof message === 'string' ? message : JSON.stringify(message)
    })

    return fieldErrors.join('. ')
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      // Handle Prisma Error
      const field = error.meta?.target
        ? (error.meta.target as string[])[0]
        : 'Field'
      return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
    }
  } else {
    // Handle other errors
    return error instanceof Error ? error.message : JSON.stringify(error)
  }

  return ''
}

// Round to 2 decimal places
export const round2 = (value: number | string) => {
  if (typeof value === 'number') {
    // avoid rounding
    return Math.round((value + Number.EPSILON) * 100) / 100
  } else if (typeof value === 'string') {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100
  } else {
    throw new Error('value is not a number or a string')
  }
}

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
  minimumFractionDigits: 2,
})

// Format currency using the formmater above
export const formatCurrency = (amount: number | string | null) => {
  if (typeof amount === 'number') {
    return CURRENCY_FORMATTER.format(amount)
  } else if (typeof amount === 'string') {
    return CURRENCY_FORMATTER.format(Number(amount))
  } else {
    return 'NaN'
  }
}

// Shorten UUID
export function formatId(id: string) {
  return `..${id.substring(id.length - 6)}`
}

// Format date and times
export function formatDateTime(dateString: Date) {
  const dateTimeOpotions: Intl.DateTimeFormatOptions = {
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // abbreviated year (e.g., '2025')
    day: 'numeric', // numeric day of the month (e.g., '15')
    hour: 'numeric', // numeric hour (24-hour clock) (e.g., '14')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  }

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // abbreviated year (e.g., '2025')
    day: 'numeric', // numeric day of the month (e.g., '15')
  }

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric', // numeric hour (24-hour clock) (e.g., '14')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  }

  const formatDateTime: string = new Date(dateString).toLocaleString(
    'en-US',
    dateTimeOpotions,
  )

  const formatDate: string = new Date(dateString).toLocaleString(
    'en-US',
    dateOptions,
  )

  const formatTime: string = new Date(dateString).toLocaleString(
    'en-US',
    timeOptions,
  )

  return {
    dateTime: formatDateTime,
    dateOnly: formatDate,
    timeOnly: formatTime,
  }
}
