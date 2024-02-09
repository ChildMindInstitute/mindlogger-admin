import { useTranslation } from 'react-i18next';

import { Modal } from 'shared/components';
import { StyledModalWrapper } from 'shared/styles';

import { SubmitAssessmentPopupProps } from './SubmitAssessmentPopup.types';

export const SubmitAssessmentPopup = ({
  popupVisible,
  setPopupVisible,
  submitAssessment,
}: SubmitAssessmentPopupProps) => {
  const { t } = useTranslation('app');

  return (
    <Modal
      open={popupVisible}
      onClose={() => setPopupVisible(false)}
      onSubmit={submitAssessment}
      onSecondBtnSubmit={() => setPopupVisible(false)}
      title={t('submitAssessment')}
      buttonText={t('submit')}
      secondBtnText={t('cancel')}
      hasSecondBtn
      data-testid="respondents-review-feedback-assessment-submit-popup"
    >
      <StyledModalWrapper>{t('submitAssessmentDescription')}</StyledModalWrapper>
    </Modal>
  );
};
