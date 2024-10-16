import { useTranslation } from 'react-i18next';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import fr from 'javascript-time-ago/locale/fr';

import { regionalLangFormats, UiLanguages } from 'shared/ui';

TimeAgo.addLocale(en);
TimeAgo.addLocale(fr);

export const useTimeAgo = () => {
  const { i18n } = useTranslation('app');

  return new TimeAgo(regionalLangFormats[i18n.language as UiLanguages]);
};
