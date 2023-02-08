import { useRef, RefObject } from 'react';
import { useTranslation } from 'react-i18next';

import { StyledModalWrapper } from 'styles/styledComponents/Modal';
import { Modal } from 'components';

import { SelectRespondents } from './SelectRespondents';
import { SelectRespondentsPopupProps } from './SuccessSharePopup.types';
import { mockedRespondents } from './SelectRespondents.const';
import { SelectRespondentsRef } from '../SelectRespondentsPopup/SelectRespondents/SelectRespondents.types';

export const SelectRespondentsPopup = ({
  appletName,
  user: { firstName, lastName, email, nickName },
  selectedRespondents,
  selectRespondentsPopupVisible,
  onClose,
}: SelectRespondentsPopupProps) => {
  const name = firstName || lastName ? `${firstName} ${lastName}` : nickName;
  const { t } = useTranslation();
  const selectRespondentsRef = useRef() as RefObject<SelectRespondentsRef>;

  const handleClose = () => onClose(selectedRespondents);

  const handleConfirm = () => {
    if (selectRespondentsRef?.current) {
      const selectedRespondents = selectRespondentsRef.current.confirmSelection();
      onClose(selectedRespondents);
    }
  };

  return (
    <Modal
      open={selectRespondentsPopupVisible}
      onClose={handleClose}
      onSubmit={handleConfirm}
      title={t('selectRespondents')}
      buttonText={t('confirm')}
      hasSecondBtn
      secondBtnText={t('back')}
      onSecondBtnSubmit={handleClose}
      width="66"
      height="60"
    >
      <StyledModalWrapper>
        <SelectRespondents
          ref={selectRespondentsRef}
          appletName={appletName}
          reviewer={{ name, email }}
          respondents={mockedRespondents}
          selectedRespondents={selectedRespondents}
        />
      </StyledModalWrapper>
    </Modal>
  );
};
