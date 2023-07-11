import { Dispatch, SetStateAction } from 'react';

import { SingleApplet } from 'shared/state';

export type ShareAppletData = {
  appletName: string;
  keywords: string[];
  keyword: string;
  checked: boolean;
};

export type ShareAppletProps = {
  applet?: SingleApplet;
  onAppletShared: ({ keywords, libraryUrl }: { keywords: string[]; libraryUrl: string }) => void;
  onDisableSubmit: (isDisabled: boolean) => void;
  isSubmitted: boolean;
  setIsSubmitted: Dispatch<SetStateAction<boolean>>;
  showSuccess?: boolean;
};
