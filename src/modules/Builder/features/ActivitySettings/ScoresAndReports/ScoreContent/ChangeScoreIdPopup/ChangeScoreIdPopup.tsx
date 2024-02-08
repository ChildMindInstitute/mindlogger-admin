import { useState } from 'react';

import { useTranslation } from 'react-i18next';

import { Modal } from 'shared/components';
import { StyledBodyLarge, StyledModalWrapper, variables } from 'shared/styles';

import { ChangeScoreIdPopupProps } from './ChangeScoreIdPopup.types';

export const ChangeScoreIdPopup = ({ onClose, onChange, 'data-testid': dataTestid }: ChangeScoreIdPopupProps) => {
  const { t } = useTranslation();
  const [isError, setIsError] = useState(false);
  const [isFirstScreen, setIsFirstScreen] = useState(true);

  const onFirstScreenSubmit = () => {
    setIsFirstScreen(false);
    try {
      onChange();
    } catch {
      setIsError(true);
    }
  };

  const getSecondScreenBtn = () => (isError ? 'retry' : 'ok');

  const onSecondScreenSubmit = () => (isError ? onFirstScreenSubmit() : onClose());

  const getSecondScreen = () =>
    isError ? (
      <StyledBodyLarge color={variables.palette.semantic.error}>{t('changeScoreIdError')}</StyledBodyLarge>
    ) : (
      <StyledBodyLarge>{t('changeScoreIdSuccess')}</StyledBodyLarge>
    );

  return (
    <Modal
      open
      onClose={onClose}
      onSubmit={isFirstScreen ? onFirstScreenSubmit : onSecondScreenSubmit}
      title={t('changeScoreId')}
      buttonText={t(isFirstScreen ? 'change' : getSecondScreenBtn())}
      hasSecondBtn={isFirstScreen || isError}
      submitBtnColor={isFirstScreen ? 'error' : 'primary'}
      secondBtnText={t('cancel')}
      onSecondBtnSubmit={onClose}
      data-testid={dataTestid}>
      <StyledModalWrapper>
        {isFirstScreen ? <StyledBodyLarge>{t('changeScoreIdText')}</StyledBodyLarge> : getSecondScreen()}
      </StyledModalWrapper>
    </Modal>
  );
};
