import { format, isValid, parseISO } from 'date-fns';

import { variables } from 'shared/styles';
import { Periodicity } from 'modules/Dashboard/api';
import { DateFormats, Roles } from 'shared/consts';
import { getNormalizedTimezoneDate, without } from 'shared/utils';

import { ActivitiesFlowsWithColors } from './Schedule.types';
import { iso8601DateOnlyRegex, iso8601DateTimeRegex } from './Schedule.const';

export const getCount = (ids: ActivitiesFlowsWithColors, id: string) =>
  ids.filter((item) => item.id === id).length;

export const convertDateToYearMonthDay = (date: Date | string) =>
  typeof date === 'string' ? date : format(date, DateFormats.YearMonthDay);

// get date string in format 'dd MMM yyyy'
export const getEventStartDMYString = (isAlwaysAvailable: boolean, dateString?: string | null) => {
  // Return the current date in the specified format if dateString is not provided or invalid
  if (
    !dateString ||
    (!iso8601DateTimeRegex.test(dateString) && !iso8601DateOnlyRegex.test(dateString)) ||
    !isValid(parseISO(dateString))
  ) {
    return format(new Date(), DateFormats.DayMonthYear);
  }

  if (isAlwaysAvailable) {
    // Get date string from standardized date string (e.g., '2023-12-21T15:12:34.842050')
    return format(new Date(dateString), DateFormats.DayMonthYear);
  }

  // Get date string from year-month-day string (e.g., '2024-06-12')
  return format(getNormalizedTimezoneDate(dateString), DateFormats.DayMonthYear);
};

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
