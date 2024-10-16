import { Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { InputController, SelectController } from 'shared/components/FormComponents';
import { ApiLanguages } from 'api';

import { UpgradeAccountFormProps } from './UpgradeAccountForm.types';
import { Fields } from '../UpgradeAccountPopup.types';

export const UpgradeAccountForm = ({
  control,
  onSubmit,
  'data-testid': dataTestid,
}: UpgradeAccountFormProps) => {
  const { t } = useTranslation('app');
  const commonProps = {
    fullWidth: true,
    control,
  };

  return (
    <form onSubmit={onSubmit} noValidate data-testid={`${dataTestid}-form`}>
      <Grid container spacing={2.4}>
        <Grid item xs={12}>
          <InputController
            {...commonProps}
            name={Fields.email}
            label={t('emailAddress')}
            placeholder={t('emailAddressPlaceholder')}
            InputLabelProps={{ shrink: true }}
            data-testid={`${dataTestid}-email`}
          />
        </Grid>
        <Grid item xs={12}>
          <SelectController
            {...commonProps}
            name={Fields.language}
            options={Object.values(ApiLanguages).map((lang) => ({ labelKey: lang, value: lang }))}
            label={t('invitationLanguage')}
            helperText={t('languageTooltip')}
            data-testid={`${dataTestid}-lang`}
          />
        </Grid>
      </Grid>
    </form>
  );
};
