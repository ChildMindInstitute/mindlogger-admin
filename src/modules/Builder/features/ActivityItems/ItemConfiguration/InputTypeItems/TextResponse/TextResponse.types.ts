export enum TextResponseUiType {
  ShortText,
  ParagraphText,
}

export type TextResponseProps = {
  name: string;
  uiType: TextResponseUiType;
};
