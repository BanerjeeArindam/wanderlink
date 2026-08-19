'use client';

import { SignInButton, SignUpButton } from '@clerk/nextjs';

interface RegistrationPromptProps {
  compact?: boolean;
}

export default function RegistrationPrompt({ compact = false }: RegistrationPromptProps) {
  return (
    <div className={compact
      ? 'flex items-center gap-2 text-xs text-slate-400'
      : 'rounded-xl border border-teal-500/20 bg-teal-500/10 p-4 text-sm text-slate-300'}
    >
      {!compact && <span className="mr-1" aria-hidden="true">🔒</span>}
      <span>{compact ? 'Register to unlock saved trips and actions' : 'Create a free account to unlock 10 daily searches, saved itineraries, and travel actions.'}</span>
      <SignUpButton mode="modal">
        <button type="button" className="shrink-0 rounded-lg bg-teal-500 px-3 py-2 font-bold text-slate-950 transition-colors hover:bg-teal-400">
          Register free
        </button>
      </SignUpButton>
      {compact && (
        <SignInButton mode="modal">
          <button type="button" className="shrink-0 text-teal-300 hover:text-teal-200">Sign in</button>
        </SignInButton>
      )}
    </div>
  );
}
