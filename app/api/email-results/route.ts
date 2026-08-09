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

    const { results } = await req.json();
    const userEmail = user.emailAddresses[0].emailAddress;

    // Send formatted HTML email
    await resend.emails.send({
      from: 'WanderLink Travel <recommendations@wanderlinktravel.com>',
      to: [userEmail],
      subject: '✈️ Your WanderLink Travel DNA Recommendations',
      html: `
        <div style="font-family: sans-serif; background-color: #0F172A; color: #F8FAFC; padding: 24px; border-radius: 12px;">
          <h2 style="color: #10B981;">WanderLink Travel Intelligence</h2>
          <p>Here are your requested travel recommendations:</p>
          <hr style="border-color: #334155;" />
          ${results
            .map(
              (item: any) => `
            <div style="margin-bottom: 20px;">
              <h3 style="color: #F59E0B; margin-bottom: 4px;">${item.destination} (Match: ${item.matchScore}%)</h3>
              <p style="font-style: italic;">"${item.heroTagline}"</p>
              <ul>
                ${item.reasonsToVisit.map((r: string) => `<li>${r}</li>`).join('')}
              </ul>
            </div>
          `
            )
            .join('')}
          <a href="https://www.wanderlinktravel.com/results" style="display: inline-block; padding: 12px 20px; background-color: #10B981; color: #0F172A; text-decoration: none; font-weight: bold; border-radius: 8px;">View Active Bookings</a>
        </div>
      `,
    });

    return NextResponse.json({ success: true, sentTo: userEmail });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

