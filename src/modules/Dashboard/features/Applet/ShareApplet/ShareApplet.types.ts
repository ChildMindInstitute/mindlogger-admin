import { Dispatch, SetStateAction } from 'react';

import { SingleApplet } from 'shared/state';

export type ShareAppletData = {
  appletName: string;
  keywords?: string[];
  keyword?: string;
  checked?: boolean;
};

export type OnAppletShared = { keywords: string[]; libraryUrl: string; appletName: string };

export type ShareAppletProps = {
  applet?: SingleApplet;
  onAppletShared: ({ keywords, libraryUrl, appletName }: OnAppletShared) => void;
  onDisableSubmit: (isDisabled: boolean) => void;
  isSubmitted: boolean;
  setIsSubmitted: Dispatch<SetStateAction<boolean>>;
  showSuccess?: boolean;
  'data-testid'?: string;
};
