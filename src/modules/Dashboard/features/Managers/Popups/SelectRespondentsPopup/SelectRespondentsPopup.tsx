import { useEffect, useMemo } from 'react';

import { useForm, FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { users, workspaces } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { Modal } from 'shared/components';
import { StyledModalWrapper } from 'shared/styles';

import { SelectRespondents } from './SelectRespondents';
import { Respondent } from './SelectRespondents/SelectRespondents.types';
import { getSelectedRespondentsLength } from './SelectRespondentsPopup.utils';
import { SelectRespondentsPopupProps } from './SuccessSharePopup.types';

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

  const { ownerId } = workspaces.useData() || {};
  const respondentsData = users.useAllRespondentsData();
  const respondents = useMemo(
    () =>
      respondentsData?.result?.reduce((acc: Respondent[], { nicknames, secretIds, id, isAnonymousRespondent }) => {
        if (!isAnonymousRespondent) {
          acc.push({
            nickname: nicknames[0],
            secretId: secretIds[0],
            id,
          });
        }

        return acc;
      }, []),
    [respondentsData?.result],
  );

  const methods = useForm();
  const { getValues, setValue, watch } = methods;

  const formValues = watch();
  const selectedRespondentsLength = getSelectedRespondentsLength(formValues);

  const handleClose = () => onClose(selectedRespondents);

  const handleConfirm = () => {
    const values = getValues();
    const selectedRespondents = Object.keys(values).filter(key => values[key]);

    onClose(selectedRespondents);
  };

  useEffect(() => {
    if (!ownerId) return;

    const { getAllWorkspaceRespondents } = users.thunk;
    dispatch(
      getAllWorkspaceRespondents({
        params: { ownerId, appletId },
      }),
    );
  }, [ownerId]);

  useEffect(() => {
    if (!respondents?.length) return;

    respondents.forEach(({ id }) => {
      setValue(id, selectedRespondents.includes(id));
    });
  }, [respondents]);

  return (
    <Modal
      open={selectRespondentsPopupVisible}
      onClose={handleClose}
      onSubmit={handleConfirm}
      title={t('selectRespondents')}
      buttonText={t('confirm')}
      disabledSubmit={!selectedRespondentsLength}
      hasSecondBtn
      secondBtnText={t('back')}
      onSecondBtnSubmit={handleClose}
      height="60"
      data-testid="dashboard-managers-select-respondents-popup">
      <StyledModalWrapper>
        <FormProvider {...methods}>
          <SelectRespondents appletName={appletName} reviewer={{ name, email }} respondents={respondents || []} />
        </FormProvider>
      </StyledModalWrapper>
    </Modal>
  );
};
