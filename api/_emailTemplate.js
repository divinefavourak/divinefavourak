/**
 * Shared email template for the contact form.
 *
 * Lives in its own module so the Vercel function (api/contact.js,
 * ESM) and the local Express server (backend/, CommonJS) render the
 * same email. The leading underscore keeps Vercel from treating
 * this file as a route.
 */

/**
 * Escape user input before it goes into the email body.
 *
 * Everything below is attacker-controlled: anyone can submit this
 * form. Without escaping, a sender could inject markup or a
 * disguised link into the message that lands in your inbox.
 */
export function escapeHtml(value) {
  return String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[c]
  );
}

/**
 * Build the notification email.
 *
 * Email HTML is not web HTML. Two rules drive everything here:
 *
 *   1. Every style is INLINE. Gmail discards `body` rules from a
 *      <head><style> block (it rewrites body into a div), which is
 *      what broke the previous template: `body { color: #fff }` was
 *      dropped while `.message-box { background: #111 }` survived,
 *      leaving default-black text on a black panel.
 *   2. Layout is tables, not flex or grid, because Outlook renders
 *      through Word's engine and supports neither.
 *
 * Colours are light-on-paper rather than the site's dark theme:
 * an email has to stay legible in clients that impose their own
 * background, and dark designs are the ones that break when they do.
 */
export function buildEmailHtml({ name, email, message }) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\r?\n/g, '<br />');
  const sentAt = new Date().toLocaleString('en-NG', {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  const ink = '#17140E';
  const muted = '#6E6557';
  const rule = '#E4DCCC';
  const paper = '#FAF9F6';
  const accent = '#A9701C';
  const sans =
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

  const field = (label, valueHtml) => `
        <tr>
          <td style="padding: 0 0 6px 0; font-family: ${sans}; font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: ${muted};">${label}</td>
        </tr>
        <tr>
          <td style="padding: 0 0 22px 0; font-family: ${sans}; font-size: 16px; line-height: 24px; color: ${ink};">${valueHtml}</td>
        </tr>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>New message from ${safeName}</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${paper};">
  <!-- Preheader: the grey line clients show next to the subject. -->
  <div style="display: none; max-height: 0; overflow: hidden; opacity: 0;">
    ${safeName} &lt;${safeEmail}&gt; sent you a message from akanbi.dev
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: ${paper};">
    <tr>
      <td align="center" style="padding: 32px 16px;">

        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width: 600px; max-width: 100%; background-color: #FFFFFF; border: 1px solid ${rule}; border-radius: 12px;">
          <tr>
            <td style="padding: 32px 32px 0 32px;">
              <p style="margin: 0 0 6px 0; font-family: ${sans}; font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${accent};">New enquiry</p>
              <h1 style="margin: 0; font-family: ${sans}; font-size: 24px; line-height: 30px; font-weight: 700; letter-spacing: -0.5px; color: ${ink};">akanbi.dev contact form</h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 24px 32px 0 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td style="border-top: 1px solid ${rule}; font-size: 0; line-height: 0;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 24px 32px 0 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                ${field('From', safeName)}
                ${field('Email', `<a href="mailto:${safeEmail}" style="color: ${accent}; text-decoration: underline;">${safeEmail}</a>`)}
                <tr>
                  <td style="padding: 0 0 6px 0; font-family: ${sans}; font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: ${muted};">Message</td>
                </tr>
                <tr>
                  <td style="padding: 0 0 8px 0;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: ${paper}; border: 1px solid ${rule}; border-radius: 8px;">
                      <tr>
                        <td style="padding: 18px 20px; font-family: ${sans}; font-size: 16px; line-height: 26px; color: ${ink};">${safeMessage}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 24px 32px 32px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background-color: ${ink}; border-radius: 999px;">
                    <a href="mailto:${safeEmail}?subject=Re%3A%20your%20message" style="display: inline-block; padding: 12px 26px; font-family: ${sans}; font-size: 14px; font-weight: 600; color: #FFFFFF; text-decoration: none;">Reply to ${safeName}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 32px 28px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td style="border-top: 1px solid ${rule}; font-size: 0; line-height: 0;">&nbsp;</td></tr>
              </table>
              <p style="margin: 16px 0 0 0; font-family: ${sans}; font-size: 12px; line-height: 18px; color: ${muted};">
                Sent ${escapeHtml(sentAt)} &middot; Replying goes straight to the sender.
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
}
