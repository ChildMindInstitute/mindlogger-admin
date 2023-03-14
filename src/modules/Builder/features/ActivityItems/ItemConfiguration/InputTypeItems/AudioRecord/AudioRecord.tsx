import { useTranslation } from 'react-i18next';
import { FieldValues, UseControllerProps } from 'react-hook-form';
import { Box, Button } from '@mui/material';

import { InputController } from 'shared/components/FormComponents';
import theme from 'shared/styles/theme';
import { Svg } from 'shared/components';

import { ItemOptionContainer } from '../ItemOptionContainer';

export const AudioRecord = <T extends FieldValues>({ name, control }: UseControllerProps<T>) => {
  const { t } = useTranslation('app');

  return (
    <ItemOptionContainer title={t('audio')} description={t('audioRecordDescription')}>
      <Box sx={{ mb: theme.spacing(2.6) }}>
        <Button variant="contained" startIcon={<Svg id="audio" width="18" height="18" />} disabled>
          {t('audio')}
        </Button>
      </Box>
      <InputController
        name={name}
        control={control}
        type="number"
        label={t('audioRecordDuration')}
      />
    </ItemOptionContainer>
  );
};
