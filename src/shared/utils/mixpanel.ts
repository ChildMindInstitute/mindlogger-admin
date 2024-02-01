import { Dict } from 'mixpanel-browser';

import { isProduction, isStaging } from './env';

const PROJECT_TOKEN = process.env.REACT_APP_MIXPANEL_TOKEN;
const shouldEnableMixpanel = PROJECT_TOKEN && (isProduction || isStaging);

export const Mixpanel = {
  async init() {
    if (shouldEnableMixpanel) {
      const { default: mixpanel } = await import('mixpanel-browser');
      mixpanel.init(PROJECT_TOKEN);
    }
  },
  async trackPageView(pageName: string) {
    if (shouldEnableMixpanel) {
      const { default: mixpanel } = await import('mixpanel-browser');
      mixpanel.track_pageview({ page: `[Admin] ${pageName}` });
    }
  },
  async track(action: string, payload?: Dict) {
    if (shouldEnableMixpanel) {
      const { default: mixpanel } = await import('mixpanel-browser');
      mixpanel.track(`[Admin] ${action}`, payload);
    }
  },
  async login(userId: string) {
    if (shouldEnableMixpanel) {
      const { default: mixpanel } = await import('mixpanel-browser');
      mixpanel.identify(userId);
      mixpanel.people.set({ 'User ID': userId });
    }
  },
  async logout() {
    if (shouldEnableMixpanel) {
      const { default: mixpanel } = await import('mixpanel-browser');
      mixpanel.reset();
    }
  },
};
