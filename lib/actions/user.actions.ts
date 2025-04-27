'use server'

import { signIn } from '@/auth'
import { signInFormSchema } from '../validator'
import { isRedirectError } from 'next/dist/client/components/redirect-error'

// Sign in the user with credentials
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData,
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    })

    await signIn('credentials', user)

    return {
      success: true,
      message: 'Signed in successfully',
    }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }
  }
}

// Sign the user out
export async function signOut() {
  await signOut()
}
