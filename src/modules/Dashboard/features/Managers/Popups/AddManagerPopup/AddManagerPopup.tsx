import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { EmptyState, Modal, Spinner } from 'shared/components';
import { StyledErrorText, StyledModalWrapper } from 'shared/styles';
import { useFormError } from 'modules/Dashboard/hooks';
import { Roles } from 'shared/consts';
import { Mixpanel, getErrorMessage, isManagerOrOwner } from 'shared/utils';
import { Languages, postAppletInvitationApi } from 'api';
import { useAppDispatch } from 'redux/store';
import { useAsync } from 'shared/hooks';
import { banners, users, workspaces } from 'redux/modules';

import { USER_ALREADY_INVITED, defaultValues } from './AddManagerPopup.const';
import { AddManagerPopupSchema } from './AddManagerPopup.schema';
import { AddManagerPopupProps, AddManagerFormValues, Fields } from './AddManagerPopup.types';
import { AddManagerForm } from './AddManagerForm';

export const AddManagerPopup = ({
  appletId,
  onClose,
  popupVisible,
  workspaceInfo,
  'data-testid': dataTestid,
}: AddManagerPopupProps) => {
  const { t, i18n } = useTranslation('app');
  const rolesData = workspaces.useRolesData();
  const appletRoles = appletId ? rolesData?.data?.[appletId] : undefined;

  // Workspace Name field is only available if the workspace has no managers yet
  const isWorkspaceNameVisible = !!workspaceInfo && !workspaceInfo.hasManagers;

  const { ownerId } = workspaces.useData() || {};
  const respondentsData = users.useAllRespondentsData();
  const participants = (respondentsData?.result ?? []).map(({ details }) => {
    const {
      subjectId,
      respondentSecretId: secretId,
      respondentNickname: nickname,
      subjectTag: tag,
    } = details[0];

    return {
      subjectId,
      secretId,
      nickname,
      tag,
    };
  });

  const defaults = {
    ...defaultValues,
    language: i18n.language as Languages,
    workspaceName: workspaceInfo?.name,
  };

  const {
    control,
    formState: { isValid, isDirty },
    handleSubmit,
    register,
    reset,
    setError,
    setValue,
    unregister,
  } = useForm<AddManagerFormValues>({
    resolver: yupResolver(AddManagerPopupSchema(isWorkspaceNameVisible)),
    defaultValues: defaults,
    mode: 'onBlur',
  });

  const role = useWatch({ control, name: Fields.role });

  const dispatch = useAppDispatch();
  const [hasCommonError, setHasCommonError] = useState(false);

  const handleClose = (shouldRefetch = false) => {
    resetForm();
    setHasCommonError(false);
    onClose?.(shouldRefetch);
  };

  const resetForm = () => reset(defaults);

  const {
    error,
    execute: createInvitation,
    isLoading,
  } = useAsync(postAppletInvitationApi, async (result) => {
    const { firstName, lastName, title } = result.data?.result ?? {};
    dispatch(
      banners.actions.addBanner({
        key: 'AddParticipantSuccessBanner',
        bannerProps: {
          id: `${firstName} ${lastName}${title ? `, ${title}` : ''}`,
        },
      }),
    );
    Mixpanel.track('Invitation sent successfully');
    handleClose(true);
  });

  const handleSubmitForm = (values: AddManagerFormValues) => {
    if (!appletId) return;

    const { role, participants = [], workspaceName: workspacePrefix, ...rest } = values;

    Mixpanel.track('Invitation submitted click');

    createInvitation({
      url: role === Roles.Reviewer ? 'reviewer' : 'managers',
      appletId,
      options: {
        role,
        workspacePrefix,
        subjects: participants.map(({ id }) => id),
        ...rest,
      },
    });
  };

  useFormError({
    error,
    setError,
    setHasCommonError,
    fields: Fields,
    customFieldErrors: [
      {
        fieldName: Fields.email,
        apiMessage: USER_ALREADY_INVITED,
        errorMessage: t('teamMemberAlreadyInvited'),
      },
    ],
  });

  useEffect(() => {
    if (!ownerId || !appletId) return;

    const { getAllWorkspaceRespondents } = users.thunk;

    dispatch(
      getAllWorkspaceRespondents({
        params: { ownerId, appletId },
      }),
    );
  }, [ownerId, appletId, dispatch]);

  useEffect(() => {
    if (role === Roles.Reviewer) {
      register(Fields.participants, { value: [] });
    } else {
      unregister(Fields.participants);
    }
  }, [role]);

  useEffect(() => {
    if (isWorkspaceNameVisible) {
      register(Fields.workspaceName);
      setValue(Fields.workspaceName, defaults.workspaceName);
    } else {
      unregister(Fields.workspaceName);
    }
  }, [isWorkspaceNameVisible]);

  if (
    !appletRoles ||
    (!isManagerOrOwner(appletRoles[0]) && !appletRoles.includes(Roles.Coordinator))
  ) {
    return (
      <Modal
        open={popupVisible}
        width="73.6"
        onClose={() => handleClose(false)}
        title={t('addTeamMember')}
        onSubmit={() => handleClose(false)}
        buttonText={t('back')}
        data-testid={`${dataTestid}-add-manager-popup`}
      >
        <StyledModalWrapper>
          <EmptyState width="100%">{t('noPermissions')}</EmptyState>
        </StyledModalWrapper>
      </Modal>
    );
  }

  return (
    <Modal
      open={popupVisible}
      width="73.6"
      onClose={() => handleClose(false)}
      onBackdropClick={null}
      onSubmit={handleSubmit(handleSubmitForm)}
      title={t('addTeamMember')}
      buttonText={t('sendInvitation')}
      disabledSubmit={!isValid}
      hasLeftBtn
      leftBtnText={t('Reset')}
      // TODO: Update second button variant once 'tonal' variant added
      // https://mindlogger.atlassian.net/browse/M2-6071
      leftBtnVariant="outlined"
      onLeftBtnSubmit={resetForm}
      disabledLeftBtn={!isDirty}
      data-testid={`${dataTestid}-add-manager-popup`}
    >
      <StyledModalWrapper>
        {isLoading && <Spinner />}
        <AddManagerForm
          appletParticipants={participants}
          appletRoles={appletRoles}
          control={control}
          isWorkspaceNameVisible={isWorkspaceNameVisible}
          onSubmit={handleSubmit(handleSubmitForm)}
          data-testid={dataTestid}
        />
        {hasCommonError && (
          <StyledErrorText sx={{ mt: 2 }}>{getErrorMessage(error)}</StyledErrorText>
        )}
      </StyledModalWrapper>
    </Modal>
  );
};
