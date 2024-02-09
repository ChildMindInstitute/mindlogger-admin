import { format } from 'date-fns';

import { Periodicity } from 'modules/Dashboard/api';
import { DateFormats, Roles } from 'shared/consts';
import { variables } from 'shared/styles';
import { without } from 'shared/utils';

import { ActivitiesFlowsWithColors } from './Schedule.types';

export const getCount = (ids: ActivitiesFlowsWithColors, id: string) => ids.filter((item) => item.id === id).length;

export const convertDateToYearMonthDay = (date: Date | string) =>
  typeof date === 'string' ? date : format(date, DateFormats.YearMonthDay);

const {
  blue,
  blue_alfa30,
  brown,
  brown_alfa30,
  gray,
  gray_alfa30,
  green,
  green_alfa30,
  orange,
  orange_alfa30,
  pink,
  pink_alfa30,
  yellow,
  yellow_alfa30,
  purple,
  purple_alfa30,
  red,
  red_alfa30,
} = variables.palette;

export const colorsArray = [
  [blue, blue_alfa30],
  [green, green_alfa30],
  [orange, orange_alfa30],
  [brown, brown_alfa30],
  [yellow, yellow_alfa30],
  [pink, pink_alfa30],
  [gray, gray_alfa30],
  [red, red_alfa30],
  [purple, purple_alfa30],
];

export const getNextColor = (index: number) => {
  const colorIndex = index % colorsArray.length;

  return colorsArray[colorIndex];
};

export const getFrequencyString = (periodicity: Periodicity) =>
  String(periodicity).charAt(0) + String(periodicity).slice(1).toLowerCase();

export const checkIfHasAccessToSchedule = (roles?: Roles[]) =>
  without(roles, [Roles.Editor, Roles.Reviewer, Roles.Respondent]).length > 0;
