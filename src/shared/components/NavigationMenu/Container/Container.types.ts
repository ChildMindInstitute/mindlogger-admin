import { DefaultTFuncReturn } from 'i18next';
import { ReactNode } from 'react';

export type ActivitySettingsContainerProps = {
  title?: string | DefaultTFuncReturn;
  onClose: () => void;
  children: ReactNode;
};
