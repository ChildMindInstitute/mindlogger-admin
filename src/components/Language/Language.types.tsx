export enum Languages {
  EN = 'en',
  FR = 'fr',
}

export type LanguageItem = {
  value: Languages;
  label: string;
  type: string;
  component: JSX.Element;
};
