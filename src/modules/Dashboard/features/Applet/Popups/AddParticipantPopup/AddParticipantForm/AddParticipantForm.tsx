import { Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { InputController, SelectController } from 'shared/components/FormComponents';
import { Languages } from 'api';
import { StyledLabelLarge } from 'shared/styles';
import { AccountType } from 'modules/Dashboard/types/Dashboard.types';

import { AddParticipantFormProps } from './AddParticipantForm.types';
import { Fields } from '../AddParticipantPopup.types';

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
              placeholder={t('emailAddressPlaceholder')}
              InputLabelProps={{ shrink: true }}
              data-testid={`${dataTestid}-email`}
            />
          </Grid>
        )}
        <Grid item xs={isFullAccount ? 6 : 12}>
          <InputController
            {...commonProps}
            name={Fields.secretUserId}
            label={t('secretUserId')}
            placeholder={t('secretUserIdPlaceholder')}
            InputLabelProps={{ shrink: true }}
            data-testid={`${dataTestid}-secret-id`}
          />
        </Grid>
        <Grid item xs={6}>
          <InputController
            {...commonProps}
            name={Fields.firstName}
            label={t('firstName')}
            placeholder={t('firstNamePlaceholder')}
            InputLabelProps={{ shrink: true }}
            data-testid={`${dataTestid}-fname`}
          />
        </Grid>
        <Grid item xs={6}>
          <InputController
            {...commonProps}
            name={Fields.lastName}
            label={t('lastName')}
            placeholder={t('lastNamePlaceholder')}
            InputLabelProps={{ shrink: true }}
            data-testid={`${dataTestid}-lname`}
          />
        </Grid>
        <Grid item xs={6}>
          <InputController
            {...commonProps}
            name={Fields.nickname}
            label={t('nickname')}
            placeholder={t('nicknamePlaceholder')}
            InputLabelProps={{ shrink: true }}
            data-testid={`${dataTestid}-nickname`}
          />
        </Grid>
        {/* TODO: Add tag support (https://mindlogger.atlassian.net/browse/M2-5861) */}
        <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
          <StyledLabelLarge>TODO: Add tag selector</StyledLabelLarge>
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
