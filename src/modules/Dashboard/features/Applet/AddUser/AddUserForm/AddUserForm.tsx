import { ChangeEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { Button, Grid } from '@mui/material';

import {
  InputController,
  SelectController,
  TagsInputController,
} from 'shared/components/FormComponents';
import { StyledErrorText, StyledFlexTopCenter, StyledTitleMedium, theme } from 'shared/styles';
import { AppletInvitationOptions, getWorkspaceInfoApi, postAppletInvitationApi } from 'api';
import { getErrorMessage, Mixpanel } from 'shared/utils';
import { Roles } from 'shared/consts';
import { useAsync } from 'shared/hooks/useAsync';
import { users, workspaces } from 'redux/modules';
import { Svg, Tooltip } from 'shared/components';
import { useAppDispatch } from 'redux/store';

import { StyledRow, StyledTooltip } from './AddUserForm.styles';
import {
  dataTestId,
  defaultValues,
  Fields,
  getRoles,
  languages,
  nameFields,
  SubmitBtnType,
} from './AddUserForm.const';
import { AddUserSchema } from './AddUserForm.schema';
import { AddUserFormProps, AddUserFormValues, WorkspaceInfo } from './AddUserForm.types';
import { getUrl } from './AddUserForm.utils';
import { useFormError } from './AddUserForm.hooks';

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
  const { handleSubmit, control, watch, reset, register, unregister, setError, setValue } =
    useForm<AddUserFormValues>({
      resolver: yupResolver(AddUserSchema(workspaceNameVisible)),
      defaultValues,
      mode: 'onSubmit',
    });

  const role = watch(Fields.role);
  const isRespondentRole = role === Roles.Respondent;

  const commonProps = {
    fullWidth: true,
    control,
  };

  const resetForm = () => reset();

  const { error, execute: executePostAppletInvitationApi } = useAsync(
    postAppletInvitationApi,
    async () => {
      await getInvitationsHandler();
      ownerId && executeGetWorkspaceInfoApi({ ownerId });
      resetForm();
      Mixpanel.track('Invitation sent successfully');
    },
  );
  const { execute: executeGetWorkspaceInfoApi } = useAsync(getWorkspaceInfoApi, (res) => {
    setWorkspaceInfo(res?.data?.result || null);
  });

  const onSubmit = (values: AddUserFormValues) => {
    Mixpanel.track('Invitation submitted click');
    if (!appletId) return;
    const { submitBtnType, ...restValues } = values;
    const options = {
      ...restValues,
      ...(restValues.respondents && { respondents: restValues.respondents.map((item) => item.id) }),
    } as AppletInvitationOptions;

    if (submitBtnType === SubmitBtnType.WithInvitation) {
      executePostAppletInvitationApi({
        url: getUrl(restValues.role),
        appletId,
        options,
      });
    } else if (submitBtnType === SubmitBtnType.WithoutInvitation) {
      console.log('without invitation click');
    }
  };

  const updateFields = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = event.target;
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

  const hasCommonError = useFormError({ error, setError });

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

  return (
    <>
      <StyledTitleMedium sx={{ mb: theme.spacing(2.4) }}>
        {t('personalInvitation')}
      </StyledTitleMedium>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2.4} alignItems="flex-start">
          <Grid item xs={4}>
            <SelectController
              {...commonProps}
              name={Fields.role}
              options={getRoles(roles)}
              label={t('role')}
              customChange={updateFields}
              data-testid={`${dataTestId}-role`}
            />
          </Grid>
          {isRespondentRole && (
            <Grid item xs={4}>
              <InputController
                {...commonProps}
                name={Fields.secretUserId}
                label={t(Fields.secretUserId)}
                data-testid={`${dataTestId}-secret-id`}
              />
            </Grid>
          )}
          <Grid item xs={4}>
            <InputController
              {...commonProps}
              name={Fields.email}
              label={isRespondentRole ? t('respondentEmail') : t(Fields.email)}
              data-testid={`${dataTestId}-email`}
            />
          </Grid>
          {nameFields.map(({ name, 'data-testid': dataTestId }) => (
            <Grid item xs={4} key={name}>
              <InputController
                {...commonProps}
                name={name}
                label={t(name)}
                data-testid={dataTestId}
              />
            </Grid>
          ))}
          {isRespondentRole && (
            <Grid item xs={4}>
              <InputController
                {...commonProps}
                name={Fields.nickname}
                label={t('nicknameOptional')}
                data-testid={`${dataTestId}-nickname`}
              />
            </Grid>
          )}
          {role === Roles.Reviewer && (
            <Grid item xs={4}>
              <TagsInputController
                {...commonProps}
                name={Fields.respondents}
                options={respondents}
                label={t('respondents')}
                labelAllSelect={t('all')}
                noOptionsText={
                  respondents?.length ? t('noRespondentsToSelect') : t('noRespondentsYet')
                }
                data-testid={`${dataTestId}-respondents`}
              />
            </Grid>
          )}
          {workspaceNameVisible && role !== Roles.Respondent && (
            <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center' }}>
              <InputController
                {...commonProps}
                name={Fields.workspacePrefix}
                label={t('workspaceName')}
                data-testid={`${dataTestId}-workspace`}
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
              options={languages}
              label={t('language')}
              data-testid={`${dataTestId}-lang`}
            />
            <Tooltip tooltipTitle={t('languageTooltip')}>
              <StyledTooltip>
                <Svg id="more-info-outlined" />
              </StyledTooltip>
            </Tooltip>
          </Grid>
        </Grid>
        <StyledRow>
          <Button
            type="submit"
            variant="contained"
            onClick={() => setValue('submitBtnType', SubmitBtnType.WithInvitation)}
            data-testid={`${dataTestId}-send`}
          >
            {t('sendInvitation')}
          </Button>
          {isRespondentRole ? (
            <StyledFlexTopCenter>
              <Button
                type="submit"
                variant="outlined"
                sx={{ ml: theme.spacing(1.2) }}
                onClick={() => setValue('submitBtnType', SubmitBtnType.WithoutInvitation)}
                data-testid={`${dataTestId}-send-without-inviting`}
              >
                {t('addWithoutInviting')}
              </Button>
              <Tooltip tooltipTitle={t('addWithoutInvitingTooltip')}>
                <StyledTooltip>
                  <Svg id="more-info-outlined" />
                </StyledTooltip>
              </Tooltip>
            </StyledFlexTopCenter>
          ) : (
            <Button
              variant="outlined"
              sx={{ ml: theme.spacing(1.2) }}
              onClick={resetForm}
              data-testid={`${dataTestId}-reset`}
            >
              {t('resetForm')}
            </Button>
          )}
        </StyledRow>
      </form>
      {hasCommonError && (
        <StyledErrorText sx={{ mt: theme.spacing(2) }}>{getErrorMessage(error)}</StyledErrorText>
      )}
    </>
  );
};
