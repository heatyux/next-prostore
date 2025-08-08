import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getUserById } from '@/lib/actions/user.actions'

import { UpdateUserForm } from './update-user-form'

export const metadata: Metadata = {
  title: 'Update User',
}

interface AdminUserIdPageProps {
  params: Promise<{
    id: string
  }>
}

const AdminUserIdPage = async ({ params }: AdminUserIdPageProps) => {
  const { id } = await params

  const user = await getUserById(id)

  if (!user) {
    return notFound()
  }

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <h1 className="h2-bold">Update User</h1>
      <UpdateUserForm user={user} />
    </div>
  )
}

export default AdminUserIdPage
