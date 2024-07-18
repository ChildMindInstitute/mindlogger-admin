export enum SelectionUiType {
  Single = 'single',
  Multiple = 'multiple',
}

export enum DashedUiType {
  Text = 'text',
  ParagraphText = 'paragraphText',
  Drawing = 'drawing',
  Photo = 'photo',
  Video = 'video',
  Geolocation = 'geolocation',
  Audio = 'audio',
  Message = 'message',
  AudioPlayer = 'audioPlayer',
}

export type SelectionProps = {
  uiType: SelectionUiType;
};

export type SelectionOptionProps = {
  optionNumber: number;
};

export type DashedProps = {
  uiType: DashedUiType;
};
