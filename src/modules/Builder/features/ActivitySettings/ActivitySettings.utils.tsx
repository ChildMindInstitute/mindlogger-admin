import i18n from 'i18next';

import { Svg } from 'shared/components';
import { ItemFormValues } from 'modules/Builder/types';
import { ItemResponseType, REPORT_CONFIG_PARAM } from 'shared/consts';
import { Item, SingleAndMultipleSelectionConfig, SliderConfig } from 'shared/state';
import { ReportConfigSetting } from 'shared/features/AppletSettings';

import { SubscalesConfiguration } from './SubscalesConfiguration';
import { ScoresAndReports } from './ScoresAndReports';

const { t } = i18n;

export const getSettings = (activityFieldName?: string) => [
  {
    label: 'reports',
    items: [
      {
        label: t('scoresAndReports'),
        component: <ScoresAndReports />,
        icon: <Svg id="scores-and-reports" />,
        param: 'scores-and-reports',
      },
      {
        label: t('reportConfiguration'),
        component: <ReportConfigSetting />,
        icon: <Svg id="report-configuration" />,
        param: REPORT_CONFIG_PARAM,
      },
    ],
  },
  {
    label: 'subscales',
    items: [
      {
        label: t('subscalesConfiguration'),
        component: <SubscalesConfiguration key={`subscales-configuration-${activityFieldName}`} />,
        icon: <Svg id="grid-outlined" />,
        param: 'subscales-configuration',
      },
    ],
  },
];

export const checkOnItemTypeAndScore = (item: ItemFormValues | Item) =>
  (item.config as SingleAndMultipleSelectionConfig | SliderConfig).addScores &&
  [
    ItemResponseType.SingleSelection,
    ItemResponseType.MultipleSelection,
    ItemResponseType.Slider,
  ].includes(item.responseType as ItemResponseType);
