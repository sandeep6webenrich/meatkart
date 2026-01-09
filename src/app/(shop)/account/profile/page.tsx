import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
          <form action={updateProfile} className="tw-space-y-4">
            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
              <div className="tw-space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" defaultValue={user.name} placeholder="Enter your name" />
              </div>
              <div className="tw-space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" defaultValue={user.email || ''} readOnly className="tw-bg-gray-50" />
                <p className="tw-text-xs tw-text-gray-500">Email cannot be changed directly.</p>
              </div>
              <div className="tw-space-y-2">
                <Label htmlFor="phone">Mobile Number</Label>
                <Input id="phone" name="phone" defaultValue={user.phone} />
              </div>
            </div>
            <div className="tw-pt-4">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
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
