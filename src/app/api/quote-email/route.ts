import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { randomUUID } from 'crypto';

interface CartItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
}

export async function POST(request: NextRequest) {
  try {
    const { items, name, email, company, message } = (await request.json()) as {
      items: CartItem[];
      name: string;
      email: string;
      company?: string;
      message?: string;
    };

    if (!items || items.length === 0 || !name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Build a detailed message for the inquiry
    const itemLines = items.map((item, i) => `${i + 1}. ${item.name} (SKU: ${item.sku}) x ${item.quantity}`).join('\n');
    const fullMessage = [
      message || '',
      '',
      '--- Quote List ---',
      itemLines,
      `Total items: ${items.reduce((s, i) => s + i.quantity, 0)}`,
    ].join('\n').trim();

    // Save as inquiry in DB
    const db = getDb();
    const id = randomUUID();
    db.prepare(
      'INSERT INTO inquiries (id, name, email, phone, company, message, status) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(id, name, email, '', company || '', fullMessage, 'new');

    // Try sending email via nodemailer if SMTP is configured
    if (process.env.SMTP_HOST) {
      try {
        const nodemailer = await import('nodemailer');
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: process.env.SMTP_FROM || 'noreply@gallopliftparts.com',
          to: 'info@gallopliftparts.com',
          replyTo: email,
          subject: `Quote Request from ${name}${company ? ` (${company})` : ''}`,
          text: `Name: ${name}\nEmail: ${email}\nCompany: ${company || 'N/A'}\n\n${fullMessage}`,
        });
      } catch (err) {
        console.error('Email send failed (inquiry still saved):', err);
      }
    }

    return NextResponse.json({ ok: true, id });
  } catch (error) {
    console.error('Quote email error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
