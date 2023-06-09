import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { StyledBodyLarge, StyledModalWrapper } from 'shared/styles';
import { Modal } from 'shared/components';

import { RemoveConditionalLogicPopupProps } from './RemoveConditionalLogicPopup.types';

export const RemoveConditionalLogicPopup = ({
  onClose,
  onRemove,
  name,
}: RemoveConditionalLogicPopupProps) => {
  const { t } = useTranslation();
  const [isFirstScreen, setIsFirstScreen] = useState(true);

  const onFirstScreenSubmit = () => {
    setIsFirstScreen(false);
    onRemove();
  };

  const onSecondScreenSubmit = () => onClose();

  return (
    <Modal
      open
      onClose={onClose}
      onSubmit={isFirstScreen ? onFirstScreenSubmit : onSecondScreenSubmit}
      title={t('removeConditionalLogic')}
      buttonText={t(isFirstScreen ? 'remove' : 'ok')}
      hasSecondBtn={isFirstScreen}
      submitBtnColor={isFirstScreen ? 'error' : 'primary'}
      secondBtnText={t('cancel')}
      onSecondBtnSubmit={onClose}
    >
      <StyledModalWrapper>
        <StyledBodyLarge>
          {isFirstScreen ? (
            <Trans i18nKey="confirmRemoveConditionalLogic">
              Are you sure you want to remove conditional logic for the{' '}
              <strong>
                <>{{ name }}</>
              </strong>
              ?
            </Trans>
          ) : (
            t('successRemoveConditionalLogic')
          )}
        </StyledBodyLarge>
      </StyledModalWrapper>
    </Modal>
  );
};
