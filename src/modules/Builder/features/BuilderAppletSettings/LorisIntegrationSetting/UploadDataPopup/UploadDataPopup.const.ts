import i18n from 'i18n';

import { ScreenParams } from './UploadDataPopup.types';

const { t } = i18n;

export const getScreens = ({ onSubmit, onClose }: ScreenParams) => [
  {
    text: t('loris.agreementText'),
    buttonText: 'upload',
    onSubmit,
  },
  {
    text: t('loris.successMessage'),
    buttonText: 'ok',
    onSubmit: onClose,
  },
];
