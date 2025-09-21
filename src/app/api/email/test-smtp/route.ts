import { NextResponse } from 'next/server'
const nodemailer = require('nodemailer')

export async function GET() {
  try {
    // Get SMTP configuration
    const smtpHost = process.env.SMTP_HOST
    const smtpPort = parseInt(process.env.SMTP_PORT || '587')
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS
    
    console.log('Testing SMTP connection with:')
    console.log('- Host:', smtpHost)
    console.log('- Port:', smtpPort)
    console.log('- User:', smtpUser)
    console.log('- Pass:', smtpPass ? 'SET' : 'MISSING')

    if (!smtpHost || !smtpUser || !smtpPass) {
      return NextResponse.json({
        success: false,
        error: 'SMTP configuration missing',
        details: {
          host: smtpHost ? 'SET' : 'MISSING',
          port: smtpPort,
          user: smtpUser ? 'SET' : 'MISSING',
          pass: smtpPass ? 'SET' : 'MISSING',
        }
      }, { status: 400 })
    }

    // Create transporter
    const transporter = nodemailer.createTransporter({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      debug: true, // Enable debug output
      logger: true // Log information in console
    })

    // Test the connection
    console.log('Testing SMTP connection...')
    await transporter.verify()
    console.log('SMTP connection successful!')

    // Try sending a simple test email
    const result = await transporter.sendMail({
      from: `"Test" <${smtpUser}>`,
      to: smtpUser, // Send to yourself
      subject: 'SMTP Test Email',
      text: 'This is a test email to verify SMTP configuration.',
      html: '<p>This is a test email to verify SMTP configuration.</p>'
    })

    console.log('Test email sent:', result.messageId)

    return NextResponse.json({
      success: true,
      message: 'SMTP connection and email sending successful!',
      messageId: result.messageId,
      configuration: {
        host: smtpHost,
        port: smtpPort,
        user: smtpUser,
        secure: smtpPort === 465
      }
    })

  } catch (error: any) {
    console.error('SMTP test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: 'SMTP test failed',
      message: error.message || 'Unknown error',
      details: {
        code: error.code,
        command: error.command,
        response: error.response,
        responseCode: error.responseCode
      }
    }, { status: 500 })
  }
}
