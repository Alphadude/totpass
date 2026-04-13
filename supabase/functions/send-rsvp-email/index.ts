import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { SMTPClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts"

const GMAIL_USER = "alphaflex07@gmail.com"
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
          username: GMAIL_USER,
          password: GMAIL_APP_PASSWORD!,
        },
      },
    })

    const subject = `Invited: RSVP Confirmation for Rion's Dedication`
    const content = `
      <div style="font-family: serif; max-width: 600px; margin: 0 auto; color: #4a3f35; background-color: #faf8f5; padding: 40px; border-radius: 20px;">
        <div style="text-align: center; margin-bottom: 40px;">
          <p style="text-transform: uppercase; letter-spacing: 0.3em; font-size: 10px; color: #c9a961; margin-bottom: 20px;">Kindly Respond</p>
          <h1 style="font-size: 32px; font-weight: normal; margin-bottom: 5px;">Grace & Dedication</h1>
          <h2 style="font-size: 20px; color: #c9a961; font-weight: normal;">Rion Chisom Raphael Nwosu</h2>
        </div>

        <p style="font-style: italic; line-height: 1.6; text-align: center; color: #7a6e64;">
          Thank you for your RSVP, ${record.first_name}. We are truly honored that you'll be joining us to celebrate this special milestone in our child's life.
        </p>
        
        <div style="padding: 30px; border: 1px solid #c9a96144; border-radius: 20px; margin: 30px 0; background-color: #ffffff;">
          <h3 style="margin-top: 0; font-family: serif; font-weight: normal; border-bottom: 1px solid #f0f0f0; padding-bottom: 10px;">Event Pass</h3>
          <p style="margin: 15px 0;"><strong>Venue:</strong> Gateway International Church (Altar of Mercy grounds), Port Harcourt</p>
          <p style="margin: 15px 0;"><strong>Date:</strong> Sunday, April 26, 2026</p>
          <p style="margin: 15px 0;"><strong>Status:</strong> ${record.attendance_status}</p>
          
          <div style="text-align: center; margin-top: 25px; padding-top: 20px; border-top: 1px dashed #c9a96144;">
            <p style="font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 2px;">Your Guest ID</p>
            <p style="font-size: 14px; font-family: monospace; background: #faf8f5; padding: 10px; display: inline-block; border-radius: 5px; color: #c9a961;">${record.id}</p>
          </div>
        </div>

        <p style="text-align: center; font-size: 12px; color: #999; font-style: italic;">
          Please present this Guest ID or your digital pass on the website for check-in at the door.
        </p>

        <footer style="margin-top: 40px; text-align: center; font-size: 10px; color: #ccc; text-transform: uppercase; letter-spacing: 3px;">
          &copy; 2026 Nwosu Family • With Love
        </footer>
      </div>
    `

    await client.send({
      from: `Nwosu Family <${GMAIL_USER}>`,
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
