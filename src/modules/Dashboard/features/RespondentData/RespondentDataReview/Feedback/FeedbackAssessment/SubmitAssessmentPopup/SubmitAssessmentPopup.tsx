import { useTranslation } from 'react-i18next';

import { Modal } from 'shared/components';
import { StyledModalWrapper } from 'shared/styles';

import { SubmitAssessmentPopupProps } from './SubmitAssessmentPopup.types';

export const SubmitAssessmentPopup = ({
  popupVisible,
  setPopupVisible,
}: SubmitAssessmentPopupProps) => {
  const { t } = useTranslation('app');

  return (
    <Modal
      open={popupVisible}
      onClose={() => setPopupVisible(false)}
      onSubmit={() => setPopupVisible(false)} // TODO: submit assessment when the endpoint is ready
      onSecondBtnSubmit={() => setPopupVisible(false)}
      title={t('submitAssessment')}
      buttonText={t('submit')}
      secondBtnText={t('cancel')}
      hasSecondBtn
    >
      <StyledModalWrapper>{t('submitAssessmentDescription')}</StyledModalWrapper>
    </Modal>
  );
};
