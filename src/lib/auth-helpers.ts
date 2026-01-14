'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'

export type AuthUser = {
    id: string
    phone: string
    email: string | null
    name: string
    role: string
}

/**
 * Get the currently authenticated user from the database
 * Returns null if not authenticated or user not found in database
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
    const supabase = await createClient()
    const { data: { user: authUser }, error } = await supabase.auth.getUser()

    if (error || !authUser) {
        return null
    }

    // Try to find user by phone first, then by email
    let dbUser = null

    if (authUser.phone) {
        dbUser = await prisma.user.findUnique({
            where: { phone: authUser.phone },
            select: { id: true, phone: true, email: true, name: true, role: true }
        })
    }

    if (!dbUser && authUser.email) {
        dbUser = await prisma.user.findFirst({
            where: { email: authUser.email },
            select: { id: true, phone: true, email: true, name: true, role: true }
        })
    }

    return dbUser
}

/**
 * Require authentication - throws if user is not authenticated
 */
export async function requireAuth(): Promise<AuthUser> {
    const user = await getCurrentUser()

    if (!user) {
        throw new Error('Unauthorized: Authentication required')
    }

    return user
}

/**
 * Require admin role - throws if user is not an admin
 */
export async function requireAdmin(): Promise<AuthUser> {
    const user = await requireAuth()

    if (user.role !== 'admin') {
        throw new Error('Forbidden: Admin access required')
    }

    return user
}

/**
 * Check if current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
    try {
        const user = await getCurrentUser()
        return user?.role === 'admin'
    } catch {
        return false
    }
}
