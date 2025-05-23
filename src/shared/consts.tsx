import { enUS, fr } from 'date-fns/locale';
import { Icons } from 'svgSprite';

import { Svg } from 'shared/components/Svg';

export const DEFAULT_START_TIME = '00:00';
export const DEFAULT_END_TIME = '23:59';

export const DEFAULT_ROWS_PER_PAGE = 20;
export const TABS_HEIGHT = '6.1rem';
export const TOP_BAR_HEIGHT = '6rem';
export const FOOTER_HEIGHT = '4.8rem';
export const LEFT_BAR_WIDTH = '8rem';

export const MAX_NAME_LENGTH = 55;
export const MAX_DESCRIPTION_LENGTH = 150;
export const SMALL_INPUT_LENGTH = 5;
export const TEXTAREA_ROWS_COUNT_SM = 4;
export const TEXTAREA_ROWS_COUNT = 5;
export const MAX_DESCRIPTION_LENGTH_LONG = 150;

export const MAX_FILE_SIZE_5MB = 5_242_880;
export const MAX_FILE_SIZE_2MB = 2_097_152;
export const MAX_FILE_SIZE_25MB = 26_214_400;
export const MAX_FILE_SIZE_150MB = 157_286_400;

export const VALID_IMAGE_TYPES = ['.png', '.jpg', '.jpeg'];

export const MAX_IMAGE_WIDTH = 1920;
export const MIN_IMAGE_WIDTH = 100;
export const MAX_IMAGE_HEIGHT = 1920;
export const MIN_IMAGE_HEIGHT = 100;

export enum UploadFileError {
  Size,
  Format,
  Dimensions,
}

export const SEARCH_DEBOUNCE_VALUE = 700;
export const CHANGE_DEBOUNCE_VALUE = 500;
export const VALIDATION_DEBOUNCE_VALUE = 1000;

export const DEFAULT_MILLISECONDS_DURATION = 3000;
export const MIN_MILLISECONDS_DURATION = 1;
export const DEFAULT_THRESHOLD_DURATION = 75;
export const MIN_THRESHOLD_DURATION = 1;
export const MAX_THRESHOLD_DURATION = 99;
export const MIN_NUMBER_OF_TRIALS = 1;
export const MAX_NUMBER_OF_TRIALS = 99;
export const MIN_LENGTH_OF_TEST = 1;
export const MAX_LENGTH_OF_TEST = 99;
export const MIN_SLOPE = 1;
export const MAX_SLOPE = 99;
export const DEFAULT_NUMBER_OF_TRIALS = 3;
export const DEFAULT_LENGTH_OF_TEST = 5;
export const DEFAULT_LAMBDA_SLOPE = 20;
export const MAX_LIMIT = 10000;

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
  YearMonthDayHoursMinutes = 'yyyy-MM-dd HH:mm',
  shortISO = "yyyy-MM-dd'T'HH:mm:ss",
  YearMonthDay = 'yyyy-MM-dd',
  MonthDayTime = 'MMM dd, HH:mm',
  MonthDayYearTime = 'MMM dd, yyyy, HH:mm',
  MonthDayYear = 'MMM dd, yyyy',
  MonthDayYearTimeSeconds = 'MMM dd, yyyy HH:mm:ss',
}

export const EMAIL_REGEXP = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w{2,}$/;

export const ACCOUNT_PASSWORD_MIN_LENGTH = 6;
export const APPLET_PASSWORD_MIN_LENGTH = 8;

export enum Roles {
  Manager = 'manager',
  Coordinator = 'coordinator',
  Editor = 'editor',
  Reviewer = 'reviewer',
  Respondent = 'respondent',
  Owner = 'owner',
  SuperAdmin = 'super_admin',
}

export const TEAM_MEMBER_ROLES = [
  Roles.SuperAdmin,
  Roles.Owner,
  Roles.Manager,
  Roles.Coordinator,
  Roles.Editor,
  Roles.Reviewer,
];

export enum ItemResponseType {
  ABTrails = 'ABTrails',
  Audio = 'audio',
  AudioPlayer = 'audioPlayer',
  Date = 'date',
  Drawing = 'drawing',
  Flanker = 'flanker',
  Geolocation = 'geolocation',
  Message = 'message',
  MultipleSelection = 'multiSelect',
  MultipleSelectionPerRow = 'multiSelectRows',
  NumberSelection = 'numberSelect',
  ParagraphText = 'paragraphText',
  Photo = 'photo',
  PhrasalTemplate = 'phrasalTemplate',
  RequestHealthRecordData = 'requestHealthRecordData',
  SingleSelection = 'singleSelect',
  SingleSelectionPerRow = 'singleSelectRows',
  Slider = 'slider',
  SliderRows = 'sliderRows',
  StabilityTracker = 'stabilityTracker',
  Text = 'text',
  Time = 'time',
  TimeRange = 'timeRange',
  TouchPractice = 'touchPractice',
  TouchTest = 'touchTest',
  Unity = 'unity',
  Video = 'video',
}

export const textLanguageKey = 'shortText';

export const performanceTaskResponseTypes = [
  ItemResponseType.Flanker,
  ItemResponseType.StabilityTracker,
  ItemResponseType.TouchPractice,
  ItemResponseType.TouchTest,
  ItemResponseType.ABTrails,
];

export const responseTypeToHaveOptions = [
  ItemResponseType.SingleSelection,
  ItemResponseType.MultipleSelection,
  ItemResponseType.SingleSelectionPerRow,
  ItemResponseType.MultipleSelectionPerRow,
];

export enum PerfTaskType {
  Flanker = 'flanker',
  Touch = 'touch',
  Gyroscope = 'gyroscope',
  ABTrailsTablet = 'ABTrailsTablet',
  ABTrailsMobile = 'ABTrailsMobile',
  Unity = 'unity',
}

export enum GyroscopeOrTouch {
  Gyroscope = 'gyroscope',
  Touch = 'touch',
}

export const ItemsWithFileResponses = [
  ItemResponseType.Photo,
  ItemResponseType.Video,
  ItemResponseType.Audio,
];

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
  [ItemResponseType.ParagraphText]: <Svg id="paragraph-text" />,
  [ItemResponseType.Drawing]: <Svg id="drawing" />,
  [ItemResponseType.Photo]: <Svg id="camera-outline" />,
  [ItemResponseType.Video]: <Svg id="video" />,
  [ItemResponseType.Geolocation]: <Svg id="geolocation" />,
  [ItemResponseType.Audio]: <Svg id="audio" />,
  [ItemResponseType.Message]: <Svg id="quote" />,
  [ItemResponseType.RequestHealthRecordData]: <Svg id="exchange" />,
  [ItemResponseType.AudioPlayer]: <Svg id="audio-player" />,
  [ItemResponseType.Time]: <Svg id="clock-picker" />,
  [ItemResponseType.Flanker]: null,
  [ItemResponseType.ABTrails]: null,
  [ItemResponseType.StabilityTracker]: null,
  [ItemResponseType.TouchTest]: null,
  [ItemResponseType.TouchPractice]: null,
  [ItemResponseType.PhrasalTemplate]: <Svg id="fileAlt" />,
  [ItemResponseType.Unity]: null,
};

export const enum SubscaleTotalScore {
  Sum = 'sum',
  Average = 'average',
  Percentage = 'percentage',
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
  GreaterThanDate = 'GREATER_THAN_DATE',
  LessThanDate = 'LESS_THAN_DATE',
  EqualToDate = 'EQUAL_TO_DATE',
  NotEqualToDate = 'NOT_EQUAL_TO_DATE',
  BetweenDates = 'BETWEEN_DATES',
  OutsideOfDates = 'OUTSIDE_OF_DATES',
  GreaterThanTime = 'GREATER_THAN_TIME',
  LessThanTime = 'LESS_THAN_TIME',
  EqualToTime = 'EQUAL_TO_TIME',
  NotEqualToTime = 'NOT_EQUAL_TO_TIME',
  BetweenTimes = 'BETWEEN_TIMES',
  OutsideOfTimes = 'OUTSIDE_OF_TIMES',
  GreaterThanTimeRange = 'GREATER_THAN_TIME_RANGE',
  LessThanTimeRange = 'LESS_THAN_TIME_RANGE',
  EqualToTimeRange = 'EQUAL_TO_TIME_RANGE',
  NotEqualToTimeRange = 'NOT_EQUAL_TO_TIME_RANGE',
  BetweenTimesRange = 'BETWEEN_TIMES_RANGE',
  OutsideOfTimesRange = 'OUTSIDE_OF_TIMES_RANGE',
  GreaterThanSliderRows = 'GREATER_THAN_SLIDER_ROWS',
  LessThanSliderRows = 'LESS_THAN_SLIDER_ROWS',
  EqualToSliderRows = 'EQUAL_TO_SLIDER_ROWS',
  NotEqualToSliderRows = 'NOT_EQUAL_TO_SLIDER_ROWS',
  BetweenSliderRows = 'BETWEEN_SLIDER_ROWS',
  OutsideOfSliderRows = 'OUTSIDE_OF_SLIDER_ROWS',
  EqualToRowOption = 'EQUAL_TO_ROW_OPTION',
  NotEqualToRowOption = 'NOT_EQUAL_TO_ROW_OPTION',
  IncludesRowOption = 'INCLUDES_ROW_OPTION',
  NotIncludesRowOption = 'NOT_INCLUDES_ROW_OPTION',
}

export const ScoreConditionType = 'EQUAL_TO_SCORE';

export const enum ConditionalLogicMatch {
  Any = 'any',
  All = 'all',
}

export enum AudioFileFormats {
  MP3 = '.mp3',
  WAV = '.wav',
}

export const VALID_AUDIO_FILE_TYPES = Object.values(AudioFileFormats);
export const ALLOWED_AUDIO_FILE_TYPES = VALID_AUDIO_FILE_TYPES.join(',');

export enum VideoFileFormats {
  WEBM = '.webm',
  MP4 = '.mp4',
}

export const VALID_VIDEO_FILE_TYPES = Object.values(VideoFileFormats);
export const ALLOWED_VIDEO_FILE_TYPES = VALID_VIDEO_FILE_TYPES.join(',');

export const enum MediaType {
  Image = 'image',
  Audio = 'audio',
  Video = 'video',
}

export const CONDITION_TYPES_TO_HAVE_SINGLE_VALUE = [
  ConditionType.GreaterThan,
  ConditionType.LessThan,
  ConditionType.GreaterThanDate,
  ConditionType.LessThanDate,
  ConditionType.GreaterThanTime,
  ConditionType.LessThanTime,
  ConditionType.GreaterThanTimeRange,
  ConditionType.LessThanTimeRange,
  ConditionType.GreaterThanSliderRows,
  ConditionType.LessThanSliderRows,
  ConditionType.Equal,
  ConditionType.NotEqual,
  ConditionType.EqualToDate,
  ConditionType.NotEqualToDate,
  ConditionType.EqualToTime,
  ConditionType.NotEqualToTime,
  ConditionType.EqualToTimeRange,
  ConditionType.NotEqualToTimeRange,
  ConditionType.EqualToSliderRows,
  ConditionType.NotEqualToSliderRows,
];

export const CONDITION_TYPES_TO_HAVE_RANGE_VALUE = [
  ConditionType.Between,
  ConditionType.OutsideOf,
  ConditionType.BetweenDates,
  ConditionType.OutsideOfDates,
  ConditionType.BetweenSliderRows,
  ConditionType.OutsideOfSliderRows,
  ConditionType.BetweenTimesRange,
  ConditionType.OutsideOfTimesRange,
  ConditionType.BetweenTimes,
  ConditionType.OutsideOfTimes,
];

export const LEGACY_GENERAL_REPORT_NAME = 'report';
export const GENERAL_REPORT_NAME = 'responses';

export const JOURNEY_REPORT_NAME = 'activity_user_journey';

export const legacyReportHeader = [
  'id',
  'activity_flow_submission_id',
  'activity_scheduled_time',
  'activity_start_time',
  'activity_end_time',
  'flag',
  'secret_user_id',
  'userId',
  'source_user_subject_id',
  'source_user_secret_id',
  'source_user_nickname',
  'source_user_relation',
  'source_user_tag',
  'target_user_subject_id',
  'target_user_secret_id',
  'target_user_nickname',
  'target_user_tag',
  'input_user_subject_id',
  'input_user_secret_id',
  'input_user_nickname',
  'activity_id',
  'activity_name',
  'activity_flow_id',
  'activity_flow_name',
  'item',
  'response',
  'prompt',
  'options',
  'version',
  'item_type',
  'rawScore',
  'reviewing_id',
  'schedule_id',
  'timezone_offset',
  'legacy_user_id',
];

export const reportHeader = [
  'target_id',
  'target_secret_id',
  'target_nickname',
  'target_tag',
  'source_id',
  'source_secret_id',
  'source_nickname',
  'source_tag',
  'source_relation',
  'input_id',
  'input_secret_id',
  'input_nickname',
  'userId',
  'secret_user_id',
  'legacy_user_id',
  'applet_version',
  'activity_flow_id',
  'activity_flow_name',
  'activity_flow_submission_id',
  'activity_id',
  'activity_name',
  'activity_submission_id',
  'activity_start_time',
  'activity_end_time',
  'activity_schedule_id',
  'activity_schedule_start_time',
  'utc_timezone_offset',
  'activity_submission_review_id',
  'item_id',
  'item_name',
  'item_prompt',
  'item_response_options',
  'item_response',
  'item_response_status',
  'item_type',
  'rawScore',
];

export const legacyActivityJourneyHeader = [
  'id',
  'activity_flow_submission_id',
  'activity_scheduled_time',
  'activity_start_time',
  'activity_end_time',
  'press_next_time',
  'press_back_time',
  'press_undo_time',
  'press_skip_time',
  'press_done_time',
  'response_option_selection_time',
  'secret_user_id',
  'user_id',
  'source_user_subject_id',
  'source_user_secret_id',
  'source_user_nickname',
  'source_user_relation',
  'source_user_tag',
  'target_user_subject_id',
  'target_user_secret_id',
  'target_user_nickname',
  'target_user_tag',
  'input_user_subject_id',
  'input_user_secret_id',
  'input_user_nickname',
  'activity_id',
  'activity_flow_id',
  'activity_flow_name',
  'activity_name',
  'item',
  'prompt',
  'response',
  'options',
  'version',
  'item_type',
];

export const activityJourneyHeader = [
  'target_id',
  'target_secret_id',
  'target_nickname',
  'target_tag',
  'source_id',
  'source_secret_id',
  'source_nickname',
  'source_tag',
  'source_relation',
  'input_id',
  'input_secret_id',
  'input_nickname',
  'user_id',
  'secret_user_id',
  'legacy_user_id',
  'applet_version',
  'activity_flow_id',
  'activity_flow_name',
  'activity_flow_submission_id',
  'activity_id',
  'activity_name',
  'activity_submission_id',
  'activity_start_time',
  'activity_end_time',
  'activity_schedule_id',
  'activity_schedule_start_time',
  'utc_timezone_offset',
  'item_id',
  'item_name',
  'item_prompt',
  'item_response_options',
  'item_response',
  'item_type',
  'press_next_time',
  'press_popup_skip_time',
  'press_popup_keep_time',
  'press_back_time',
  'press_undo_time',
  'press_skip_time',
  'press_done_time',
  'response_option_selection_time',
];

export const enum ActivityStatus {
  Missed = 'missed',
  Completed = 'completed',
  Incomplete = 'incomplete',
  NotScheduled = 'not scheduled',
}

export const enum Sex {
  M = 'M',
  F = 'F',
}

export const enum LookupTableItems {
  Age_screen = 'age_screen',
  Gender_screen = 'gender_screen',
}

export enum LegacyFinalSubscale {
  Key = 'finalSubScale',
  FinalSubScaleScore = 'Final SubScale Score',
  OptionalTextForFinalSubScaleScore = 'Optional text for Final SubScale Score',
}

export enum FinalSubscale {
  Key = 'finalSubScale',
  FinalSubScaleScore = 'activity_score',
  OptionalTextForFinalSubScaleScore = 'activity_score_lookup_text',
}
export const INDEX_IN_NAME_REGEXP = /\((\d+)\)$/g;

export const INDEX_IN_NAME_WITH_UNDERSCORE_REGEXP = /_(\d+)/g;

export const enum ScoreReportType {
  Section = 'section',
  Score = 'score',
}

export const URL_REGEX = /(https?:\/\/)?(www\.)?/g;

export const AUTH_BOX_WIDTH = '39.2rem';

export const enum AnalyticsCalendarPrefix {
  IndividualCalendar = 'IC',
  GeneralCalendar = 'GC',
}

export const DEFAULT_API_START_TIME = '00:00:00';
export const DEFAULT_API_END_TIME = '23:59:00';

export const JEST_TEST_TIMEOUT = 15000;

export const NON_UNIQUE_VALUE_MESSAGE = 'Non-unique value.';

export const NULL_ANSWER = 'value: null';

export const USER_SELECTABLE_PARTICIPANT_TAGS = ['', 'Child', 'Parent', 'Teacher'] as const;
export type UserSelectableParticipantTag = (typeof USER_SELECTABLE_PARTICIPANT_TAGS)[number];

export const PARTICIPANT_TAGS = [...USER_SELECTABLE_PARTICIPANT_TAGS, 'Team'] as const;
export type ParticipantTag = (typeof PARTICIPANT_TAGS)[number];

export const PARTICIPANT_TAG_ICONS: Record<ParticipantTag, Icons> = {
  '': 'close',
  Child: 'account',
  Parent: 'users-outlined',
  Teacher: 'teacher',
  Team: 'team-outlined',
};

export const observerStyles = {
  position: 'absolute',
  height: 'calc(100% + 20rem)',
  bottom: 0,
};

export const enum IntegrationTypes {
  Loris = 'LORIS',
  Prolific = 'PROLIFIC',
}
