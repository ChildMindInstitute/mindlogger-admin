import { Svg } from 'shared/components/Svg';
import { ItemInputTypes } from './types';

export const TABS_HEIGHT = '6.1rem';
export const TOP_BAR_HEIGHT = '6rem';
export const FOOTER_HEIGHT = '4.8rem';
export const SEARCH_HEIGHT = '4rem';
export const LEFT_BAR_WIDTH = '8rem';

export const MAX_NAME_LENGTH = 55;
export const MAX_DESCRIPTION_LENGTH = 150;
export const MAX_DESCRIPTION_LENGTH_LONG = 230;
export const MAX_FILE_SIZE_1GB = 1_073_741_824;
export const MAX_FILE_SIZE_8MB = 8_388_608;
export const MAX_FILE_SIZE_2MB = 2_097_152;

export const INPUT_DEBOUNCE_TIME = 400;

export const APPLET_PAGES = {
  respondents: 'respondents',
  managers: 'managers',
  schedule: 'schedule',
  settings: 'settings',
  addUser: 'add-user',
};

export const BUILDER_PAGES = {
  activities: 'activities',
};

export enum DateFormats {
  Year = 'yyy',
  DayMonthYear = 'dd MMM yyyy',
  WeekDayMonthYear = 'E, dd MMM yyyy',
  FullWeekDayFullMonthYear = 'eeee, dd MMMM yyyy',
  DayFullMonth = 'dd MMMM',
  DayFullMonthYear = 'dd MMMM yyy',
  Time = 'HH:mm',
  TimeSeconds = 'HH:mm:ss',
  YearMonthDayHoursMinutesSeconds = 'yyyy-MM-dd HH:mm:ss',
  YearMonthDay = 'yyyy-MM-dd',
}

export const ACCOUNT_PASSWORD_MIN_LENGTH = 6;
export const APPLET_PASSWORD_MIN_LENGTH = 8;

export const enum Roles {
  User = 'user',
  Manager = 'manager',
  Coordinator = 'coordinator',
  Editor = 'editor',
  Reviewer = 'reviewer',
  Respondent = 'respondent',
}

export const SEARCH_DEBOUNCE_VALUE = 700;

export const itemsTypeIcons = {
  [ItemInputTypes.SingleSelection]: <Svg id="radio-button-outline" />,
  [ItemInputTypes.MultipleSelection]: <Svg id="checkbox-multiple-filled" />,
  [ItemInputTypes.Slider]: <Svg id="slider-outline" />,
  [ItemInputTypes.Date]: <Svg id="calendar" />,
  [ItemInputTypes.NumberSelection]: <Svg id="number-selection" />,
  [ItemInputTypes.TimeRange]: <Svg id="clock" />,
  [ItemInputTypes.SingleSelectionPerRow]: <Svg id="single-selection-per-row" />,
  [ItemInputTypes.MultipleSelectionPerRow]: <Svg id="multiple-selection-per-row" />,
  [ItemInputTypes.SliderRows]: <Svg id="slider-rows" />,
  [ItemInputTypes.Text]: <Svg id="text" />,
  [ItemInputTypes.Drawing]: <Svg id="drawing" />,
  [ItemInputTypes.Photo]: <Svg id="photo" />,
  [ItemInputTypes.Video]: <Svg id="video" />,
  [ItemInputTypes.Geolocation]: <Svg id="geolocation" />,
  [ItemInputTypes.Audio]: <Svg id="audio" />,
  [ItemInputTypes.Message]: <Svg id="quote" />,
  [ItemInputTypes.AudioPlayer]: <Svg id="audio-player" />,
  [ItemInputTypes.Flanker]: null,
  [ItemInputTypes.AbTest]: null,
};
