import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { Resend } from 'resend';
import type { TripCostResult } from '@/lib/trip-cost';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { origin, destination, attraction, result } = (await req.json()) as {
      origin?: string;
      destination?: string;
      attraction?: string;
      result?: TripCostResult;
    };
    const userEmail = user.emailAddresses[0].emailAddress;

    if (!destination || !result) {
      return NextResponse.json({ error: 'Missing destination or cost estimate.' }, { status: 400 });
    }

    const lineItemsHtml = result.lineItems
      .map((item) => `<tr><td style="padding:6px 0;color:#E2E8F0;">${item.label}</td><td style="padding:6px 0;color:#94A3B8;font-size:12px;">${item.detail}</td><td style="padding:6px 0;text-align:right;color:#5EEAD4;font-weight:bold;">A$${item.amount.toLocaleString()}</td></tr>`)
      .join('');

    const html = `
      <div style="font-family: sans-serif; background-color: #0F172A; color: #F8FAFC; padding: 24px; border-radius: 12px;">
        <h2 style="color: #FBBF24; margin: 0 0 8px;">🧮 Your Smart Trip Cost Estimate</h2>
        <h3 style="color: #F8FAFC; margin: 0 0 16px; font-size: 22px;">${origin || ''} → ${destination}${attraction ? ` · ${attraction}` : ''}</h3>

        <div style="background: #1F2937; border: 1px solid #4B5563; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
          <p style="margin: 0 0 4px; color: #E2E8F0; font-size: 28px; font-weight: bold;">A$${result.total.toLocaleString()}</p>
          <p style="margin: 0; color: #94A3B8; font-size: 13px;">Planning range A$${result.lowTotal.toLocaleString()}–A$${result.highTotal.toLocaleString()} (AUD)</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
          ${lineItemsHtml}
        </table>

        <p style="color: #94A3B8; font-size: 12px; margin: 0 0 16px;">
          This is a planning estimate, not a live quote. Confirm current prices with each provider before booking.
        </p>

        <a href="https://www.wanderlinktravel.com/trip-cost" style="display: inline-block; padding: 10px 16px; background-color: #FBBF24; color: #0F172A; text-decoration: none; font-weight: bold; border-radius: 8px;">Recalculate on WanderLink</a>
      </div>
    `;

    await resend.emails.send({
      from: 'WanderLink Travel <recommendations@wanderlinktravel.com>',
      to: [userEmail],
      subject: `🧮 Your ${destination} Trip Cost Estimate`,
      html,
    });

    return NextResponse.json({ success: true, sentTo: userEmail });
  } catch (error: any) {
    console.error('Email trip cost error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}
