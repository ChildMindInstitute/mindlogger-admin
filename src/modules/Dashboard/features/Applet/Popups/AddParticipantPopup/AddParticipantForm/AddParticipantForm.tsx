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
  'data-testid': dataTestId,
}: AddParticipantFormProps) => {
  const { t } = useTranslation('app');
  const commonProps = {
    fullWidth: true,
    control,
    hideErrorUntilTouched: true,
  };
  const isFullAccount = accountType === AccountType.Full;

  return (
    <form onSubmit={onSubmit} noValidate>
      <Grid container spacing={2.4}>
        {isFullAccount && (
          <Grid item xs={isFullAccount ? 6 : 12}>
            <InputController
              {...commonProps}
              name={Fields.email}
              label={t(Fields.email)}
              data-testid={`${dataTestId}-email`}
            />
          </Grid>
        )}
        <Grid item xs={isFullAccount ? 6 : 12}>
          <InputController
            {...commonProps}
            name={Fields.secretUserId}
            label={t(Fields.secretUserId)}
            data-testid={`${dataTestId}-secret-id`}
          />
        </Grid>
        <Grid item xs={6}>
          <InputController
            {...commonProps}
            name={Fields.firstName}
            label={t(Fields.firstName)}
            data-testid={`${dataTestId}-fname`}
          />
        </Grid>
        <Grid item xs={6}>
          <InputController
            {...commonProps}
            name={Fields.lastName}
            label={t(Fields.lastName)}
            data-testid={`${dataTestId}-lname`}
          />
        </Grid>
        <Grid item xs={6}>
          <InputController
            {...commonProps}
            name={Fields.nickname}
            label={t('nickname')}
            data-testid={`${dataTestId}-nickname`}
          />
        </Grid>
        <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
          <StyledLabelLarge>TODO: Add role selector</StyledLabelLarge>
        </Grid>
        {isFullAccount && (
          <Grid item xs={12}>
            <SelectController
              fullWidth={true}
              control={control}
              name={Fields.language}
              options={Object.values(Languages).map((lang) => ({ labelKey: lang, value: lang }))}
              label={t('language')}
              helperText={t('languageTooltip')}
              data-testid={`${dataTestId}-lang`}
            />
          </Grid>
        )}
      </Grid>
    </form>
  );
};
