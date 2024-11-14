import AdminUsersController from '#controllers/admin_users_controller'
import { InferPageProps } from '@adonisjs/inertia/types'

export default function Index({ user }: InferPageProps<AdminUsersController, 'show'>) {
  return (
    <div>
      Hello {user?.name} {user?.role}
    </div>
  )
}
