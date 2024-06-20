import { MixPayload } from 'shared/utils/mixpanel/mixpanel.types';

import { isProduction, isStaging, isUat, isDev } from '../env';

const PROJECT_TOKEN = process.env.REACT_APP_MIXPANEL_TOKEN;
const isJest = !!process.env.JEST_WORKER_ID;
const shouldEnableMixpanel =
  PROJECT_TOKEN &&
  !isJest &&
  (isProduction || isStaging || isUat || process.env.REACT_APP_MIXPANEL_FORCE_ENABLE === 'true');

export const Mixpanel = {
  async init() {
    if (shouldEnableMixpanel) {
      const { default: mixpanel } = await import('mixpanel-browser');
      mixpanel.init(PROJECT_TOKEN, { ignore_dnt: isDev });
    }
  },
  async trackPageView(pageName: string) {
    if (shouldEnableMixpanel) {
      const { default: mixpanel } = await import('mixpanel-browser');
      mixpanel.track_pageview({ page: `[Admin] ${pageName}` });
    }
  },
  async track(action: string, payload?: MixPayload) {
    if (shouldEnableMixpanel) {
      const { default: mixpanel } = await import('mixpanel-browser');
      mixpanel.track(`[Admin] ${action}`, payload);
    }
  },
  async login(userId: string) {
    if (shouldEnableMixpanel) {
      const { default: mixpanel } = await import('mixpanel-browser');
      mixpanel.identify(userId);
      mixpanel.people.set({
        'User ID': userId,
        'App Build Number': process.env.REACT_APP_DEVELOP_BUILD_VERSION,
      });
    }
  },
  async logout() {
    if (shouldEnableMixpanel) {
      const { default: mixpanel } = await import('mixpanel-browser');
      mixpanel.reset();
    }
  },
};
