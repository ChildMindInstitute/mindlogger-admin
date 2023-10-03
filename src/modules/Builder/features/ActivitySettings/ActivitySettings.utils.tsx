import { Svg } from 'shared/components/Svg';
import { ReportConfigSetting } from 'shared/features/AppletSettings';
import { SettingParam } from 'shared/utils';

import { SubscalesConfiguration } from './SubscalesConfiguration';
import { ScoresAndReports } from './ScoresAndReports';
import { GetActivitySettings } from './ActivitySettings.types';

export const getActivitySettings = ({
  activity,
  activityFieldName,
  settingsErrors: { hasActivityReportsErrors, hasActivitySubscalesErrors },
}: GetActivitySettings) => {
  const isNewActivity = !activity?.id;
  const dataTestid = 'builder-activity-settings';

  return [
    {
      label: 'reports',
      items: [
        {
          label: 'scoresAndReports',
          icon: <Svg id="scores-and-reports" />,
          component: <ScoresAndReports />,
          param: SettingParam.ScoresAndReports,
          hasError: hasActivityReportsErrors,
          'data-testid': `${dataTestid}-scores-and-reports`,
        },
        {
          label: 'reportConfiguration',
          icon: <Svg id="configure" />,
          component: <ReportConfigSetting data-testid={`${dataTestid}-report-config-form`} />,
          param: SettingParam.ReportConfiguration,
          disabled: isNewActivity,
          tooltip: isNewActivity ? 'saveAndPublishFirst' : undefined,
          'data-testid': `${dataTestid}-report-config`,
        },
      ],
    },
    {
      label: 'subscales',
      items: [
        {
          label: 'subscalesConfiguration',
          icon: <Svg id="grid-outlined" />,
          component: (
            <SubscalesConfiguration key={`subscales-configuration-${activityFieldName}`} />
          ),
          param: SettingParam.SubscalesConfiguration,
          hasError: hasActivitySubscalesErrors,
          'data-testid': `${dataTestid}-subscales-config`,
        },
      ],
    },
  ];
};
