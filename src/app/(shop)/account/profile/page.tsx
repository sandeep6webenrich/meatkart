import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProfileForm } from '@/components/account/ProfileForm'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser?.email) return null

  const user = await prisma.user.findFirst({
    where: { email: authUser.email }
  })

  if (!user) return <div>User not found</div>

  return (
    <div className="tw-space-y-6">
      <h2 className="tw-text-2xl tw-font-bold">Profile & Security</h2>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm user={user} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="tw-space-y-4">
            <div className="tw-flex tw-items-center tw-justify-between tw-border-b tw-pb-4">
              <div>
                <h4 className="tw-font-medium">Log out from all devices</h4>
                <p className="tw-text-sm tw-text-gray-500">Secure your account by logging out from all other sessions.</p>
              </div>
              <Button variant="outline">Log Out All</Button>
            </div>
            <div className="tw-flex tw-items-center tw-justify-between">
              <div>
                <h4 className="tw-font-medium tw-text-red-600">Delete Account</h4>
                <p className="tw-text-sm tw-text-gray-500">Permanently remove your account and data.</p>
              </div>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
