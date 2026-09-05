/**
 * src/app/api/sms/webhook/route.ts
 *
 * Twilio SMS Webhook handler.
 * POST — Parses incoming Twilio x-www-form-urlencoded body,
 *        calls conversationOrchestrator, returns TwiML XML response.
 *
 * Reference: https://www.twilio.com/docs/messaging/guides/webhook-request
 */

import { NextRequest, NextResponse } from 'next/server';
import { handleIncomingMessage } from '@/lib/orchestrator/conversationOrchestrator';

export async function POST(request: NextRequest) {
  let from = '';
  let body = '';

  try {
    // Twilio sends application/x-www-form-urlencoded
    const formData = await request.formData();
    from = (formData.get('From') as string) || '';
    body = (formData.get('Body') as string) || '';
  } catch {
    try {
      // Fallback: parse raw text body manually
      const rawText = await request.text();
      const params = new URLSearchParams(rawText);
      from = params.get('From') || '';
      body = params.get('Body') || '';
    } catch {
      return new NextResponse(
        twimlResponse('System error: could not parse request.'),
        {
          status: 400,
          headers: { 'Content-Type': 'text/xml' },
        }
      );
    }
  }

  if (!from) {
    return new NextResponse(twimlResponse('Missing sender phone number.'), {
      status: 400,
      headers: { 'Content-Type': 'text/xml' },
    });
  }

  // Call the conversation orchestrator (SMS has no media in basic flow)
  let replyText: string;
  try {
    replyText = await handleIncomingMessage('sms', from, body || null, null);
  } catch (err) {
    console.error('SMS orchestrator error:', err);
    replyText = 'System error. Please try again later.';
  }

  // Return TwiML response
  return new NextResponse(twimlResponse(replyText), {
    status: 200,
    headers: { 'Content-Type': 'text/xml' },
  });
}

/**
 * Wrap a message string in TwiML XML for Twilio SMS response.
 */
function twimlResponse(message: string): string {
  // Escape XML special characters to prevent injection
  const escaped = message
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<Response><Message>${escaped}</Message></Response>`;
}
