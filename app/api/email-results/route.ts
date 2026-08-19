import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { Resend } from 'resend';
import { buildAviasalesUrl } from '@/lib/aviasales';
import { buildStay22Url } from '@/lib/stay22';

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
    const destinationList = Array.isArray(results) ? results : [];

    if (!destinationList.length) {
      return NextResponse.json({ error: 'No destination details to email.' }, { status: 400 });
    }

    const html = `
      <div style="font-family: sans-serif; background-color: #0F172A; color: #F8FAFC; padding: 24px; border-radius: 12px;">
        <h2 style="color: #10B981;">WanderLink Travel Intelligence</h2>
        <p>Here are your requested travel recommendations:</p>
        <hr style="border-color: #334155;" />
        ${destinationList
          .map((item: any) => {
            const reasons = Array.isArray(item.reasonsToVisit) ? item.reasonsToVisit : [];
            const highlights = Array.isArray(item.keyHighlights) ? item.keyHighlights : [];
            const visitorExperiences = Array.isArray(item.realVisitorExperiences) ? item.realVisitorExperiences : [];
            const weather = item.utilityData?.weatherForecast || item.weatherPrediction || 'Flexible weather';
            const visa = item.utilityData?.visaStatus || 'Visa-free';
            const currency = item.utilityData?.currency || 'Local currency';
            const safety = item.utilityData?.safetyRating || 'Standard precautions';
            const hotelUrl = buildStay22Url({
              destination: item.affiliateQuery || item.destination,
              adults: item.adults || 1,
              children: item.children || 0,
            });
            const flightUrl = buildAviasalesUrl({
              origin: item.sourceCity || 'Sydney',
              destination: item.destination,
              destinationCode: item.airportCode,
              adults: item.adults || 1,
              children: item.children || 0,
            });
            const tourUrl = item.viatorTours?.[0]?.productUrl || `https://www.viator.com/search/${encodeURIComponent(item.affiliateQuery || item.destination)}`;
            const visaUrl = item.utilityData?.visaApplyUrl || 'https://www.google.com/search?q=' + encodeURIComponent(`${item.destination} visa`);

            return `
              <div style="margin-bottom: 24px; padding: 16px; background: #111827; border: 1px solid #334155; border-radius: 12px;">
                <h3 style="color: #F59E0B; margin: 0 0 8px;">${item.destination} (Match: ${item.matchScore}%)</h3>
                <p style="font-style: italic; color: #E2E8F0; margin: 0 0 12px;">"${item.heroTagline || 'Perfectly matched for your trip.'}"</p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 8px; margin-bottom: 12px;">
                  <div style="background:#0F172A; border:1px solid #334155; border-radius:8px; padding:8px; font-size:12px;">☀️ Weather: ${weather}</div>
                  <div style="background:#0F172A; border:1px solid #334155; border-radius:8px; padding:8px; font-size:12px;">🛂 Visa: ${visa}</div>
                  <div style="background:#0F172A; border:1px solid #334155; border-radius:8px; padding:8px; font-size:12px;">💰 Currency: ${currency}</div>
                  <div style="background:#0F172A; border:1px solid #334155; border-radius:8px; padding:8px; font-size:12px;">🛡️ Safety: ${safety}</div>
                </div>
                <div style="margin: 12px 0 8px; display: flex; flex-wrap: wrap; gap: 8px;">
                  <a href="${hotelUrl}" style="display: inline-block; padding: 8px 12px; background-color: #10B981; color: #0F172A; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 12px;">Find Accommodation</a>
                  <a href="${flightUrl}" style="display: inline-block; padding: 8px 12px; background-color: #F59E0B; color: #0F172A; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 12px;">Search Flights</a>
                  <a href="${tourUrl}" style="display: inline-block; padding: 8px 12px; background-color: #1D4ED8; color: white; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 12px;">Book Tours</a>
                  <a href="${visaUrl}" style="display: inline-block; padding: 8px 12px; background-color: #334155; color: white; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 12px;">Visa Info</a>
                </div>
                <ul>
                  ${reasons.map((r: string) => `<li style="margin-bottom: 6px;">${r}</li>`).join('')}
                </ul>
                <p style="font-weight: bold; margin: 12px 0 8px;">Highlights:</p>
                <ul>
                  ${highlights.map((h: string) => `<li style="margin-bottom: 6px;">${h}</li>`).join('')}
                </ul>
                ${visitorExperiences.length ? `<p style="font-weight: bold; margin: 12px 0 8px;">Visitor Favorites:</p><ul>${visitorExperiences.map((v: any) => `<li style="margin-bottom: 6px;">${v.name} — ★ ${v.rating} (${v.reviews} reviews)</li>`).join('')}</ul>` : ''}
              </div>
            `;
          })
          .join('')}
        <a href="https://www.wanderlinktravel.com/results" style="display: inline-block; padding: 12px 20px; background-color: #10B981; color: #0F172A; text-decoration: none; font-weight: bold; border-radius: 8px;">View Results</a>
      </div>
    `;

    await resend.emails.send({
      from: 'WanderLink Travel <recommendations@wanderlinktravel.com>',
      to: [userEmail],
      subject: '✈️ Your WanderLink Travel DNA Recommendations',
      html,
    });

    return NextResponse.json({ success: true, sentTo: userEmail });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

