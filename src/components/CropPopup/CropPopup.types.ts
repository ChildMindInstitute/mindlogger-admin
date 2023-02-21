export type ViewMode = 0 | 1 | 2 | 3;

export type CropPopupProps = {
  open: boolean;
  setCropPopupVisible: (val: boolean) => void;
  setValue: (value: string) => void;
  imageUrl: string;
};
