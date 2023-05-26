import { useRef, RefObject, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { StyledModalWrapper } from 'shared/styles';
import { Modal } from 'shared/components';
import { users, workspaces } from 'redux/modules';
import { useAppDispatch } from 'redux/store';

import { SelectRespondents } from './SelectRespondents';
import { SelectRespondentsPopupProps } from './SuccessSharePopup.types';
import { SelectRespondentsRef } from '../SelectRespondentsPopup/SelectRespondents/SelectRespondents.types';

export const SelectRespondentsPopup = ({
  appletName,
  appletId,
  user: { firstName, lastName, email },
  selectedRespondents,
  selectRespondentsPopupVisible,
  onClose,
}: SelectRespondentsPopupProps) => {
  const name = `${firstName} ${lastName}`;
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const selectRespondentsRef = useRef() as RefObject<SelectRespondentsRef>;

  const { ownerId } = workspaces.useData() || {};
  const respondentsData = users.useAllRespondentsData();
  const respondents = respondentsData?.result?.map(({ nicknames, secretIds, id }) => ({
    nickname: nicknames[0],
    secretId: secretIds[0],
    id,
  }));

  const handleClose = () => onClose(selectedRespondents);

  const handleConfirm = () => {
    if (selectRespondentsRef?.current) {
      const selectedRespondents = selectRespondentsRef.current.confirmSelection();
      onClose(selectedRespondents);
    }
  };

  useEffect(() => {
    if (ownerId) {
      const { getAllWorkspaceRespondents } = users.thunk;

      dispatch(
        getAllWorkspaceRespondents({
          params: { ownerId, appletId },
        }),
      );
    }
  }, [ownerId]);

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
      height="60"
    >
      <StyledModalWrapper>
        <SelectRespondents
          ref={selectRespondentsRef}
          appletName={appletName}
          reviewer={{ name, email }}
          respondents={respondents || []}
          selectedRespondents={selectedRespondents}
        />
      </StyledModalWrapper>
    </Modal>
  );
};
