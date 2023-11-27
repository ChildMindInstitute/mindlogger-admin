import i18n from 'i18next';
import { ActivityFlowFormValues } from 'modules/Builder/types';
import { Svg } from 'shared/components/Svg';
import { ReportConfigSetting } from 'modules/Builder/features/ReportConfigSetting';
import { SettingParam } from 'shared/utils';

const { t } = i18n;

export const getSettings = (activityFlow: ActivityFlowFormValues) => {
  const isNewActivityFlow = !activityFlow?.id;
  const dataTestid = 'builder-activity-flows-settings-report-config';

  return [
    {
      label: 'reports',
      items: [
        {
          name: 'reportConfiguration',
          label: t('reportConfiguration'),
          component: <ReportConfigSetting data-testid={`${dataTestid}-form`} />,
          icon: <Svg id="configure" />,
          param: SettingParam.ReportConfiguration,
          disabled: isNewActivityFlow,
          tooltip: isNewActivityFlow ? 'saveAndPublishFirst' : undefined,
          'data-testid': dataTestid,
        },
      ],
    },
  ];
};
