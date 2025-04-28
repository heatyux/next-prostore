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
