import { Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { InputController, SelectController } from 'shared/components/FormComponents';
import { Languages } from 'api';
import { StyledLabelLarge } from 'shared/styles';

import { AddParticipantFormProps } from './AddParticipantForm.types';
import { AccountType, Fields } from '../AddParticipantPopup.types';

export const AddParticipantForm = ({
  onSubmit,
  accountType,
  control,
  'data-testid': dataTestid,
}: AddParticipantFormProps) => {
  const { t } = useTranslation('app');
  const commonProps = {
    fullWidth: true,
    control,
  };
  const isFullAccount = accountType === AccountType.Full;

  return (
    <form onSubmit={onSubmit} noValidate data-testid={`${dataTestid}-form`}>
      <Grid container spacing={2.4}>
        {isFullAccount && (
          <Grid item xs={isFullAccount ? 6 : 12}>
            <InputController
              {...commonProps}
              name={Fields.email}
              label={t('emailAddress')}
              data-testid={`${dataTestid}-email`}
            />
          </Grid>
        )}
        <Grid item xs={isFullAccount ? 6 : 12}>
          <InputController
            {...commonProps}
            name={Fields.secretUserId}
            label={t('secretUserId')}
            data-testid={`${dataTestid}-secret-id`}
          />
        </Grid>
        <Grid item xs={6}>
          <InputController
            {...commonProps}
            name={Fields.firstName}
            label={t('firstName')}
            data-testid={`${dataTestid}-fname`}
          />
        </Grid>
        <Grid item xs={6}>
          <InputController
            {...commonProps}
            name={Fields.lastName}
            label={t('lastName')}
            data-testid={`${dataTestid}-lname`}
          />
        </Grid>
        <Grid item xs={6}>
          <InputController
            {...commonProps}
            name={Fields.nickname}
            label={t('nickname')}
            data-testid={`${dataTestid}-nickname`}
          />
        </Grid>
        <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
          <StyledLabelLarge>TODO: Add role selector</StyledLabelLarge>
        </Grid>
        {isFullAccount && (
          <Grid item xs={12}>
            <SelectController
              {...commonProps}
              name={Fields.language}
              options={Object.values(Languages).map((lang) => ({ labelKey: lang, value: lang }))}
              label={t('invitationLanguage')}
              helperText={t('languageTooltip')}
              data-testid={`${dataTestid}-lang`}
            />
          </Grid>
        )}
      </Grid>
    </form>
  );
};
