const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendContactEmail(name, email, message) {
  const { data, error } = await resend.emails.send({
    from: process.env.FROM_EMAIL || 'Portfolio <onboarding@resend.dev>',
    to: [process.env.RECIPIENT_EMAIL],
    replyTo: email,
    subject: `Portfolio Contact: Message from ${name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Courier New', monospace; background-color: #000; color: #fff; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; border: 2px solid #333; padding: 20px; }
          .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
          .field { margin-bottom: 15px; }
          .label { color: #888; font-weight: bold; }
          .value { margin-top: 5px; }
          .message-box { background-color: #111; border: 1px solid #333; padding: 15px; margin-top: 10px; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 2px solid #333; color: #888; font-size: 0.9em; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>&gt; New Contact Form Submission</h2>
          </div>

          <div class="field">
            <div class="label">// Name:</div>
            <div class="value">${name}</div>
          </div>

          <div class="field">
            <div class="label">// Email:</div>
            <div class="value">${email}</div>
          </div>

          <div class="field">
            <div class="label">// Message:</div>
            <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
          </div>

          <div class="footer">
            <p>Sent from your portfolio contact form at ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
New Contact Form Submission
---------------------------

Name: ${name}
Email: ${email}

Message:
${message}

---------------------------
Sent: ${new Date().toLocaleString()}
    `,
  });

  if (error) {
    console.error('❌ Resend error:', error);
    throw new Error(error.message);
  }

  console.log('✅ Email sent via Resend:', data.id);
  return { success: true, messageId: data.id };
}

module.exports = { sendContactEmail };
