import nodemailer from 'nodemailer'

const createTransporter = () => {
  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT || 587
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) {
    console.warn('⚠️ SMTP configuration is not set. Emails will be logged to console instead of sending.')
    return {
      sendMail: async (options) => {
        console.log('--- MOCK EMAIL ---')
        console.log(`To: ${options.to}`)
        console.log(`Subject: ${options.subject}`)
        console.log(`Text: ${options.text}`)
        console.log('------------------')
        return { messageId: 'mock-id' }
      }
    }
  }

  return nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 10000,
  })
}

export const sendMail = async ({ to, subject, text, html, from }) => {
  const transporter = createTransporter()
  const mailOptions = {
    from: from || process.env.EMAIL_FROM || 'no-reply@example.com',
    to,
    subject,
    text,
    html,
  }

  return transporter.sendMail(mailOptions)
}
