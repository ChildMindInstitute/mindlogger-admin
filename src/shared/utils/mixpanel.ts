import mixpanel, { Dict } from 'mixpanel-browser';

const isProduction = process.env.REACT_APP_ENV === 'PRODUCTION';
const isStaging = process.env.REACT_APP_ENV === 'STAGE';
const shouldEnableMixpanel = isProduction || isStaging;

// A project's token is not a secret value.
// In front-end implementation this token will be available to anyone visiting the website.
// More on this topic: https://developer.mixpanel.com/reference/project-token;
const PROJECT_TOKEN = '075d1512e69a60bfcd9f7352b21cc4a2';

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
