import type { Metadata } from 'next';
import Link from 'next/link';
import ComingSoonOverlay from '@/components/ComingSoonOverlay';
import { isComingSoonEnabled } from '@/lib/coming-soon';
import './globals.css'
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google';
import Analytics from '@/components/Analytics';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.wanderlinktravel.com';
const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-3063787366310725';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})


export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'WanderLink Travel | AI Travel Intelligence',
  description: 'Find destinations matched to your budget, travel style, climate, and interests with WanderLink AI travel recommendations.',
  keywords: [
    'AI travel planner',
    'travel destination recommendations',
    'personalized travel quiz',
    'travel DNA',
    'trip planner',
    'vacation ideas',
    'family travel destinations',
    'travel itinerary generator',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: 'WanderLink Travel | AI Travel Intelligence',
    description: 'Discover destinations and trip ideas matched to your unique travel preferences.',
    siteName: 'WanderLink Travel',
    images: [{ url: '/fb-cover.png', width: 1200, height: 630, alt: 'WanderLink Travel' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WanderLink Travel | AI Travel Intelligence',
    description: 'Discover destinations matched to your Travel DNA.',
    images: ['/fb-cover.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
  other: {
    'impact-site-verification': '98abc6eb-ac5e-440f-8aa4-11a344cae38e',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const comingSoon = isComingSoonEnabled();

  if (comingSoon) {
    return (
      <html lang="en" className="scroll-smooth">
        <head>
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
          />
        </head>
        <body className="bg-slate-900 text-slate-100 font-sans min-h-screen overflow-hidden selection:bg-teal-500 selection:text-slate-950">
          <ClerkProvider>
            <div className="pointer-events-none select-none" aria-hidden="true">
              <main>{children}</main>
            </div>
            <ComingSoonOverlay />
          </ClerkProvider>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-slate-900 text-slate-100 font-sans min-h-screen flex flex-col justify-between selection:bg-teal-500 selection:text-slate-950">
        <ClerkProvider>
          <Analytics />
          {/* 🧭 GLOBAL NAVIGATION HEADER */}
          <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-md">
            <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
              
              {/* Logo Brand */}
              <Link href="/" className="flex items-center space-x-3.5 group">
                <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md group-hover:scale-105 transition-transform">
                  <img src="/logo.svg" alt="WanderLink Logo" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black tracking-tight text-white leading-none">
                    Wander<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400">Link</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">
                    Travel Intelligence
                  </span>
                </div>
              </Link>

              {/* Navigation Links */}
              <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-300">
                <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
                <Link href="/questionnaire" className="hover:text-emerald-400 transition-colors">Quiz</Link>
                <Link href="/trip-cost" className="hover:text-amber-400 transition-colors">Trip Cost</Link>
                <Link href="/results" className="hover:text-teal-400 transition-colors">Results</Link>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden lg:flex items-center gap-4">
                  <Show when="signed-out">
                    <SignInButton>
                      <button className="bg-slate-800 hover:bg-slate-700 transition-colors rounded-full text-sm text-slate-100 font-semibold px-4 py-2">
                        Sign In
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="bg-purple-700 text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                        Sign Up
                      </button>
                    </SignUpButton>
                  </Show>
                  <Show when="signed-in">
                    <UserButton />
                  </Show>
                </div>

                {/* CTA Button */}
                <Link
                  href="/questionnaire"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 hover:from-emerald-400 hover:to-amber-400 text-slate-950 font-extrabold text-sm shadow-md shadow-teal-500/20 transition-all transform hover:-translate-y-0.5"
                >
                  Start DNA Quiz ✨
                </Link>
              </div>
            </div>
          </header>

          {/* 📄 MAIN PAGE CONTENT */}
          <main className="flex-grow">{children}</main>

          {/* 🦶 GLOBAL FOOTER */}
          <footer className="bg-slate-950 border-t border-slate-800 text-xs text-slate-400 py-10">
            <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="flex items-center space-x-3">
                <img src="/logo.svg" alt="Logo" className="w-6 h-6" />
                <span className="font-bold text-slate-300 text-sm">WanderLink Travel</span>
              </div>

              <div className="flex space-x-8 font-medium">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <Link href="/questionnaire" className="hover:text-white transition-colors">Quiz</Link>
                <Link href="/results" className="hover:text-white transition-colors">Results</Link>
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                <Link href="/affiliate-disclosure" className="hover:text-white transition-colors">Affiliate Disclosure</Link>
                <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
              </div>
              <p>© {new Date().getFullYear()} WanderLink Travel. All rights reserved.</p>
            </div>
          </footer>
        </ClerkProvider>
      </body>
    </html>
  );
}
