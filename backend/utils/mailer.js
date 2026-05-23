import nodemailer from 'nodemailer'

const createTransporter = () => {
  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT || 587
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) {
    throw new Error('SMTP configuration is not set in environment variables')
  }

  return nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
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
