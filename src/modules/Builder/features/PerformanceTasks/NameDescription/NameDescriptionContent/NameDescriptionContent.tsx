import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { Box } from '@mui/material';

import { theme } from 'shared/styles';
import { useCurrentActivity } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.hooks';
import { InputController } from 'shared/components/FormComponents';

import {
  NAME_MAX_LENGTH,
  DESCRIPTION_MAX_LENGTH,
  TEXTAREA_ROWS,
} from './NameDescriptionContent.const';

export const NameDescriptionContent = () => {
  const { t } = useTranslation();
  const { control } = useFormContext();
  const { fieldName } = useCurrentActivity();

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
          name={`${fieldName}.name`}
          label={t('activityName')}
          maxLength={NAME_MAX_LENGTH}
        />
      </Box>
      <Box sx={{ mb: theme.spacing(1.6) }}>
        <InputController
          {...commonProps}
          name={`${fieldName}.description`}
          label={t('activityDescription')}
          maxLength={DESCRIPTION_MAX_LENGTH}
          multiline
          rows={TEXTAREA_ROWS}
        />
      </Box>
    </>
  );
};
