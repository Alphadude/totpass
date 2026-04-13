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

    const subject = `Special Invitation: The Dedication of Rion Chisom Raphael Nwosu`
    const content = `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; color: #333; background-color: #ffffff; padding: 40px; border: 1px solid #e0e0e0; border-radius: 8px; line-height: 1.6;">
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #c9a961; padding-bottom: 20px;">
          <h3 style="text-transform: uppercase; letter-spacing: 0.2em; font-size: 14px; color: #c9a961; margin-bottom: 10px;">Special Invitation</h3>
          <p style="font-size: 16px; margin: 5px 0;">
            The Family of <strong>High Chief Engr. Raphael Nwosu & Mrs. Confidence Nwosu</strong><br/>
            <span style="font-size: 12px; color: #777;">(Founder/ President Of Hench Group Limited)</span>
          </p>
          <p style="margin: 15px 0; font-style: italic;">cordially invite you to the Dedication of their Beloved Son</p>
          <h1 style="font-size: 28px; margin: 10px 0; color: #1a1a1a;">RION CHISOM RAPHAEL NWOSU</h1>
          <p style="font-weight: bold; font-size: 18px; color: #c9a961;">SUNDAY 26TH APRIL 2026</p>
        </div>

        <div style="margin-bottom: 30px;">
          <h4 style="color: #c9a961; text-transform: uppercase; border-bottom: 1px solid #eee; padding-bottom: 5px;">Dedication Service</h4>
          <p style="margin: 5px 0;"><strong>Gateway International Church</strong></p>
          <p style="margin: 5px 0; font-size: 14px; color: #555;">The Altar of Mercy Grounds</p>
          <p style="margin: 5px 0; font-size: 14px; color: #555;">Ogbogoro Road Rumuopirikom, Port Harcourt</p>
        </div>

        <div style="margin-bottom: 30px;">
          <h4 style="color: #c9a961; text-transform: uppercase; border-bottom: 1px solid #eee; padding-bottom: 5px;">Reception</h4>
          <p style="margin: 5px 0;"><strong>WhiteJade Event Centre</strong></p>
          <p style="margin: 5px 0; font-size: 14px; color: #555;">GUAke Road After NNPC Filling Station</p>
          <p style="margin: 5px 0; font-size: 14px; color: #555;">Eliozu, Port Harcourt</p>
        </div>

        <div style="background-color: #fafafa; padding: 20px; border-radius: 10px; border-left: 4px solid #c9a961; margin-bottom: 30px;">
          <h4 style="margin-top: 0; font-size: 14px;">Digital Guest Pass</h4>
          <p style="margin: 5px 0; font-size: 14px;">Guest: <strong>${record.first_name} ${record.last_name}</strong></p>
          <p style="margin: 5px 0; font-size: 14px;">ID: <span style="font-family: monospace; color: #c9a961; font-weight: bold;">${record.id}</span></p>
          <p style="font-size: 11px; color: #888; margin-top: 10px; font-style: italic;">* Please present this ID at the door for check-in.</p>
        </div>

        <div style="border-top: 1px solid #eee; padding-top: 20px; font-size: 13px;">
          <p style="margin: 5px 0;"><strong>RSVP:</strong> Engr. Raphael Nwosu (MR. VIRUS)</p>
          <p style="margin: 5px 0;"><strong>Tel:</strong> +234 802 218 7846</p>
          <p style="margin: 20px 0 0 0; font-style: italic; color: #777; text-align: center;">With best compliments From: Family & Friends</p>
        </div>
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
