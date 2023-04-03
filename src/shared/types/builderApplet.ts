export enum ItemInputTypes {
  SingleSelection = 'singleSelection',
  MultipleSelection = 'multipleSelection',
  Slider = 'slider',
  Date = 'date',
  NumberSelection = 'numberSelection',
  TimeRange = 'timeRange',
  SingleSelectionPerRow = 'singleSelectionPerRow',
  MultipleSelectionPerRow = 'multipleSelectionPerRow',
  SliderRows = 'sliderRows',
  Text = 'text',
  Drawing = 'drawing',
  Photo = 'photo',
  Video = 'video',
  Geolocation = 'geolocation',
  Audio = 'audio',
  Message = 'message',
  AudioPlayer = 'audioPlayer',
}

export type ActivityItem = {
  id: string;
  name: string;
  responseType: ItemInputTypes;
  question: string;
  isHidden: boolean;
};

export type Activity = {
  id?: string;
  key?: string;
  name: string;
  description: string;
  img?: string;
  count?: number;
  items: ActivityItem[];
};

export type Applet = {
  displayName: string;
  description: string;
  themeId: string;
  about: string;
  image: string;
  watermark: string;
  activities: Activity[];
};
