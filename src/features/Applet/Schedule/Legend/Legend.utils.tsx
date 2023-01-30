/* eslint-disable camelcase */
import { Box } from '@mui/system';

import i18n from 'i18n';
import { Svg } from 'components';
import { variables } from 'styles/variables';
import theme from 'styles/theme';

import { schedules } from './Legend.const';

export const getScheduledIndicatorColor = (type: string) => {
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
    case schedules.preQuestionnaire:
      return [green, green_alfa30];
    case schedules.morningAssessment:
      return [yellow, yellow_alfa30];
    case schedules.middayAssessment:
      return [orange, orange_alfa30];
    case schedules.eveningAssessment:
      return [red, red_alfa30];
    default:
      return [blue, blue_alfa30];
  }
};

export const getScheduledTitle = (type: string) => {
  const { t } = i18n;

  if (type === schedules.preQuestionnaire) {
    return (
      <>
        <Svg id="flow" width={16} height={16} />
        <Box sx={{ marginLeft: theme.spacing(0.4) }}>{t(type)}</Box>
      </>
    );
  }

  return t(type);
};
