/* eslint-disable camelcase */
import { Box } from '@mui/system';

import i18n from 'i18n';
import { Svg } from 'components';
import { variables } from 'styles/variables';
import theme from 'styles/theme';

import { Schedules } from './Legend.const';

export const getScheduledIndicatorColor = (type: string) => {
  const {
    blue,
    blue_alfa30,
    green,
    green_alfa30,
    yelow,
    yelow_alfa30,
    orange,
    orange_alfa30,
    red,
    red_alfa30,
  } = variables.palette;

  switch (type) {
    case Schedules.PreQuestionnaire:
      return [green, green_alfa30];
    case Schedules.MorningAssessment:
      return [yelow, yelow_alfa30];
    case Schedules.MiddayAssessment:
      return [orange, orange_alfa30];
    case Schedules.EveningAssessment:
      return [red, red_alfa30];
    default:
      return [blue, blue_alfa30];
  }
};

export const getScheduledTitle = (type: string) => {
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
