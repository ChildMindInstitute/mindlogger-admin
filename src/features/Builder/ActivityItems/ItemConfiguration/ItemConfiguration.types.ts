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

export type ItemConfigurationForm = { itemsInputType: ItemInputTypes | '' };

export type ItemsOption = {
  value: ItemInputTypes;
  icon: JSX.Element;
};

export type ItemsOptionGroup = {
  groupName: string;
  groupOptions: ItemsOption[];
};
