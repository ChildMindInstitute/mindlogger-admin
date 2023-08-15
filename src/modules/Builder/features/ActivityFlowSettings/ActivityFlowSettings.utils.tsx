import i18n from 'i18next';
import { ActivityFlowFormValues } from 'modules/Builder/types';
import { Svg } from 'shared/components';
import { REPORT_CONFIG_PARAM } from 'shared/consts';
import { ReportConfigSetting } from 'shared/features/AppletSettings';

const { t } = i18n;

export const getSettings = (activityFlow: ActivityFlowFormValues) => [
  {
    label: 'reports',
    items: [
      {
        name: 'reportConfiguration',
        label: t('reportConfiguration'),
        component: <ReportConfigSetting activityFlow={activityFlow} />,
        icon: <Svg id="report-configuration" />,
        param: REPORT_CONFIG_PARAM,
      },
    ],
  },
];
