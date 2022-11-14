import i18n from 'i18n';

import { Icon } from 'components/Icon';

const { t } = i18n;

export const TabsList = [
  { label: t('dashboardTabsLabel'), icon: <Icon.Applets />, content: 'content 1' },
  { label: t('dashboardTabsLabel2'), icon: <Icon.Manager />, content: 'content 2' },
  { label: t('dashboardTabsLabel3'), icon: <Icon.Respondent />, content: 'content 3' },
];
