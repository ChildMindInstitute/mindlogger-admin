import { enUS, fr } from 'date-fns/locale';

import { Svg } from 'shared/components/Svg';

export const TABS_HEIGHT = '6.1rem';
export const TOP_BAR_HEIGHT = '6rem';
export const FOOTER_HEIGHT = '4.8rem';
export const SEARCH_HEIGHT = '4rem';
export const LEFT_BAR_WIDTH = '8rem';

export const MAX_NAME_LENGTH = 55;
export const MAX_DESCRIPTION_LENGTH = 150;
export const MAX_DESCRIPTION_LENGTH_LONG = 230;
export const MAX_SELECT_OPTION_TEXT_LENGTH = 75;
export const MAX_SLIDER_LABEL_TEXT_LENGTH = 20;
export const MAX_FILE_SIZE_8MB = 8_388_608;
export const MAX_FILE_SIZE_5MB = 5_242_880;
export const MAX_FILE_SIZE_2MB = 2_097_152;

export const INPUT_DEBOUNCE_TIME = 400;

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

export enum ItemResponseType {
  SingleSelection = 'singleSelect',
  MultipleSelection = 'multiSelect',
  Slider = 'slider',
  Date = 'date',
  NumberSelection = 'numberSelect',
  TimeRange = 'timeRange',
  SingleSelectionPerRow = 'singleSelectRows',
  MultipleSelectionPerRow = 'multiSelectRows',
  SliderRows = 'sliderRows',
  Text = 'text',
  Drawing = 'drawing',
  Photo = 'photo',
  Video = 'video',
  Geolocation = 'geolocation',
  Audio = 'audio',
  Message = 'message',
  AudioPlayer = 'audioPlayer',
  Flanker = 'flanker',
  AbTest = 'abTest',
}

export const itemsTypeIcons = {
  [ItemResponseType.SingleSelection]: <Svg id="radio-button-outline" />,
  [ItemResponseType.MultipleSelection]: <Svg id="checkbox-multiple-filled" />,
  [ItemResponseType.Slider]: <Svg id="slider-outline" />,
  [ItemResponseType.Date]: <Svg id="calendar" />,
  [ItemResponseType.NumberSelection]: <Svg id="number-selection" />,
  [ItemResponseType.TimeRange]: <Svg id="clock" />,
  [ItemResponseType.SingleSelectionPerRow]: <Svg id="single-selection-per-row" />,
  [ItemResponseType.MultipleSelectionPerRow]: <Svg id="multiple-selection-per-row" />,
  [ItemResponseType.SliderRows]: <Svg id="slider-rows" />,
  [ItemResponseType.Text]: <Svg id="text" />,
  [ItemResponseType.Drawing]: <Svg id="drawing" />,
  [ItemResponseType.Photo]: <Svg id="photo" />,
  [ItemResponseType.Video]: <Svg id="video" />,
  [ItemResponseType.Geolocation]: <Svg id="geolocation" />,
  [ItemResponseType.Audio]: <Svg id="audio" />,
  [ItemResponseType.Message]: <Svg id="quote" />,
  [ItemResponseType.AudioPlayer]: <Svg id="audio-player" />,
  [ItemResponseType.Flanker]: null,
  [ItemResponseType.AbTest]: null,
};

export const enum SubscaleTotalScore {
  Sum = 'sum',
  Average = 'average',
}

export const locales = {
  'en-US': enUS,
  fr,
};
