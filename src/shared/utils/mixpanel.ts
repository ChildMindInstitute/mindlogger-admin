import { Dict } from 'mixpanel-browser';

const PROJECT_TOKEN = process.env.REACT_APP_MIXPANEL_TOKEN;

const isProduction = process.env.REACT_APP_ENV === 'prod';
const isStaging = process.env.REACT_APP_ENV === 'stage';
const shouldEnableMixpanel = PROJECT_TOKEN && (isProduction || isStaging);

const { default: mixpanel } = await import('mixpanel-browser');

export const Mixpanel = {
  init() {
    if (shouldEnableMixpanel) mixpanel.init(PROJECT_TOKEN);
  },
  trackPageView(pageName: string) {
    if (shouldEnableMixpanel) mixpanel.track_pageview({ page: `[Admin] ${pageName}` });
  },
  track(action: string, payload?: Dict) {
    if (shouldEnableMixpanel) mixpanel.track(`[Admin] ${action}`, payload);
  },
  login(userId: string) {
    if (shouldEnableMixpanel) mixpanel.identify(userId);
  },
  logout() {
    if (shouldEnableMixpanel) mixpanel.reset();
  },
};
