const nodemailer = require('nodemailer')

// Create reusable transporter object using the default SMTP transport
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  })
}

// Email templates
const emailTemplates = {
  welcome: (data) => ({
    subject: 'Welcome to Campus Companion!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Welcome to Campus Companion, ${data.name}!</h2>
        <p>Thank you for joining our campus community platform.</p>
        <p>You can now:</p>
        <ul>
          <li>Discover and register for campus events</li>
          <li>Report and find lost items</li>
          <li>Connect with fellow students</li>
          <li>Stay updated with placement opportunities</li>
          <li>Analyze your resume with AI</li>
        </ul>
        <p>Get started by exploring our platform!</p>
        <p>Best regards,<br>The Campus Companion Team</p>
      </div>
    `
  }),
  
  'password-reset': (data) => ({
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Password Reset Request</h2>
        <p>Hello ${data.name},</p>
        <p>You have requested to reset your password. Click the button below to reset it:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.resetUrl}" 
             style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>This link will expire in ${data.expiryTime}.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>The Campus Companion Team</p>
      </div>
    `
  }),
  
  'email-verification': (data) => ({
    subject: 'Verify Your Email Address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Verify Your Email Address</h2>
        <p>Hello ${data.name},</p>
        <p>Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.verificationUrl}" 
             style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p>This link will expire in ${data.expiryTime}.</p>
        <p>Best regards,<br>The Campus Companion Team</p>
      </div>
    `
  })
}

// Send email function
const sendEmail = async (options) => {
  try {
    // Skip email sending in development if no email config
    if (process.env.NODE_ENV === 'development' && !process.env.EMAIL_USER) {
      console.log('📧 Email would be sent to:', options.to)
      console.log('📧 Subject:', options.subject)
      console.log('📧 Template:', options.template)
      console.log('📧 Data:', options.data)
      return { success: true, message: 'Email skipped in development' }
    }

    const transporter = createTransporter()

    // Get template
    const template = emailTemplates[options.template]
    if (!template) {
      throw new Error(`Email template '${options.template}' not found`)
    }

    const { subject, html } = template(options.data || {})

    // Mail options
    const mailOptions = {
      from: `"Campus Companion" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject || subject,
      html: options.html || html
    }

    // Send email
    const info = await transporter.sendMail(mailOptions)
    
    console.log('📧 Email sent successfully:', info.messageId)
    return { success: true, messageId: info.messageId }
    
  } catch (error) {
    console.error('📧 Email send error:', error)
    throw error
  }
}

// Send bulk emails
const sendBulkEmail = async (emails) => {
  const results = []
  
  for (const email of emails) {
    try {
      const result = await sendEmail(email)
      results.push({ ...email, success: true, result })
    } catch (error) {
      results.push({ ...email, success: false, error: error.message })
    }
  }
  
  return results
}

module.exports = {
  sendEmail,
  sendBulkEmail,
  emailTemplates
}