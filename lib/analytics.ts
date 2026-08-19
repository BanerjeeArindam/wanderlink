export type AnalyticsEvent =
  | 'questionnaire_started'
  | 'questionnaire_completed'
  | 'recommendation_generated'
  | 'destination_modal_opened'
  | 'accommodation_link_clicked'
  | 'flight_link_clicked'
  | 'tour_link_clicked'
  | 'sign_up_completed'
  | 'email_results_requested';

export function trackEvent(event: AnalyticsEvent, parameters?: Record<string, string | number | boolean>) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', event, parameters);
}

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}
