import { FolderApplet } from 'redux/modules';

export type ShareAppletData = {
  appletName: string;
  keywords: string[];
  keyword: string;
  checked: boolean;
};

export type ShareAppletProps = {
  applet: FolderApplet | null;
  onAppletShared: ({ keywords, libraryUrl }: { keywords: string[]; libraryUrl: string }) => void;
  onDisableSubmit: (isDisabled: boolean) => void;
  isSubmitted: boolean;
  showSuccess?: boolean;
};
