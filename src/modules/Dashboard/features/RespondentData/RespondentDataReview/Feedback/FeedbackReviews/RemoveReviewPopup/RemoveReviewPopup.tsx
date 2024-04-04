import { useTranslation } from 'react-i18next';

import { Modal, Spinner, SpinnerUiType } from 'shared/components';
import { StyledBodyLarge, StyledModalWrapper, variables } from 'shared/styles';

import { RemoveReviewPopupProps } from './RemoveReviewPopup.types';

export const RemoveReviewPopup = ({
  popupVisible,
  onClose,
  onSubmit,
  error,
  isLoading,
}: RemoveReviewPopupProps) => {
  const { t } = useTranslation('app');

  return (
    <Modal
      open={popupVisible}
      onClose={onClose}
      onSubmit={onSubmit}
      onSecondBtnSubmit={onClose}
      title={t('removeReview')}
      buttonText={t('remove')}
      secondBtnText={t('cancel')}
      hasSecondBtn
      data-testid="respondents-feedback-review-remove-popup"
    >
      <>
        {isLoading && <Spinner uiType={SpinnerUiType.Secondary} noBackground />}
        <StyledModalWrapper>
          <StyledBodyLarge color={variables.palette.on_surface}>
            {t('removeReviewDescription')}
          </StyledBodyLarge>
          {error}
        </StyledModalWrapper>
      </>
    </Modal>
  );
};
