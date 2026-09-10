import { Resend } from 'resend'
import { AppError } from './errors'

export async function sendMail(
  env: { RESEND_API_KEY: string; RESEND_FROM: string },
  to: string,
  subject: string,
  html: string
) {
  try {
    if (!env.RESEND_API_KEY || env.RESEND_API_KEY.includes('replace')) {
      console.warn('[mail] RESEND_API_KEY not configured, skipping send to', to)
      return { id: 'mock-id' }
    }
    const resend = new Resend(env.RESEND_API_KEY)
    const { data, error } = await resend.emails.send({
      from: env.RESEND_FROM,
      to,
      subject,
      html,
    })
    if (error) {
      throw new AppError(`Mail send failed: ${JSON.stringify(error)}`, 500)
    }
    return data
  } catch (error) {
    if (error instanceof AppError) throw error
    throw new AppError(`Mail utils failed: ${error instanceof Error ? error.message : String(error)}`, 500)
  }
}

export async function sendPasswordChangedMail(
  env: { RESEND_API_KEY: string; RESEND_FROM: string },
  to: string
) {
  const html = `
    <h2>Password Changed</h2>
    <p>Your Recall account password was changed successfully.</p>
    <p>If you did not make this change, please contact support immediately.</p>
  `
  return sendMail(env, to, 'Your Recall password was changed', html)
}
