import mixpanel, { Dict } from 'mixpanel-browser';
import UAParser from 'ua-parser-js';

mixpanel.init('YOUR_MIXPANEL_TOKEN');

const isProduction = process.env.NODE_ENV === 'production';
const isStaging = process.env.NODE_ENV === 'test';
const shouldEnableMixpanel = isProduction || isStaging;

const uaParser = new UAParser();

export const Mixpanel = {
  init() {
    this.track('INFO', {
      os: uaParser.getOS(),
      width: window.innerWidth,
      height: window.innerHeight,
    });
  },
  trackPageView(pageName: string) {
    if (shouldEnableMixpanel) mixpanel.track_pageview({ Admin: pageName });
  },
  track(action: string, payload: Dict) {
    if (shouldEnableMixpanel) mixpanel.track(`[Legacy][Web] ${action}`, payload);
  },
  logout() {
    mixpanel.reset();
  },
};
