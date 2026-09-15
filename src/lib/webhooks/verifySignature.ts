/**
 * src/lib/webhooks/verifySignature.ts
 *
 * The inbound WhatsApp webhook used to accept any POST from anyone. A forged
 * request could drive the conversation state machine, write rows as any phone
 * number, and make the app send messages from the project's own Meta number
 * to an arbitrary recipient.
 *
 * Meta signs each delivery with HMAC-SHA256 over the raw body
 * (`X-Hub-Signature-256: sha256=...`, keyed by the app secret). Verify it
 * before doing any work.
 *
 * Missing secret → rejected in production, allowed with a loud warning in
 * development so local testing against ngrok/curl still works.
 */

import crypto from 'crypto';

export type VerificationResult =
  | { valid: true }
  | { valid: false; reason: string };

function allowUnsigned(what: string): VerificationResult {
  if (process.env.NODE_ENV === 'production') {
    return { valid: false, reason: `${what} is not configured; refusing unsigned webhook` };
  }
  console.warn(`⚠️ ${what} is not set — accepting unverified webhook (development only)`);
  return { valid: true };
}

/**
 * Verify a WhatsApp Cloud API delivery.
 *
 * @param rawBody - The exact bytes of the request body, before JSON.parse.
 *                  Re-serializing the parsed object will not match the digest.
 */
export function verifyWhatsAppSignature(rawBody: string, header: string | null): VerificationResult {
  const appSecret = process.env.WHATSAPP_APP_SECRET;

  if (!appSecret) {
    return allowUnsigned('WHATSAPP_APP_SECRET');
  }

  if (!header || !header.startsWith('sha256=')) {
    return { valid: false, reason: 'Missing or malformed X-Hub-Signature-256 header' };
  }

  const received = header.slice('sha256='.length);
  const expected = crypto.createHmac('sha256', appSecret).update(rawBody, 'utf8').digest('hex');

  const receivedBuf = Buffer.from(received, 'hex');
  const expectedBuf = Buffer.from(expected, 'hex');

  // Length check first: timingSafeEqual throws on a length mismatch.
  if (receivedBuf.length !== expectedBuf.length) {
    return { valid: false, reason: 'Signature length mismatch' };
  }

  if (!crypto.timingSafeEqual(receivedBuf, expectedBuf)) {
    return { valid: false, reason: 'Signature mismatch' };
  }

  return { valid: true };
}
