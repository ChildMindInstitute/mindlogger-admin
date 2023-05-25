import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { StyledBodyLarge, StyledModalWrapper, variables } from 'shared/styles';
import { Modal } from 'shared/components';

import { ChangeScoreIdPopupProps } from './ChangeScoreIdPopup.types';

export const ChangeScoreIdPopup = ({ isOpen, onClose, onSubmit }: ChangeScoreIdPopupProps) => {
  const { t } = useTranslation();
  const [isError, setIsError] = useState(false);
  const [isFirstScreen, setIsFirstScreen] = useState(true);

  const onFirstScreenSubmit = () => setIsFirstScreen(false);

  const getSecondScreenBtn = () => (isError ? 'retry' : 'ok');

  const onSecondScreenSubmit = () => (isError ? onSubmit : onClose);

  const getSecondScreen = () =>
    isError ? (
      <StyledBodyLarge color={variables.palette.semantic.error}>
        {t('changeScoreIdError')}
      </StyledBodyLarge>
    ) : (
      <StyledBodyLarge>{t('changeScoreIdSuccess')}</StyledBodyLarge>
    );

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      onSubmit={isFirstScreen ? onFirstScreenSubmit : onSecondScreenSubmit()}
      title={t('changeScoreId')}
      buttonText={t(isFirstScreen ? 'change' : getSecondScreenBtn())}
      hasSecondBtn={isFirstScreen || isError}
      submitBtnColor={isFirstScreen ? 'error' : 'primary'}
      secondBtnText={t('cancel')}
      onSecondBtnSubmit={onClose}
    >
      <StyledModalWrapper>
        {isFirstScreen ? (
          <StyledBodyLarge>{t('changeScoreIdText')}</StyledBodyLarge>
        ) : (
          getSecondScreen()
        )}
      </StyledModalWrapper>
    </Modal>
  );
};
