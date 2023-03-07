/* eslint-disable camelcase */
import { Box } from '@mui/system';

import i18n from 'i18n';
import { Svg } from 'shared/components';
import { variables } from 'shared/styles/variables';
import theme from 'shared/styles/theme';

import { Available, Schedules } from './Legend.const';

export const getIndicatorColor = (type: string) => {
  const {
    blue,
    blue_alfa30,
    green,
    green_alfa30,
    yellow,
    yellow_alfa30,
    orange,
    orange_alfa30,
    red,
    red_alfa30,
  } = variables.palette;

  switch (type) {
    case Schedules.PreQuestionnaire:
      return [green, green_alfa30];

    case Schedules.MorningAssessment:
      return [yellow, yellow_alfa30];
    case Schedules.MiddayAssessment:
      return [orange, orange_alfa30];
    case Schedules.EveningAssessment:
      return [red, red_alfa30];
    case Available.EmotionalSupport:
      return [blue, blue];
    case Available.IncentiveActivity:
      return [green, green];
    default:
      return [blue, blue_alfa30];
  }
};

export const getTitle = (type: string) => {
  const { t } = i18n;

  if (type === Schedules.PreQuestionnaire) {
    return (
      <>
        <Svg id="flow" width={16} height={16} />
        <Box sx={{ marginLeft: theme.spacing(0.4) }}>{t(type)}</Box>
      </>
    );
  }

  return t(type);
};
