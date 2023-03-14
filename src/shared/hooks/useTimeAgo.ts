import { useTranslation } from 'react-i18next';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import fr from 'javascript-time-ago/locale/fr';

import { LANGUAGES } from 'api';

TimeAgo.addLocale(en);
TimeAgo.addLocale(fr);

export const useTimeAgo = () => {
  const { i18n } = useTranslation('app');

  return new TimeAgo(LANGUAGES[i18n.language as keyof typeof LANGUAGES].replace('_', '-'));
};
