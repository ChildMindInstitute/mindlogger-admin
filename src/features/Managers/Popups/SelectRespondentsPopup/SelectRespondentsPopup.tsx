import { useTranslation } from 'react-i18next';

import { StyledModalWrapper } from 'styles/styledComponents/Modal';
import { Modal } from 'components';

import { SelectRespondents } from './SelectRespondents';
import { SelectRespondentsPopupProps } from './SuccessSharePopup.types';

export const SelectRespondentsPopup = ({
  selectRespondentsPopupVisible,
  setSelectRespondentsPopupVisible,
}: SelectRespondentsPopupProps) => {
  const { t } = useTranslation();

  const selectedRespondents = ['test'];
  const respondents = [
    {
      secretId: 'user',
      nickname: 'test_user',
    },
    {
      secretId: 'respondent',
      nickname: 'respondent1',
    },
    {
      secretId: 'test',
      nickname: 'respondent2',
    },
  ];

  const handleClose = () => setSelectRespondentsPopupVisible(false);

  const handleConfirm = () => {
    console.log('handleConfirm');
  };

  return (
    <Modal
      open={selectRespondentsPopupVisible}
      onClose={handleClose}
      onSubmit={handleConfirm}
      title={t('selectRespondents')}
      buttonText={t('confirm')}
      hasSecondBtn
      secondBtnText={t('cancel')}
      onSecondBtnSubmit={handleClose}
      width="66"
      height="60"
    >
      <StyledModalWrapper>
        <SelectRespondents
          appletName="Mindlogger applet" // TODO replace with real data
          reviewer={{ name: 'Reviewer name', email: 'reviewer@email' }}
          respondents={respondents}
          selectedRespondents={selectedRespondents}
        />
      </StyledModalWrapper>
    </Modal>
  );
};
