import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { SMTPClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts"

const GMAIL_USER = Deno.env.get('GMAIL_USER')
const GMAIL_APP_PASSWORD = Deno.env.get('GMAIL_APP_PASSWORD')

serve(async (req) => {
  try {
    const payload = await req.json()
    const { record } = payload

    if (!record || !record.email) {
      return new Response("Missing record or email", { status: 400 })
    }

    const client = new SMTPClient({
      connection: {
        hostname: "smtp.gmail.com",
        port: 587,
        tls: true,
        auth: {
          username: GMAIL_USER!,
          password: GMAIL_APP_PASSWORD!,
        },
      },
    })

    const subject = `You're Invited! RSVP Confirmation for Rion's Dedication`
    const content = `
      <h1>Hello ${record.first_name},</h1>
      <p>Thank you for your RSVP! We are so excited to celebrate Rion's dedication with you.</p>
      
      <div style="padding: 20px; border: 1px solid #c9a961; border-radius: 15px; margin: 20px 0; background-color: #faf8f5;">
        <h2 style="font-family: serif; color: #4a3f35;">Event Details</h2>
        <p><strong>Date:</strong> Sunday, April 26, 2026</p>
        <p><strong>Time:</strong> 10:00 AM</p>
        <p><strong>Venue:</strong> Gateway International Church (Altar of Mercy grounds), Port Harcourt</p>
      </div>

      <p>Please find your unique QR code ID below. You can also view your digital pass on the website.</p>
      <p><strong>Guest ID:</strong> ${record.id}</p>
      
      <p>Best regards,<br/>The Nwosu Family</p>
    `

    await client.send({
      from: GMAIL_USER!,
      to: record.email,
      subject: subject,
      content: content,
      html: content,
    })

    await client.close()

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
})
