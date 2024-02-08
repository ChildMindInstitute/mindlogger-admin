import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import fr from 'javascript-time-ago/locale/fr';
import { useTranslation } from 'react-i18next';

import { LANGUAGES } from 'shared/api/api.const';

TimeAgo.addLocale(en);
TimeAgo.addLocale(fr);

export const useTimeAgo = () => {
  const { i18n } = useTranslation('app');

  return new TimeAgo(LANGUAGES[i18n.language as keyof typeof LANGUAGES].replace('_', '-'));
};
