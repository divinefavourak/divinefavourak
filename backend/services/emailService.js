const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * The email template lives in api/_emailTemplate.js so this local
 * dev server and the deployed Vercel function render the same
 * email. That module is ESM and this file is CommonJS, so it is
 * pulled in with a dynamic import() rather than require().
 */
async function buildEmailHtml(fields) {
  const mod = await import('../../api/_emailTemplate.js');
  return mod.buildEmailHtml(fields);
}

async function sendContactEmail(name, email, message) {
  const { data, error } = await resend.emails.send({
    from: process.env.FROM_EMAIL || 'Portfolio <onboarding@resend.dev>',
    to: [process.env.RECIPIENT_EMAIL],
    replyTo: email,
    subject: `Portfolio Contact: Message from ${name}`,
    html: await buildEmailHtml({ name, email, message }),
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
