import { enUS, fr } from 'date-fns/locale';

import { Svg } from 'shared/components/Svg';

export const TABS_HEIGHT = '6.1rem';
export const TOP_BAR_HEIGHT = '6rem';
export const FOOTER_HEIGHT = '4.8rem';
export const SEARCH_HEIGHT = '4rem';
export const LEFT_BAR_WIDTH = '8rem';

export const MAX_NAME_LENGTH = 55;
export const MAX_DESCRIPTION_LENGTH = 150;
export const SMALL_INPUT_LENGTH = 5;
export const TEXTAREA_ROWS = 5;
export const MAX_DESCRIPTION_LENGTH_LONG = 230;
export const MAX_SELECT_OPTION_TEXT_LENGTH = 75;
export const MAX_SLIDER_LABEL_TEXT_LENGTH = 20;
export const MAX_FILE_SIZE_8MB = 8_388_608;
export const MAX_FILE_SIZE_5MB = 5_242_880;
export const MAX_FILE_SIZE_2MB = 2_097_152;

export const INPUT_DEBOUNCE_TIME = 400;
export const SEARCH_DEBOUNCE_VALUE = 700;

export const DEFAULT_MILLISECONDS_DURATION = 3000;
export const MIN_MILLISECONDS_DURATION = 1;
export const DEFAULT_THRESHOLD_DURATION = 75;
export const MIN_THRESHOLD_DURATION = 1;
export const MAX_THRESHOLD_DURATION = 99;

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
  MonthDayTime = 'MMM dd, HH:mm',
}

export const ACCOUNT_PASSWORD_MIN_LENGTH = 6;
export const APPLET_PASSWORD_MIN_LENGTH = 8;

export const enum Roles {
  Manager = 'manager',
  Coordinator = 'coordinator',
  Editor = 'editor',
  Reviewer = 'reviewer',
  Respondent = 'respondent',
  Owner = 'owner',
  SuperAdmin = 'super_admin',
}

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
  Time = 'time',
  Flanker = 'flanker',
  Gyroscope = 'gyroscope',
  Touch = 'touch',
  ABTrailsIpad = 'ABTrailsIpad',
  ABTrailsMobile = 'ABTrailsMobile',
}

export enum CalculationType {
  Sum = 'sum',
  Average = 'average',
  Percentage = 'percentage',
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
  [ItemResponseType.Time]: <Svg id="clock-picker" />,
  [ItemResponseType.Flanker]: null,
  [ItemResponseType.Gyroscope]: null,
  [ItemResponseType.Touch]: null,
  [ItemResponseType.ABTrailsIpad]: null,
  [ItemResponseType.ABTrailsMobile]: null,
};

export const enum SubscaleTotalScore {
  Sum = 'sum',
  Average = 'average',
}

export const locales = {
  'en-US': enUS,
  fr,
};

export const enum ConditionType {
  IncludesOption = 'INCLUDES_OPTION',
  NotIncludesOption = 'NOT_INCLUDES_OPTION',
  EqualToOption = 'EQUAL_TO_OPTION',
  NotEqualToOption = 'NOT_EQUAL_TO_OPTION',
  GreaterThan = 'GREATER_THAN',
  LessThan = 'LESS_THAN',
  Equal = 'EQUAL',
  NotEqual = 'NOT_EQUAL',
  Between = 'BETWEEN',
  OutsideOf = 'OUTSIDE_OF',
}

export const enum ConditionalLogicMatch {
  Any = 'any',
  All = 'all',
}

export const ALLOWED_AUDIO_FILE_TYPES = '.mp3,.wav';

export const ALLOWED_VIDEO_FILE_TYPES = '.webm,.mp4';

export const CONDITION_TYPES_TO_HAVE_SINGLE_VALUE = [
  ConditionType.GreaterThan,
  ConditionType.LessThan,
  ConditionType.Equal,
  ConditionType.NotEqual,
];
export const CONDITION_TYPES_TO_HAVE_RANGE_VALUE = [ConditionType.Between, ConditionType.OutsideOf];
