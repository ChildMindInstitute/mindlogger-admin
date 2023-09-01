import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { Box } from '@mui/material';

import { theme } from 'shared/styles';
import { useCurrentActivity } from 'modules/Builder/hooks';
import { InputController } from 'shared/components/FormComponents';
import { MAX_NAME_LENGTH, MAX_DESCRIPTION_LENGTH, TEXTAREA_ROWS } from 'shared/consts';

export const NameDescriptionContent = () => {
  const { t } = useTranslation();
  const { control } = useFormContext();
  const { fieldName } = useCurrentActivity();

  const dataTestid = 'builder-activity-flanker';
  const commonProps = {
    control,
    fullWidth: true,
    restrictExceededValueLength: true,
  };

  return (
    <>
      <Box sx={{ m: theme.spacing(1.6, 0, 4) }}>
        <InputController
          {...commonProps}
          key={`${fieldName}.name`}
          name={`${fieldName}.name`}
          label={t('activityName')}
          maxLength={MAX_NAME_LENGTH}
          data-testid={`${dataTestid}-name`}
        />
      </Box>
      <Box sx={{ mb: theme.spacing(1.6) }}>
        <InputController
          {...commonProps}
          key={`${fieldName}.description`}
          name={`${fieldName}.description`}
          label={t('activityDescription')}
          maxLength={MAX_DESCRIPTION_LENGTH}
          multiline
          rows={TEXTAREA_ROWS}
          data-testid={`${dataTestid}-description`}
        />
      </Box>
    </>
  );
};
