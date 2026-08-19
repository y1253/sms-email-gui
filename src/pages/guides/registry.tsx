import type { ComponentType } from 'react';
import CarrierShutdown from './CarrierEmailToTextShutdown';
import ForwardGmail from './ForwardGmailToTextMessage';
import WithoutInternet from './ReadEmailWithoutInternet';
import GatewayList from './CarrierEmailToSmsGatewayList';
import AlertsByText from './EmailAlertsByText';
import VsPush from './EmailToTextVsPushNotifications';

/**
 * slug -> article body. Paired with GUIDES in src/seo/routes.ts, which owns the
 * metadata for the same slugs. Static imports only: a lazy boundary would
 * render a Suspense fallback that doesn't match the prerendered HTML.
 */
export const GUIDE_COMPONENTS: Record<string, ComponentType> = {
  'carrier-email-to-text-shutdown': CarrierShutdown,
  'forward-gmail-to-text-message': ForwardGmail,
  'read-email-without-internet': WithoutInternet,
  'carrier-email-to-sms-gateway-list': GatewayList,
  'email-alerts-by-text': AlertsByText,
  'email-to-text-vs-push-notifications': VsPush,
};
