import { MixpanelPayload, MixpanelAction } from 'shared/utils/mixpanel/mixpanel.types';

import { isProduction, isStaging, isUat, isDev } from '../env';

const PROJECT_TOKEN = process.env.REACT_APP_MIXPANEL_TOKEN;
const isJest = !!process.env.JEST_WORKER_ID;
const shouldEnableMixpanel =
  PROJECT_TOKEN &&
  !isJest &&
  (isProduction || isStaging || isUat || process.env.REACT_APP_MIXPANEL_FORCE_ENABLE === 'true');

export const Mixpanel = {
  init() {
    if (shouldEnableMixpanel) {
      import('mixpanel-browser').then(({ default: mixpanel }) => {
        mixpanel.init(PROJECT_TOKEN, { ignore_dnt: isDev });
      });
    }
  },
  trackPageView(pageName: string) {
    if (shouldEnableMixpanel) {
      import('mixpanel-browser').then(({ default: mixpanel }) => {
        mixpanel.track_pageview({ page: `[Admin] ${pageName}` });
      });
    }
  },
  track(action: MixpanelAction, payload?: MixpanelPayload) {
    if (shouldEnableMixpanel) {
      import('mixpanel-browser').then(({ default: mixpanel }) => {
        mixpanel.track(`[Admin] ${action}`, payload);
      });
    }
  },
  login(userId: string) {
    if (shouldEnableMixpanel) {
      import('mixpanel-browser').then(({ default: mixpanel }) => {
        mixpanel.identify(userId);
      });
      mixpanel.people.set({
        'User ID': userId,
        'App Build Number': process.env.REACT_APP_DEVELOP_BUILD_VERSION,
      });
    }
  },
  logout() {
    if (shouldEnableMixpanel) {
      import('mixpanel-browser').then(({ default: mixpanel }) => {
        mixpanel.reset();
      });
    }
  },
};
