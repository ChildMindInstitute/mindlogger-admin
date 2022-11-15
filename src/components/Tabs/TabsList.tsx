import i18n from 'i18n';

import { Svg } from 'components/Svg';

const { t } = i18n;

export const TabsList = [
  { label: t('dashboardTabsLabel'), icon: <Svg id="applets" />, content: 'content 1' },
  { label: t('dashboardTabsLabel2'), icon: <Svg id="manager" />, content: 'content 2' },
  { label: t('dashboardTabsLabel3'), icon: <Svg id="respondent" />, content: 'content 3' },
];
