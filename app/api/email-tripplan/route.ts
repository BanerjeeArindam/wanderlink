import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { destination, tripPlan, weatherForecast, durationDays } = await req.json();
    const userEmail = user.emailAddresses[0].emailAddress;

    if (!destination || !tripPlan) {
      return NextResponse.json({ error: 'Missing destination or trip plan.' }, { status: 400 });
    }

    const html = `
      <div style="font-family: sans-serif; background-color: #0F172A; color: #F8FAFC; padding: 24px; border-radius: 12px;">
        <h2 style="color: #A78BFA; margin: 0 0 8px;">🗓️ Your Trip Plan</h2>
        <h3 style="color: #F59E0B; margin: 0 0 16px; font-size: 24px;">${destination}</h3>
        
        <div style="background: #1F2937; border: 1px solid #4B5563; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
          <p style="margin: 0 0 8px; color: #E2E8F0;"><strong>Trip Duration:</strong> ${durationDays} days</p>
          ${weatherForecast ? `<p style="margin: 0; color: #E2E8F0;"><strong>Avg Weather:</strong> ${weatherForecast}</p>` : ''}
        </div>

        <h4 style="color: #A78BFA; margin: 16px 0 12px;">Itinerary</h4>
        <div style="background: #0F172A; border-left: 4px solid #A78BFA; border-radius: 8px; padding: 16px; margin-bottom: 16px; white-space: pre-line; line-height: 1.8; font-family: 'Courier New', monospace; font-size: 14px; color: #E2E8F0;">
${tripPlan}
        </div>

        <div style="margin-top: 20px; border-top: 1px solid #334155; padding-top: 16px;">
          <p style="color: #94A3B8; font-size: 12px; margin: 0;">
            Safe travels! For more details, visit your WanderLink results page.
          </p>
        </div>
      </div>
    `;

    await resend.emails.send({
      from: 'WanderLink Travel <recommendations@wanderlinktravel.com>',
      to: [userEmail],
      subject: `✈️ Your ${destination} Trip Plan - ${durationDays} Days`,
      html,
    });

    return NextResponse.json({ success: true, sentTo: userEmail });
  } catch (error: any) {
    console.error('Email trip plan error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}
