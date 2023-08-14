import i18n from 'i18next';
import { Svg } from 'shared/components';
import { REPORT_CONFIG_PARAM } from 'shared/consts';
import { ReportConfigSetting } from 'shared/features/AppletSettings';

const { t } = i18n;

export const getSettings = () => [
  {
    label: 'reports',
    items: [
      {
        name: 'reportConfiguration',
        label: t('reportConfiguration'),
        component: <ReportConfigSetting isActivityFlow />,
        icon: <Svg id="report-configuration" />,
        param: REPORT_CONFIG_PARAM,
      },
    ],
  },
];
