import { onCall, HttpsError, onRequest } from 'firebase-functions/v2/https';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import * as admin from 'firebase-admin';
import { Resend } from 'resend';
import { defineString } from 'firebase-functions/params';
import { marked } from 'marked';

// Initialize Firebase Admin
admin.initializeApp();

// Define environment parameter for Resend API key
const resendApiKey = defineString('RESEND_API_KEY');

// Email template HTML
const createEmailHTML = (bodyHtml: string, previewText?: string, unsubscribeUrl?: string) => {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Navarra Escape City</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #1a1a1a; color: #e0e0e0;">
  ${previewText ? `<div style="display: none; max-height: 0px; overflow: hidden;">${previewText}</div>` : ''}
  
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #2d2d2d; border-radius: 8px; border: 1px solid #D4AF37;">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; border-bottom: 2px solid #D4AF37;">
              <h1 style="margin: 0; color: #D4AF37; font-size: 28px; font-weight: bold;">
                Navarra Escape City
              </h1>
              <p style="margin: 8px 0 0; color: #999; font-size: 14px;">
                La Sombra de Elgacena
              </p>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 40px; color: #e0e0e0; font-size: 16px; line-height: 1.6;">
              ${bodyHtml}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px 40px; text-align: center; border-top: 1px solid #444;">
              <p style="margin: 0 0 10px; color: #999; font-size: 12px;">
                Has recibido este email porque te suscribiste al newsletter de Navarra Escape City
              </p>
              ${unsubscribeUrl ? `
                <p style="margin: 0 0 20px; color: #999; font-size: 12px;">
                  Si no deseas recibir más correos, puedes <a href="${unsubscribeUrl}" style="color: #D4AF37; text-decoration: underline;">darte de baja aquí</a>.
                </p>
              ` : ''}
              <p style="margin: 0; color: #666; font-size: 11px;">
                © 2026 Navarra Escape City. Todos los derechos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

/**
 * Helper to process markdown and personalize content
 */
async function processEmailContent(body: string, name: string): Promise<string> {
  // Replace personalization variables
  // If name is empty or [Día], use a generic greeting
  const displayName = (name && !name.includes('[') && !name.includes('{{')) ? name : 'aventurero/a';
  const personalizedBody = body.replace(/{{name}}/g, displayName);

  // Convert Markdown to HTML
  return marked.parse(personalizedBody, { async: true });
}

/**
 * HTTP Callable Function: Send custom email
 * Triggered from admin panel
 */
export const sendEmail = onCall({ maxInstances: 10 }, async (request) => {
  // Check if user is authenticated and is admin
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Must be logged in');
  }

  const adminEmail = 'mikeldiaz0@gmail.com';
  if (request.auth.token.email !== adminEmail) {
    throw new HttpsError('permission-denied', 'Only admin can send emails');
  }

  const { subject, body, testMode = false } = request.data;

  if (!subject || !body) {
    throw new HttpsError('invalid-argument', 'Subject and body are required');
  }

  try {
    const resend = new Resend(resendApiKey.value());
    const db = admin.firestore();

    // Get newsletter subscribers
    const subscribersSnapshot = await db.collection('newsletter').get();
    const emailsToSend: any[] = [];

    if (testMode) {
      // Test mode: only send to admin
      const bodyHtml = await processEmailContent(body, 'Administrador');
      emailsToSend.push({
        from: 'Navarra Escape City <noreply@estellaescapecity.com>',
        to: [adminEmail],
        subject: `[TEST] ${subject}`,
        html: createEmailHTML(bodyHtml, subject),
      });
    } else {
      // Production: process each subscriber for personalization
      for (const doc of subscribersSnapshot.docs) {
        const data = doc.data();
        if (data.email) {
          const bodyHtml = await processEmailContent(body, data.name || '');
          const unsubscribeUrl = `https://us-central1-estellaescape.cloudfunctions.net/unsubscribe?id=${doc.id}`;

          emailsToSend.push({
            from: 'Navarra Escape City <noreply@estellaescapecity.com>',
            to: [data.email],
            subject: subject,
            html: createEmailHTML(bodyHtml, subject, unsubscribeUrl),
          });
        }
      }
    }

    if (emailsToSend.length === 0) {
      throw new HttpsError('failed-precondition', 'No recipients found');
    }

    // Use Resend batch sending
    const results = await resend.batch.send(emailsToSend);

    // Log the send
    await db.collection('emailLogs').add({
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
      subject,
      recipientCount: emailsToSend.length,
      testMode,
      status: 'sent',
      resendBatchId: results.data ? (results.data as any)[0]?.id : null,
    });

    return {
      success: true,
      recipientCount: emailsToSend.length,
      message: `Email sent to ${emailsToSend.length} recipient(s)`,
    };
  } catch (error: any) {
    console.error('Error sending email:', error);
    throw new HttpsError('internal', error.message);
  }
});

/**
 * Scheduled Function: Send weekly newsletter
 */
export const sendWeeklyNewsletter = onSchedule(
  {
    schedule: '0 9 * * 1',
    timeZone: 'Europe/Madrid',
  },
  async () => {
    try {
      const resend = new Resend(resendApiKey.value());
      const db = admin.firestore();

      const subscribersSnapshot = await db.collection('newsletter').get();
      const subject = '🔍 Nuevo Enigma de la Semana - Navarra Escape City';
      const body = `¡Hola {{name}}! 🕵️‍♂️✨

¿Listo para un nuevo desafío? Esta semana tenemos un enigma especial para ti.

Visita nuestra web para descubrirlo y resolverlo:
👉 **[https://estellaescapecity.com/enigmas](https://estellaescapecity.com/enigmas)**

¡Nos vemos en el próximo enigma!

Mikel de Navarra Escape City`;

      const emailsToSend: any[] = [];
      for (const doc of subscribersSnapshot.docs) {
        const data = doc.data();
        if (data.email) {
          const bodyHtml = await processEmailContent(body, data.name || '');
          const unsubscribeUrl = `https://us-central1-estellaescape.cloudfunctions.net/unsubscribe?id=${doc.id}`;

          emailsToSend.push({
            from: 'Navarra Escape City <noreply@estellaescapecity.com>',
            to: [data.email],
            subject: subject,
            html: createEmailHTML(bodyHtml, subject, unsubscribeUrl),
          });
        }
      }

      if (emailsToSend.length > 0) {
        await resend.batch.send(emailsToSend);
        console.log(`Weekly newsletter sent to ${emailsToSend.length} subscribers`);
      }
    } catch (error) {
      console.error('Error sending weekly newsletter:', error);
    }
  }
);

/**
 * HTTP Callable Function: Send test email
 */
export const sendTestEmail = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Must be logged in');
  }

  const { subject, body } = request.data;
  const adminEmail = 'mikeldiaz0@gmail.com';

  try {
    const resend = new Resend(resendApiKey.value());
    const bodyHtml = await processEmailContent(body, 'Administrador');

    await resend.emails.send({
      from: 'Navarra Escape City <noreply@estellaescapecity.com>',
      to: [adminEmail],
      subject: `[TEST] ${subject}`,
      html: createEmailHTML(bodyHtml, subject),
    });

    return { success: true, message: `Test email sent to ${adminEmail}` };
  } catch (error: any) {
    console.error('Error sending test email:', error);
    throw new HttpsError('internal', error.message);
  }
});

/**
 * Webhook: Handle unsubscriptions (onRequest)
 */
export const unsubscribe = onRequest(async (req, res) => {
  const subscriberId = req.query.id as string;

  if (!subscriberId) {
    res.status(400).send('Falta el identificador del suscriptor.');
    return;
  }

  try {
    const db = admin.firestore();
    await db.collection('newsletter').doc(subscriberId).delete();

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Baja confirmada</title>
        <style>
          body { font-family: sans-serif; background: #1a1a1a; color: white; text-align: center; padding: 50px; }
          .container { max-width: 500px; margin: auto; background: #2d2d2d; padding: 30px; border-radius: 8px; border: 1px solid #D4AF37; }
          h1 { color: #D4AF37; }
          a { color: #D4AF37; text-decoration: none; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Te has dado de baja correctamente</h1>
          <p>Sentimos verte marchar. No recibirás más correos de nuestra parte.</p>
          <p><a href="https://estellaescapecity.com">Volver a la web</a></p>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Error unsubscribing:', error);
    res.status(500).send('Error al procesar la baja. Por favor, inténtalo más tarde.');
  }
});
