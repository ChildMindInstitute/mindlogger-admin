import { useState } from 'react';

import { useTranslation } from 'react-i18next';

import { Modal } from 'shared/components/Modal';
import { StyledModalWrapper } from 'shared/styles';

import { RemoveImagePopupProps, Steps } from './RemoveImagePopup.types';
import { getScreens } from './RemoveImagePopup.utils';

export const RemoveImagePopup = ({ open, onClose, onRemove, 'data-testid': dataTestid }: RemoveImagePopupProps) => {
  const { t } = useTranslation('app');
  const [step, setStep] = useState<Steps>(0);

  const screens = getScreens({ onClose, onRemove, setStep });

  return (
    <Modal
      open={open}
      title={t('removeImage')}
      buttonText={t(screens[step].buttonText)}
      secondBtnText={t('cancel')}
      onClose={onClose}
      onSecondBtnSubmit={onClose}
      onSubmit={screens[step].onSubmit}
      hasSecondBtn={screens[step].hasSecondBtn}
      data-testid={dataTestid}
    >
      <StyledModalWrapper>{t(screens[step].content)}</StyledModalWrapper>
    </Modal>
  );
};
