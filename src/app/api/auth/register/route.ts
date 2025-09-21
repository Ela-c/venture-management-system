import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { z } from 'zod'
import { emailService } from '@/lib/email-service'

const RegisterSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  ventureName: z.string().optional(),
  positionInVenture: z.string().optional(),
  phone: z.string().optional(),
  countryCode: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()

    // Validate request body
    const validation = RegisterSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validation.error.errors,
        },
        { status: 400 }
      )
    }

    const { firstName, lastName, email, password, ventureName, positionInVenture } = validation.data

    // Check if user already exists
    const existingUsers = await payload.find({
      collection: 'users',
      where: { email: { equals: email.toLowerCase() } },
      limit: 1,
    })

    if (existingUsers.totalDocs > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'User already exists',
          message: 'An account with this email address already exists.',
        },
        { status: 409 }
      )
    }

    // Create user
    const newUser = await payload.create({
      collection: 'users',
      data: {
        email: email.toLowerCase(),
        password: password,
        first_name: firstName,
        last_name: lastName,
        role: 'founder',
      },
    })

    // Send welcome email (don't block the response on email sending)
    try {
      const emailSent = await emailService.sendWelcomeEmail({
        userEmail: email.toLowerCase(),
        firstName,
        lastName,
        ventureName,
        position: positionInVenture,
      })
      
      if (emailSent) {
        console.log(`Welcome email sent successfully to ${email}`)
      } else {
        console.warn(`Failed to send welcome email to ${email} (but user was created successfully)`)
      }
    } catch (emailError) {
      console.error('Email sending error (user was still created successfully):', emailError)
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
      },
    })

  } catch (error) {
    console.error('Registration error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Registration failed',
        message: 'Failed to create account. Please try again.',
      },
      { status: 500 }
    )
  }
}
