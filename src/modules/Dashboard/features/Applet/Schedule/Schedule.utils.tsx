import { variables } from 'shared/styles';
import { Periodicity } from 'modules/Dashboard/api';

import { ActivitiesFlowsWithColors, Repeats } from './Schedule.types';

export const getCount = (ids: ActivitiesFlowsWithColors, id: string) =>
  ids.filter((item) => item.id === id).length;

/* eslint-disable camelcase */
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

const colorsArray = [
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

export const getRepeatsAnswer = (periodicity: Periodicity) => {
  if (periodicity === Periodicity.Always) return Repeats.NotSet;

  return periodicity === Periodicity.Once ? Repeats.No : Repeats.Yes;
};

export const removeSecondsFromTime = (time?: string | null) => {
  if (!time) return null;
  const [hours, minutes] = time.split(':');

  return `${hours}:${minutes}`;
};
