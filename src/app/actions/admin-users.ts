'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { requireAdmin } from '@/lib/auth-helpers'

const userSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address").optional().or(z.literal('')),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    role: z.enum(["customer", "admin"]),
})

export async function createUser(prevState: any, formData: FormData) {
    // SECURITY FIX P0-2: Verify admin authorization before proceeding
    try {
        await requireAdmin()
    } catch {
        return { message: 'Unauthorized: Admin access required', success: false }
    }

    try {
        const rawData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            role: formData.get('role'),
        }

        const validatedData = userSchema.parse(rawData)

        // Check if phone already exists
        const existingUser = await prisma.user.findUnique({
            where: { phone: validatedData.phone }
        })

        if (existingUser) {
            return { message: 'User with this phone number already exists', success: false }
        }

        // Check if email already exists (if provided)
        if (validatedData.email) {
            const existingEmail = await prisma.user.findFirst({
                where: { email: validatedData.email }
            });
            if (existingEmail) {
                return { message: 'User with this email already exists', success: false }
            }
        }

        await prisma.user.create({
            data: {
                name: validatedData.name,
                email: validatedData.email || null,
                phone: validatedData.phone,
                role: validatedData.role,
            },
        })

        revalidatePath('/admin/users')
        return { message: 'User created successfully', success: true }
    } catch (e: any) {
        if (e instanceof z.ZodError) {
            const zodError = e as z.ZodError;
            return { message: zodError.errors[0]?.message || 'Validation error', success: false }
        }
        return { message: 'Failed to create user: ' + e.message, success: false }
    }
}

export async function updateUserRole(userId: string, newRole: string) {
    // SECURITY FIX P0-2: Verify admin authorization before proceeding
    try {
        await requireAdmin()
    } catch {
        return { message: 'Unauthorized: Admin access required', success: false }
    }

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { role: newRole as any }
        })
        revalidatePath('/admin/users')
        return { message: 'User role updated successfully', success: true }
    } catch (e: any) {
        return { message: 'Failed to update role: ' + e.message, success: false }
    }
}

export async function deleteUser(userId: string) {
    // SECURITY FIX P0-2: Verify admin authorization before proceeding
    try {
        await requireAdmin()
    } catch {
        return { message: 'Unauthorized: Admin access required', success: false }
    }

    try {
        await prisma.user.delete({
            where: { id: userId }
        })
        revalidatePath('/admin/users')
        return { message: 'User deleted successfully', success: true }
    } catch (e: any) {
        return { message: 'Failed to delete user: ' + e.message, success: false }
    }
}
