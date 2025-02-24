import { useEffect, useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { StyledModalWrapper } from 'shared/styles';
import { Modal } from 'shared/components';
import { workspaces } from 'redux/modules';
import { useGetWorkspaceRespondentsQuery } from 'modules/Dashboard/api/apiSlice';

import { SelectRespondents } from './SelectRespondents';
import { SelectRespondentsPopupProps } from './SuccessSharePopup.types';
import { getSelectedRespondentsLength } from './SelectRespondentsPopup.utils';
import { Respondent } from './SelectRespondents/SelectRespondents.types';

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

  const { ownerId } = workspaces.useData() || {};

  const { data: respondentsData } = useGetWorkspaceRespondentsQuery(
    { params: { appletId, ownerId } },
    { skip: !ownerId },
  );

  const respondents = useMemo(
    () =>
      respondentsData?.result.reduce(
        (acc: Respondent[], { nicknames, secretIds, isAnonymousRespondent, details }) => {
          if (!isAnonymousRespondent) {
            acc.push({
              nickname: nicknames[0],
              secretId: secretIds[0],
              id: details[0].subjectId,
            });
          }

          return acc;
        },
        [],
      ),
    [respondentsData?.result],
  );

  const methods = useForm();
  const { getValues, setValue, watch } = methods;

  const formValues = watch();
  const selectedRespondentsLength = getSelectedRespondentsLength(formValues);

  const handleClose = () => onClose(selectedRespondents);

  const handleConfirm = () => {
    const values = getValues();
    const selectedRespondents = Object.keys(values).filter((key) => values[key]);

    onClose(selectedRespondents);
  };

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
      data-testid="dashboard-managers-select-respondents-popup"
    >
      <StyledModalWrapper>
        <FormProvider {...methods}>
          <SelectRespondents
            appletName={appletName}
            reviewer={{ name, email }}
            respondents={respondents || []}
          />
        </FormProvider>
      </StyledModalWrapper>
    </Modal>
  );
};
