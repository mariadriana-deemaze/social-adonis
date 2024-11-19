import { Head } from '@inertiajs/react'
import AdminUsersController from '#controllers/admin_users_controller'
import AdminPageHeader from '@/pages/admin/page_header'
import type { InferPageProps } from '@adonisjs/inertia/types'

export default function Index({ user }: InferPageProps<AdminUsersController, 'show'>) {
  return (
    <>
      <Head title={`${user?.name}'s dashboard`} />
      <AdminPageHeader title="Dashboard" description={`Hello ${user?.name}.`} />
    </>
  )
}
