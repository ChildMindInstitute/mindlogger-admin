/* eslint-disable camelcase */
import { Svg } from 'components';
import { variables } from 'styles/variables';

import { schedules } from './Filter.const';

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
    case schedules.PreQuestionnaire:
      return [green, green_alfa30];
    case schedules.MorningAssessment:
      return [yelow, yelow_alfa30];
    case schedules.MiddayAssessment:
      return [orange, orange_alfa30];
    case schedules.EveningAssessment:
      return [red, red_alfa30];
    default:
      return [blue, blue_alfa30];
  }
};

export const getScheduledTitle = (type: string) => {
  if (type === schedules.PreQuestionnaire) {
    return (
      <>
        <Svg id="flow" width={16} height={16} /> {type}
      </>
    );
  }

  return type;
};
