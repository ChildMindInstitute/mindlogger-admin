export type CropPopupProps = {
  open: boolean;
  setCropPopupVisible: (val: boolean) => void;
  name: string;
  setValue: (name: string, value: string) => void;
  imageUrl: string;
};
