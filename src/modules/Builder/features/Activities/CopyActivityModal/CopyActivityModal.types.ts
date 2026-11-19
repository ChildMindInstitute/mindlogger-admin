export type CopyTargetApplet = {
  id: string;
  appletName: string;
  image?: string;
};

export type CopyActivityModalProps = {
  isOpen: boolean;
  activityName: string;
  isCopying?: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onSubmit: (applet: CopyTargetApplet) => void;
  'data-testid'?: string;
};
