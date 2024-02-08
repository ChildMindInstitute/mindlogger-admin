import { ChangeEvent, useEffect, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import Grid from '@mui/material/Grid';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { AppletInvitationOptions, getWorkspaceInfoApi, postAppletInvitationApi } from 'api';
import { users, workspaces } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { Svg, Tooltip } from 'shared/components';
import { InputController, SelectController, TagsInputController } from 'shared/components/FormComponents';
import { Roles } from 'shared/consts';
import { useAsync } from 'shared/hooks/useAsync';
import { StyledErrorText, StyledTitleMedium, theme } from 'shared/styles';
import { getErrorMessage, Mixpanel } from 'shared/utils';

import { Fields, fields, defaultValues, langs, getRoles } from './AddUserForm.const';
import { useFormError } from './AddUserForm.hooks';
import { AddUserSchema } from './AddUserForm.schema';
import { StyledButton, StyledRow, StyledResetButton, StyledTooltip } from './AddUserForm.styles';
import { AddUserFormProps, FormValues, WorkspaceInfo } from './AddUserForm.types';
import { getUrl } from './AddUserForm.utils';

export const AddUserForm = ({ getInvitationsHandler, roles }: AddUserFormProps) => {
  const { appletId } = useParams();
  const dispatch = useAppDispatch();
  const { t } = useTranslation('app');

  const [workspaceInfo, setWorkspaceInfo] = useState<WorkspaceInfo | null>(null);

  const workspaceNameVisible = !workspaceInfo?.hasManagers;

  const { ownerId } = workspaces.useData() || {};
  const respondentsData = users.useAllRespondentsData();
  const respondents = respondentsData?.result?.map(({ details, id }) => ({
    label: `${details?.[0].accessId} (${details?.[0].respondentNickname})`,
    id,
  }));
  const { handleSubmit, control, watch, reset, register, unregister, setError } = useForm<FormValues>({
    resolver: yupResolver(AddUserSchema(workspaceNameVisible)),
    defaultValues,
    mode: 'onChange',
  });

  const role = watch(Fields.role);

  const commonProps = {
    fullWidth: true,
    control,
  };

  const resetForm = () => reset();

  const { error, execute: executePostAppletInvitationApi } = useAsync(postAppletInvitationApi, async () => {
    await getInvitationsHandler();
    ownerId && executeGetWorkspaceInfoApi({ ownerId });
    resetForm();
    Mixpanel.track('Invitation sent successfully');
  });
  const { execute: executeGetWorkspaceInfoApi } = useAsync(getWorkspaceInfoApi, res => {
    setWorkspaceInfo(res?.data?.result || null);
  });

  const onSubmit = (values: FormValues) => {
    const options = {
      ...values,
      ...(values.respondents && { respondents: values.respondents.map(item => item.id) }),
    } as AppletInvitationOptions;

    if (appletId) {
      executePostAppletInvitationApi({
        url: getUrl(values.role),
        appletId,
        options,
      });
    }

    Mixpanel.track('Invitation submitted click');
  };

  const updateFields = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;
    const { nickname, secretUserId, workspacePrefix, respondents } = Fields;

    if (value !== Roles.Respondent && value !== Roles.Reviewer) {
      unregister(nickname);
      unregister(secretUserId);
      unregister(respondents);
      workspaceNameVisible && register(workspacePrefix, { value: workspaceInfo?.name || '' });
    }

    if (value === Roles.Respondent) {
      register(nickname, { value: '' });
      register(secretUserId, { value: '' });
      unregister(workspacePrefix);
      unregister(respondents);
    }

    if (value === Roles.Reviewer) {
      register(respondents, { value: [] });
    }
  };

  useEffect(() => {
    if (ownerId) {
      const { getAllWorkspaceRespondents } = users.thunk;

      executeGetWorkspaceInfoApi({ ownerId });
      dispatch(
        getAllWorkspaceRespondents({
          params: { ownerId, appletId },
        }),
      );
    }
  }, [ownerId]);

  const hasCommonError = useFormError({ error, setError });

  return (
    <>
      <StyledTitleMedium sx={{ mb: theme.spacing(2.4) }}>{t('personalInvitation')}</StyledTitleMedium>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2.4} alignItems="flex-start">
          <Grid container item xs={12} spacing={2.4}>
            {fields.map(({ name, 'data-testid': dataTestId }) => (
              <Grid item xs={4} key={name}>
                <InputController {...commonProps} name={name} label={t(name)} data-testid={dataTestId} />
              </Grid>
            ))}
          </Grid>
          <Grid item xs={4}>
            <SelectController
              {...commonProps}
              name={Fields.role}
              options={getRoles(roles)}
              label={t('role')}
              customChange={updateFields}
              data-testid="dashboard-add-users-role"
            />
          </Grid>
          {role === Roles.Reviewer && (
            <Grid item xs={4}>
              <TagsInputController
                {...commonProps}
                name={Fields.respondents}
                options={respondents}
                label={t('respondents')}
                labelAllSelect={t('all')}
                noOptionsText={respondents?.length ? t('noRespondentsToSelect') : t('noRespondentsYet')}
                data-testid="dashboard-add-users-respondents"
              />
            </Grid>
          )}
          {role === Roles.Respondent && (
            <>
              <Grid item xs={4}>
                <InputController
                  {...commonProps}
                  name={Fields.nickname}
                  label={t('nickname')}
                  data-testid="dashboard-add-users-nickname"
                />
              </Grid>
              <Grid item xs={4}>
                <InputController
                  {...commonProps}
                  name={Fields.secretUserId}
                  label={t('secretUserId')}
                  data-testid="dashboard-add-users-secret-id"
                />
              </Grid>
            </>
          )}
          {workspaceNameVisible && role !== Roles.Respondent && (
            <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center' }}>
              <InputController
                {...commonProps}
                name={Fields.workspacePrefix}
                label={t('workspaceName')}
                data-testid="dashboard-add-users-workspace"
              />
              <Tooltip tooltipTitle={t('workspaceTooltip')}>
                <StyledTooltip>
                  <Svg id="more-info-outlined" />
                </StyledTooltip>
              </Tooltip>
            </Grid>
          )}
          <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center' }}>
            <SelectController
              {...commonProps}
              name={Fields.language}
              options={langs}
              label={t('language')}
              data-testid="dashboard-add-users-lang"
            />
            <Tooltip tooltipTitle={t('languageTooltip')}>
              <StyledTooltip>
                <Svg id="more-info-outlined" />
              </StyledTooltip>
            </Tooltip>
          </Grid>
        </Grid>
        <StyledRow>
          <StyledButton variant="contained" type="submit" data-testid="dashboard-add-users-send">
            {t('sendInvitation')}
          </StyledButton>
          <StyledResetButton variant="outlined" onClick={resetForm} data-testid="dashboard-add-users-reset">
            {t('resetForm')}
          </StyledResetButton>
        </StyledRow>
      </form>
      {hasCommonError && <StyledErrorText sx={{ mt: theme.spacing(2) }}>{getErrorMessage(error)}</StyledErrorText>}
    </>
  );
};
