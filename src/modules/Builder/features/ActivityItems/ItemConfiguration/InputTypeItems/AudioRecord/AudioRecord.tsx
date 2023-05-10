import { useTranslation } from 'react-i18next';
import { FieldValues, UseControllerProps, useFormContext } from 'react-hook-form';
import { Box, Button } from '@mui/material';

import { InputController } from 'shared/components/FormComponents';
import { theme } from 'shared/styles';
import { Svg } from 'shared/components';

import { ItemOptionContainer } from '../ItemOptionContainer';

export const AudioRecord = ({ name }: UseControllerProps<FieldValues>) => {
  const { t } = useTranslation('app');

  const { control } = useFormContext();

  return (
    <ItemOptionContainer title={t('audio')} description={t('audioRecordDescription')}>
      <Box sx={{ mb: theme.spacing(2.6) }}>
        <Button variant="contained" startIcon={<Svg id="audio" width="18" height="18" />} disabled>
          {t('audio')}
        </Button>
      </Box>
      <InputController
        name={`${name}.responseValues.maxDuration`}
        control={control}
        type="number"
        label={t('audioRecordDuration')}
        minNumberValue={0}
      />
    </ItemOptionContainer>
  );
};
