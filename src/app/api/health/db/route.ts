import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const count = await prisma.product.count({ where: { isActive: true } })
    return NextResponse.json({ ok: true, products: count })
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? 'unknown error' },
      { status: 500 }
    )
  }
}
