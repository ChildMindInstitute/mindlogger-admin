import { DEFAULT_END_TIME, DEFAULT_START_TIME, ItemResponseType } from 'shared/consts';

export const SHOW_MORE_HEIGHT = 540;
export const DEFAULT_START_DATE = new Date(new Date().setDate(new Date().getDate() - 5));
export const DEFAULT_END_DATE = new Date(new Date().setDate(new Date().getDate() + 1));

export const defaultRespondentDataFormValues = {
  startDate: DEFAULT_START_DATE,
  endDate: DEFAULT_END_DATE,
  startTime: DEFAULT_START_TIME,
  endTime: DEFAULT_END_TIME,
  filterByIdentifier: false,
  identifier: [],
  versions: [],
  summaryActivities: [],
  selectedActivity: null,
  identifiers: [],
  apiVersions: [],
  answers: [],
  responseOptions: null,
  subscalesFrequency: 0,
  responseDate: null,
};

export const UNSUPPORTED_ITEMS = [
  ItemResponseType.Audio,
  ItemResponseType.AudioPlayer,
  ItemResponseType.Drawing,
  ItemResponseType.Geolocation,
  ItemResponseType.Photo,
  ItemResponseType.Video,
  ItemResponseType.Message,
  ItemResponseType.Flanker,
  ItemResponseType.StabilityTracker,
  ItemResponseType.TouchPractice,
  ItemResponseType.TouchTest,
  ItemResponseType.ABTrails,
];
