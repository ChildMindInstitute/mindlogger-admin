import i18n from 'i18next';
import { ActivityFlowFormValues } from 'modules/Builder/types';
import { Svg } from 'shared/components';
import { ReportConfigSetting } from 'shared/features/AppletSettings';
import { SettingParam } from 'shared/utils';

const { t } = i18n;

export const getSettings = (activityFlow: ActivityFlowFormValues) => {
  const isActivityFlowSaved = !!activityFlow?.id;

  return [
    {
      label: 'reports',
      items: [
        {
          name: 'reportConfiguration',
          label: t('reportConfiguration'),
          component: <ReportConfigSetting />,
          icon: <Svg id="report-configuration" />,
          param: SettingParam.ReportConfiguration,
          disabled: !isActivityFlowSaved,
          tooltip: !isActivityFlowSaved ? 'saveAndPublishFirst' : undefined,
        },
      ],
    },
  ];
};
