import { BrevoClient } from '@getbrevo/brevo'

export const sendMail = async ({ to, subject, text, html }) => {
  const brevo = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY,
  })

  return await brevo.transactionalEmails.sendTransacEmail({
    subject: subject,
    textContent: text,
    htmlContent: html,
    sender: { 
      name: 'Taxsathi Support', 
      email: process.env.EMAIL_FROM || 'no-reply@example.com' 
    },
    to: [{ email: to }]
  })
}
