import { lazy } from 'react';

import { Svg } from 'shared/components/Svg';
import { SettingParam } from 'shared/utils';
import { ItemFormValues } from 'modules/Builder/types';
import { ItemResponseType } from 'shared/consts';
import { Item, SingleSelectionConfig, MultipleSelectionConfig, SliderConfig } from 'shared/state';
import { Item as ItemNavigation } from 'shared/components/NavigationMenu/NavigationMenu.types';
import { Mixpanel } from 'shared/utils/mixpanel';

import { SubscalesConfiguration } from './SubscalesConfiguration';
import { ScoresAndReports } from './ScoresAndReports';
import { GetActivitySettings } from './ActivitySettings.types';
import { ItemsWithScore } from './ScoresAndReports/ScoreContent/ScoreContent.types';

const ReportConfigSetting = lazy(() => import('modules/Builder/features/ReportConfigSetting'));

export const getActivitySettings = ({
  activity,
  activityFieldName,
  settingsErrors: { hasActivityReportsErrors, hasActivitySubscalesErrors },
}: GetActivitySettings): ItemNavigation[] => {
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
          onClick: () => Mixpanel.track('Scores and Report Button Click'),
        },
        {
          label: 'reportConfiguration',
          icon: <Svg id="configure" />,
          component: <ReportConfigSetting data-testid={`${dataTestid}-report-config-form`} />,
          param: SettingParam.ReportConfiguration,
          disabled: isNewActivity,
          tooltip: isNewActivity ? 'saveAndPublishFirst' : undefined,
          'data-testid': `${dataTestid}-report-config`,
          onClick: () => Mixpanel.track('Activity - Report Configuration Click'),
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

export const checkOnItemTypeAndScore = (item: ItemFormValues | Item): item is ItemsWithScore =>
  (item.config as SingleSelectionConfig | MultipleSelectionConfig | SliderConfig)?.addScores &&
  [
    ItemResponseType.SingleSelection,
    ItemResponseType.MultipleSelection,
    ItemResponseType.Slider,
  ].includes(item.responseType);
