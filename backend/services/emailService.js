const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        // Allow self-signed certificates (for development/corporate networks)
        rejectUnauthorized: false
      }
    });
  }

  async sendContactEmail(name, email, message) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL,
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
            
            <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #333; color: #888; font-size: 0.9em;">
              <p>Sent from your portfolio contact form at ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </body>
        </html>
      `,
      // Plain text fallback
      text: `
New Contact Form Submission
---------------------------

Name: ${name}
Email: ${email}

Message:
${message}

---------------------------
Sent: ${new Date().toLocaleString()}
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Email send failed:', error);
      throw error;
    }
  }

  // Verify email configuration
  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Email service is ready to send messages');
      return true;
    } catch (error) {
      console.error('❌ Email service verification failed:', error);
      return false;
    }
  }
}

module.exports = new EmailService();
