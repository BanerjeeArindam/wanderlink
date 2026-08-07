export function isComingSoonEnabled(): boolean {
  return process.env.COMING_SOON !== 'false';
}
