import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { EmptyState, Modal, Spinner } from 'shared/components';
import { StyledErrorText, StyledModalWrapper } from 'shared/styles';
import { useFormError } from 'modules/Dashboard/hooks';
import { MAX_LIMIT, Roles } from 'shared/consts';
import {
  Mixpanel,
  MixpanelProps,
  getErrorMessage,
  isManagerOrOwner,
  MixpanelEventType,
} from 'shared/utils';
import { ApiLanguages } from 'api';
import { useAppDispatch } from 'redux/store';
import { banners, workspaces } from 'redux/modules';
import {
  useCreateInvitationMutation,
  useGetWorkspaceRespondentsQuery,
} from 'modules/Dashboard/api/apiSlice';

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

  const { data: participants, isLoading: isLoadingParticipants } = useGetWorkspaceRespondentsQuery(
    { params: { appletId: appletId as string, ownerId, limit: MAX_LIMIT } },
    {
      skip: !appletId,
      selectFromResult: ({ data, ...rest }) => ({
        data: (data?.result ?? []).map(({ details }) => {
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
        }),
        ...rest,
      }),
    },
  );

  const defaults = {
    ...defaultValues(appletRoles),
    language: i18n.language as ApiLanguages,
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

  const handleClose = () => {
    resetForm();
    setHasCommonError(false);
    onClose?.();
  };

  const resetForm = () => reset(defaults);

  const [createInvitation, { error, isLoading: isLoadingInvitation }] =
    useCreateInvitationMutation();

  const handleSubmitForm = async (values: AddManagerFormValues) => {
    if (!appletId) return;

    const { role, participants = [], workspaceName: workspacePrefix, ...rest } = values;

    Mixpanel.track({
      action: MixpanelEventType.TeamMemberInvitationFormSubmitted,
      [MixpanelProps.AppletId]: appletId,
      [MixpanelProps.Roles]: [role],
    });

    const response = await createInvitation({
      url: role === Roles.Reviewer ? 'reviewer' : 'managers',
      appletId,
      options: {
        role,
        workspacePrefix,
        subjects: participants.map(({ id }) => id),
        ...rest,
      },
    });

    if ('data' in response) {
      const { firstName, lastName, title, role } = response.data.result ?? {};

      dispatch(
        banners.actions.addBanner({
          key: 'AddParticipantSuccessBanner',
          bannerProps: {
            id: `${firstName} ${lastName}${title ? `, ${title}` : ''}`,
          },
        }),
      );

      Mixpanel.track({
        action: MixpanelEventType.TeamMemberInvitedSuccessfully,
        [MixpanelProps.AppletId]: appletId,
        [MixpanelProps.Roles]: [String(role)],
      });

      handleClose();
    }
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

  const isLoading = isLoadingParticipants || isLoadingInvitation;

  if (
    !appletRoles ||
    (!isManagerOrOwner(appletRoles[0]) && !appletRoles.includes(Roles.Coordinator))
  ) {
    return (
      <Modal
        open={popupVisible}
        width="73.6"
        onClose={handleClose}
        title={t('addTeamMember')}
        onSubmit={handleClose}
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
      onClose={handleClose}
      onBackdropClick={null}
      onSubmit={handleSubmit(handleSubmitForm)}
      title={t('addTeamMember')}
      buttonText={t('sendInvitation')}
      disabledSubmit={!isValid}
      hasLeftBtn
      leftBtnText={t('Reset')}
      leftBtnVariant="tonal"
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
