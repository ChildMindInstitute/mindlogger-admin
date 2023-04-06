import { ChangeEvent } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid';

import {
  InputController,
  SelectController,
  TagsInputController,
} from 'shared/components/FormComponents';
import { StyledErrorText, theme } from 'shared/styles';
import { postAppletInvitationApi } from 'api';
import { getErrorMessage } from 'shared/utils';
import { Roles } from 'shared/consts';
import { useAsync } from 'shared/hooks';
import { users } from 'redux/modules';
import { Svg, Tooltip } from 'shared/components';

import {
  StyledButton,
  StyledRow,
  StyledResetButton,
  StyledTitle,
  StyledTooltip,
} from './AddUserForm.styles';
import { Fields, fields, defaultValues, langs, roles } from './AddUserForm.const';
import { AddUserSchema } from './AddUserForm.schema';
import { AddUserFormProps, FormValues } from './AddUserForm.types';
import { getUrl } from './AddUserForm.utils';

export const AddUserForm = ({ getInvitationsHandler }: AddUserFormProps) => {
  const { id } = useParams();
  const { t } = useTranslation('app');

  const respondentsData = users.useRespondentsData();
  const respondents = respondentsData?.result?.map((item) => `${item.secretId} (${item.nickname})`);

  const workspaceNameShowed = false;
  // TODO add logic when back ready

  const {
    handleSubmit,
    control,
    watch,
    reset,
    formState: { isDirty, isValid },
    register,
    unregister,
  } = useForm<FormValues>({
    resolver: yupResolver(AddUserSchema(workspaceNameShowed)),
    defaultValues,
    mode: 'onChange',
  });

  const role = watch(Fields.role);

  const commonProps = {
    fullWidth: true,
    control,
  };

  const resetForm = () => reset();

  const { error, execute } = useAsync(postAppletInvitationApi, async () => {
    await getInvitationsHandler();
    resetForm();
  });

  const onSubmit = (values: FormValues) => {
    if (id) {
      execute({
        url: getUrl(values.role),
        appletId: id,
        options: values,
      });
    }
  };

  const updateFields = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;
    const { nickname, secretUserId, workspacePrefix, respondents } = Fields;

    if (value === Roles.Respondent) {
      register(nickname, { value: '' });
      register(secretUserId, { value: '' });
      unregister(workspacePrefix);
      unregister(respondents);
    } else {
      unregister(nickname);
      unregister(secretUserId);
      if (value === Roles.Reviewer) {
        register(respondents, { value: [] });
      } else {
        unregister(respondents);
      }
      if (workspaceNameShowed) {
        register(workspacePrefix, { value: '' });
      }
    }
  };

  return (
    <>
      <StyledTitle>{t('addUser')}</StyledTitle>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2.4} alignItems="flex-start">
          <Grid container item xs={12} spacing={2.4}>
            {fields.map(({ name }) => (
              <Grid item xs={4} key={name}>
                <InputController {...commonProps} name={name} label={t(name)} />
              </Grid>
            ))}
          </Grid>
          <Grid item xs={4}>
            <SelectController
              {...commonProps}
              name={Fields.role}
              options={roles}
              label={t('role')}
              customChange={updateFields}
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
                noOptionsText={t('noRespondentsYet')}
              />
            </Grid>
          )}
          {role === Roles.Respondent && (
            <>
              <Grid item xs={4}>
                <InputController {...commonProps} name={Fields.nickname} label={t('nickname')} />
              </Grid>
              <Grid item xs={4}>
                <InputController
                  {...commonProps}
                  name={Fields.secretUserId}
                  label={t('secretUserId')}
                />
              </Grid>
            </>
          )}
          {workspaceNameShowed && role !== Roles.Respondent && (
            <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center' }}>
              <InputController
                {...commonProps}
                name={Fields.workspacePrefix}
                label={t('workspaceName')}
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
            />
            <Tooltip tooltipTitle={t('languageTooltip')}>
              <StyledTooltip>
                <Svg id="more-info-outlined" />
              </StyledTooltip>
            </Tooltip>
          </Grid>
        </Grid>
        <StyledRow>
          <StyledButton variant="contained" type="submit" disabled={!isDirty || !isValid}>
            {t('sendInvitation')}
          </StyledButton>
          <StyledResetButton variant="outlined" onClick={resetForm}>
            {t('resetForm')}
          </StyledResetButton>
        </StyledRow>
      </form>
      {error && (
        <StyledErrorText sx={{ mt: theme.spacing(2) }}>{getErrorMessage(error)}</StyledErrorText>
      )}
    </>
  );
};
