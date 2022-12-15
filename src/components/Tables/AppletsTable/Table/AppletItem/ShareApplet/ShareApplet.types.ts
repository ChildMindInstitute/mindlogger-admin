export type ShareAppletData = {
  appletName: string;
  keywords: string[];
  keyword: string;
  checked: boolean;
};

export type ShareAppletProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: ({ appletName, keywords, checked }: ShareAppletData) => void;
  appletName?: string;
  errorText?: string;
};
