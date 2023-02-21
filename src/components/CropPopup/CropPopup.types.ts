export type CropPopupProps = {
  open: boolean;
  setCropPopupVisible: (val: boolean) => void;
  setValue: (value: string) => void;
  imageUrl: string;
};
