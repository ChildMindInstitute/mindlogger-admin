export enum UploaderUiType {
  Primary = 'primary',
  Secondary = 'secondary',
}

export type UploaderProps = {
  width: number;
  height: number;
  setValue: (val: string) => void;
  getValue: () => string;
  uiType?: UploaderUiType;
  description?: string;
};
