import { itemsTypeIcons } from 'shared/consts';
import { ItemResponseType } from 'shared/consts';
import { createArray } from 'shared/utils';

import { ItemsOptionGroup } from './ItemConfiguration.types';

export const DEFAULT_TIMER_VALUE = 100;
export const DEFAULT_SCORE_VALUE = 0;
export const DEFAULT_MIN_NUMBER = 1;
export const DEFAULT_MAX_NUMBER = 30;
export const DEFAULT_SLIDER_MIN_NUMBER = 0;
export const DEFAULT_SLIDER_MAX_NUMBER = 12;
export const SLIDER_LABEL_MAX_LENGTH = 11;
export const SLIDER_VALUE_LABEL_MAX_LENGTH = 20;
export const DEFAULT_SLIDER_MAX_VALUE = 12;
export const DEFAULT_SLIDER_SCORE = createArray(DEFAULT_SLIDER_MAX_VALUE + 1, (i: number) => i + 1);

export const DEFAULT_EMPTY_SLIDER = {
  min: DEFAULT_SLIDER_MIN_NUMBER,
  max: DEFAULT_SLIDER_MAX_NUMBER,
  scores: DEFAULT_SLIDER_SCORE,
  minLabel: '',
  maxLabel: '',
  minImage: '',
  maxImage: '',
};
export const DEFAULT_EMPTY_SLIDER_ROWS = {
  ...DEFAULT_EMPTY_SLIDER,
  label: '',
};
export const DEFAULT_AUDIO_DURATION_SEC = 300;
export const DEFAULT_MAX_CHARACTERS = 300;
export const DEFAULT_EMPTY_SELECTION_ROWS_OPTION = { label: '', tooltip: '', image: '' };
export const DEFAULT_EMPTY_SELECTION_ROWS_ITEM = { label: '', tooltip: '', image: '', scores: [] };
export const DEFAULT_SELECTION_ROWS_SCORE = 1;
export const SELECTION_ROW_OPTION_LABEL_MAX_LENGTH = 11;
export const SELECTION_OPTION_TEXT_MAX_LENGTH = 75;

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
      { value: ItemResponseType.Date, icon: itemsTypeIcons[ItemResponseType.Date] },
      {
        value: ItemResponseType.NumberSelection,
        icon: itemsTypeIcons[ItemResponseType.NumberSelection],
      },
      { value: ItemResponseType.TimeRange, icon: itemsTypeIcons[ItemResponseType.TimeRange] },
    ],
  },
  {
    groupName: 'matrixSelect',
    groupOptions: [
      {
        value: ItemResponseType.SingleSelectionPerRow,
        icon: itemsTypeIcons[ItemResponseType.SingleSelectionPerRow],
      },
      {
        value: ItemResponseType.MultipleSelectionPerRow,
        icon: itemsTypeIcons[ItemResponseType.MultipleSelectionPerRow],
      },
      { value: ItemResponseType.SliderRows, icon: itemsTypeIcons[ItemResponseType.SliderRows] },
    ],
  },
  {
    groupName: 'input',
    groupOptions: [
      { value: ItemResponseType.Text, icon: itemsTypeIcons[ItemResponseType.Text] },
      { value: ItemResponseType.Drawing, icon: itemsTypeIcons[ItemResponseType.Drawing] },
      { value: ItemResponseType.Photo, icon: itemsTypeIcons[ItemResponseType.Photo] },
      { value: ItemResponseType.Video, icon: itemsTypeIcons[ItemResponseType.Video] },
    ],
  },
  {
    groupName: 'record',
    groupOptions: [
      { value: ItemResponseType.Geolocation, icon: itemsTypeIcons[ItemResponseType.Geolocation] },
      { value: ItemResponseType.Audio, icon: itemsTypeIcons[ItemResponseType.Audio] },
    ],
  },
  {
    groupName: 'display',
    groupOptions: [
      { value: ItemResponseType.Message, icon: itemsTypeIcons[ItemResponseType.Message] },
      { value: ItemResponseType.AudioPlayer, icon: itemsTypeIcons[ItemResponseType.AudioPlayer] },
    ],
  },
];

export const SELECTION_OPTIONS_COLOR_PALETTE = [
  {
    name: 'palette1',
    colors: [
      '#FFADAD',
      '#FFD6A5',
      '#FDFFB6',
      '#CAFFBF',
      '#9BF6FF',
      '#A0C4FF',
      '#BDB2FF',
      '#FFC6FF',
      '#FFFFFC',
    ],
  },
  {
    name: 'palette2',
    colors: [
      '#005F73',
      '#0A9396',
      '#94D2BD',
      '#E9D8A6',
      '#EE9B00',
      '#CA6702',
      '#BB3E03',
      '#AE2012',
      '#9B2226',
    ],
  },
  {
    name: 'palette3',
    colors: [
      '#F94144',
      '#F3722C',
      '#F8961E',
      '#F9844A',
      '#F9C74F',
      '#90BE6D',
      '#43AA8B',
      '#4D908E',
      '#577590',
    ],
  },
  {
    name: 'palette4',
    colors: [
      '#112F45',
      '#C53A32',
      '#E78431',
      '#EC8A33',
      '#F4B941',
      '#E9E1BC',
      '#9BC8E3',
      '#4D9CB9',
      '#577590',
    ],
  },
  {
    name: 'palette5',
    colors: [
      '#320A17',
      '#611214',
      '#901C16',
      '#BF281B',
      '#CA4021',
      '#D7652A',
      '#E69035',
      '#EEA63C',
      '#F5BC42',
    ],
  },
  {
    name: 'palette6',
    colors: [
      '#EE8132',
      '#EF8D34',
      '#F19937',
      '#F2A53B',
      '#F3AD3D',
      '#F4B940',
      '#F6C443',
      '#F8D147',
      '#F9DD4B',
    ],
  },
  {
    name: 'palette7',
    colors: [
      '#007F5F',
      '#2B9348',
      '#55A630',
      '#8CB63D',
      '#B1CA40',
      '#C3D043',
      '#D5D646',
      '#DDDE49',
      '#EEEE55',
    ],
  },
  {
    name: 'palette8',
    colors: [
      '#6A1CB1',
      '#6238BC',
      '#5E62C7',
      '#608FD3',
      '#66A7D9',
      '#6BBDDF',
      '#78CCDE',
      '#85DCDE',
      '#93ECDD',
    ],
  },
  {
    name: 'palette9',
    colors: [
      '#284E74',
      '#32608D',
      '#38749B',
      '#4088A9',
      '#559EA3',
      '#6DB49B',
      '#89C597',
      '#A7D694',
      '#BEE296',
    ],
  },
  {
    name: 'palette10',
    colors: [
      '#222529',
      '#353A3F',
      '#4A5056',
      '#6E757C',
      '#AEB5BC',
      '#CFD4D9',
      '#DFE2E6',
      '#EAECEF',
      '#F8F9FA',
    ],
  },
];
