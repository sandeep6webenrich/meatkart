import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Wallet, ArrowUpRight, ArrowDownLeft, History } from 'lucide-react'

export const dynamic = 'force-dynamic';

export default async function WalletPage() {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser?.email) return null

  const user = await prisma.user.findFirst({
    where: { email: authUser.email },
    include: {
      wallet: {
        include: {
          transactions: {
            orderBy: { createdAt: 'desc' },
            take: 20
          }
        }
      }
    }
  })

  const balance = user?.wallet?.balance || 0
  const transactions = user?.wallet?.transactions || []

  return (
    <div className="tw-space-y-6">
      <h2 className="tw-text-2xl tw-font-bold">My Wallet</h2>

      <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-6">
        <Card className="md:tw-col-span-1 tw-bg-gradient-to-br tw-from-primary tw-to-red-700 tw-text-white tw-border-none">
          <CardContent className="tw-p-6">
            <div className="tw-flex tw-items-center tw-justify-between tw-mb-4">
               <Wallet className="tw-h-8 tw-w-8 tw-opacity-80" />
               <span className="tw-text-xs tw-bg-white/20 tw-px-2 tw-py-1 tw-rounded">Active</span>
            </div>
            <p className="tw-text-sm tw-opacity-80 tw-mb-1">Available Balance</p>
            <h3 className="tw-text-3xl tw-font-bold">₹{Number(balance).toFixed(2)}</h3>
            <div className="tw-mt-6 tw-pt-4 tw-border-t tw-border-white/20">
                <p className="tw-text-xs tw-opacity-80">Use this balance for your next purchase.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:tw-col-span-2">
            <CardHeader>
                <CardTitle className="tw-flex tw-items-center tw-gap-2">
                    <History size={20} /> Transaction History
                </CardTitle>
            </CardHeader>
            <CardContent>
                {transactions.length === 0 ? (
                    <div className="tw-text-center tw-py-8 tw-text-gray-500">
                        <p>No transactions yet</p>
                    </div>
                ) : (
                    <div className="tw-space-y-4">
                        {transactions.map((tx) => (
                            <div key={tx.id} className="tw-flex tw-items-center tw-justify-between tw-border-b tw-pb-3 last:tw-border-0 last:tw-pb-0">
                                <div className="tw-flex tw-items-center tw-gap-3">
                                    <div className={`tw-p-2 tw-rounded-full ${
                                        tx.type === 'credit' ? 'tw-bg-green-100 tw-text-green-600' : 'tw-bg-red-100 tw-text-red-600'
                                    }`}>
                                        {tx.type === 'credit' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                                    </div>
                                    <div>
                                        <p className="tw-font-medium tw-text-sm">{tx.description || 'Transaction'}</p>
                                        <p className="tw-text-xs tw-text-gray-500">{new Date(tx.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <span className={`tw-font-medium ${
                                    tx.type === 'credit' ? 'tw-text-green-600' : 'tw-text-gray-900'
                                }`}>
                                    {tx.type === 'credit' ? '+' : '-'}₹{Number(tx.amount).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
