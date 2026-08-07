import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'WanderLink Travel | AI Travel Intelligence',
  description: 'Precision destination matching powered by AI and Travel DNA.',
  other: {
    'impact-site-verification': '98abc6eb-ac5e-440f-8aa4-11a344cae38e',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-slate-900 text-slate-100 font-sans min-h-screen flex flex-col justify-between selection:bg-teal-500 selection:text-slate-950">
        
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
              <Link href="/results" className="hover:text-teal-400 transition-colors">Results</Link>
            </div>

            {/* CTA Button */}
            <Link
              href="/questionnaire"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 hover:from-emerald-400 hover:to-amber-400 text-slate-950 font-extrabold text-sm shadow-md shadow-teal-500/20 transition-all transform hover:-translate-y-0.5"
            >
              Start DNA Quiz ✨
            </Link>
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
            </div>

            <p>© {new Date().getFullYear()} WanderLink Travel. All rights reserved.</p>
          </div>
        </footer>

      </body>
    </html>
  );
}
