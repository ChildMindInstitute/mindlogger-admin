export type Steps = 0 | 1;

export type ScreensParams = {
  name: string;
  isEmpty: boolean;
  onSubmit: () => void;
  onClose: () => void;
};
