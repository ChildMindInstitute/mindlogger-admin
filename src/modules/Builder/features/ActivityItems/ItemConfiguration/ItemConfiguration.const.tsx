import { itemsTypeIcons } from 'shared/consts';
import { ItemResponseType } from 'shared/consts';
import { createArray } from 'shared/utils';
import {
  DEFAULT_SLIDER_MAX_NUMBER,
  DEFAULT_SLIDER_MAX_VALUE,
  DEFAULT_SLIDER_MIN_NUMBER,
  DEFAULT_SLIDER_ROWS_MIN_NUMBER,
} from 'modules/Builder/consts';

import { ItemsOptionGroup } from './ItemConfiguration.types';

export const DEFAULT_TIMER_VALUE = 100;
export const DEFAULT_DISABLED_TIMER_VALUE = 0;
export const DEFAULT_SCORE_VALUE = 0;
export const DEFAULT_MAX_NUMBER = 30;
export const SELECT_OPTION_TEXT_MAX_LENGTH = 75;
export const DEFAULT_SLIDER_SCORE = createArray(DEFAULT_SLIDER_MAX_VALUE + 1, (i: number) => i + 1);
export const DEFAULT_SLIDER_ROWS_SCORE = createArray(
  DEFAULT_SLIDER_MAX_VALUE,
  (i: number) => i + 1,
);

export const DEFAULT_EMPTY_SLIDER = {
  minValue: DEFAULT_SLIDER_MIN_NUMBER,
  maxValue: DEFAULT_SLIDER_MAX_NUMBER,
  scores: DEFAULT_SLIDER_SCORE,
  minLabel: '',
  maxLabel: '',
};
export const DEFAULT_EMPTY_SLIDER_ROWS = {
  ...DEFAULT_EMPTY_SLIDER,
  maxValue: DEFAULT_SLIDER_MAX_VALUE,
  minValue: DEFAULT_SLIDER_ROWS_MIN_NUMBER,
  scores: DEFAULT_SLIDER_ROWS_SCORE,
  label: '',
};
export const DEFAULT_AUDIO_DURATION_SEC = 300;
export const DEFAULT_MAX_CHARACTERS = 300;
export const SELECTION_ROW_OPTION_LABEL_MAX_LENGTH = 11;

export const itemsTypeOptions: ItemsOptionGroup[] = [
  {
    groupName: 'select',
    groupOptions: [
      {
        value: ItemResponseType.SingleSelection,
        icon: itemsTypeIcons[ItemResponseType.SingleSelection],
      },
      {
        value: ItemResponseType.MultipleSelection,
        icon: itemsTypeIcons[ItemResponseType.MultipleSelection],
      },
      { value: ItemResponseType.Slider, icon: itemsTypeIcons[ItemResponseType.Slider] },
      {
        value: ItemResponseType.Date,
        icon: itemsTypeIcons[ItemResponseType.Date],
      },
      {
        value: ItemResponseType.NumberSelection,
        icon: itemsTypeIcons[ItemResponseType.NumberSelection],
      },
      {
        value: ItemResponseType.Time,
        icon: itemsTypeIcons[ItemResponseType.Time],
      },
      {
        value: ItemResponseType.TimeRange,
        icon: itemsTypeIcons[ItemResponseType.TimeRange],
      },
    ],
  },
  {
    groupName: 'matrixSelect',
    groupOptions: [
      {
        value: ItemResponseType.SingleSelectionPerRow,
        icon: itemsTypeIcons[ItemResponseType.SingleSelectionPerRow],
        isMobileOnly: true,
      },
      {
        value: ItemResponseType.MultipleSelectionPerRow,
        icon: itemsTypeIcons[ItemResponseType.MultipleSelectionPerRow],
        isMobileOnly: true,
      },
      {
        value: ItemResponseType.SliderRows,
        icon: itemsTypeIcons[ItemResponseType.SliderRows],
        isMobileOnly: true,
      },
    ],
  },
  {
    groupName: 'input',
    groupOptions: [
      { value: ItemResponseType.Text, icon: itemsTypeIcons[ItemResponseType.Text] },
      {
        value: ItemResponseType.Drawing,
        icon: itemsTypeIcons[ItemResponseType.Drawing],
        isMobileOnly: true,
      },
      {
        value: ItemResponseType.Photo,
        icon: itemsTypeIcons[ItemResponseType.Photo],
        isMobileOnly: true,
      },
      {
        value: ItemResponseType.Video,
        icon: itemsTypeIcons[ItemResponseType.Video],
        isMobileOnly: true,
      },
    ],
  },
  {
    groupName: 'record',
    groupOptions: [
      {
        value: ItemResponseType.Geolocation,
        icon: itemsTypeIcons[ItemResponseType.Geolocation],
        isMobileOnly: true,
      },
      {
        value: ItemResponseType.Audio,
        icon: itemsTypeIcons[ItemResponseType.Audio],
        isMobileOnly: true,
      },
    ],
  },
  {
    groupName: 'display',
    groupOptions: [
      {
        value: ItemResponseType.Message,
        icon: itemsTypeIcons[ItemResponseType.Message],
      },
      {
        value: ItemResponseType.AudioPlayer,
        icon: itemsTypeIcons[ItemResponseType.AudioPlayer],
      },
    ],
  },
];

export const SELECTION_OPTIONS_COLOR_PALETTE = [
  {
    name: 'palette1',
    colors: [
      '#ffadad',
      '#ffd6a5',
      '#fdffb6',
      '#caffbf',
      '#9bf6ff',
      '#a0c4ff',
      '#bdb2ff',
      '#ffc6ff',
      '#fffffc',
    ],
  },
  {
    name: 'palette2',
    colors: [
      '#005f73',
      '#0a9396',
      '#94d2bd',
      '#e9d8a6',
      '#ee9b00',
      '#ca6702',
      '#bb3e03',
      '#ae2012',
      '#9b2226',
    ],
  },
  {
    name: 'palette3',
    colors: [
      '#f94144',
      '#f3722c',
      '#f8961e',
      '#f9844a',
      '#f9c74f',
      '#90be6d',
      '#43aa8b',
      '#4d908e',
      '#577590',
    ],
  },
  {
    name: 'palette4',
    colors: [
      '#112f45',
      '#c53a32',
      '#e78431',
      '#ec8a33',
      '#f4b941',
      '#e9e1bc',
      '#9bc8e3',
      '#4d9cb9',
      '#577590',
    ],
  },
  {
    name: 'palette5',
    colors: [
      '#320a17',
      '#611214',
      '#901c16',
      '#bf281b',
      '#ca4021',
      '#d7652a',
      '#e69035',
      '#eea63c',
      '#f5bc42',
    ],
  },
  {
    name: 'palette6',
    colors: [
      '#ee8132',
      '#ef8d34',
      '#f19937',
      '#f2a53b',
      '#f3ad3d',
      '#f4b940',
      '#f6c443',
      '#f8d147',
      '#f9dd4b',
    ],
  },
  {
    name: 'palette7',
    colors: [
      '#007f5f',
      '#2b9348',
      '#55a630',
      '#8cb63d',
      '#b1ca40',
      '#c3d043',
      '#d5d646',
      '#ddde49',
      '#ee5',
    ],
  },
  {
    name: 'palette8',
    colors: [
      '#6a1cb1',
      '#6238bc',
      '#5e62c7',
      '#608fd3',
      '#66a7d9',
      '#6bbddf',
      '#78ccde',
      '#85dcde',
      '#93ecdd',
    ],
  },
  {
    name: 'palette9',
    colors: [
      '#284e74',
      '#32608d',
      '#38749b',
      '#4088a9',
      '#559ea3',
      '#6db49b',
      '#89c597',
      '#a7d694',
      '#bee296',
    ],
  },
  {
    name: 'palette10',
    colors: [
      '#222529',
      '#353a3f',
      '#4a5056',
      '#6e757c',
      '#aeb5bc',
      '#cfd4d9',
      '#dfe2e6',
      '#eaecef',
      '#f8f9fa',
    ],
  },
];
