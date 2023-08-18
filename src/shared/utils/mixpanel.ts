import mixpanel, { Dict } from 'mixpanel-browser';
import UAParser from 'ua-parser-js';

mixpanel.init('YOUR_MIXPANEL_TOKEN');

const isProduction = process.env.REACT_APP_ENV === 'PRODUCTION';
const isStaging = process.env.REACT_APP_ENV === 'STAGE';
const shouldEnableMixpanel = isProduction || isStaging;

const uaParser = new UAParser();

export const Mixpanel = {
  init() {
    this.track('INFO', {
      os: uaParser.getOS().name,
      width: window.innerWidth,
      height: window.innerHeight,
    });
  },
  trackPageView(pageName: string) {
    if (shouldEnableMixpanel) mixpanel.track_pageview({ page: `[Admin] ${pageName}` });
  },
  track(action: string, payload?: Dict) {
    if (shouldEnableMixpanel) mixpanel.track(`[Admin] ${action}`, payload);
  },
  logout() {
    mixpanel.reset();
  },
};
