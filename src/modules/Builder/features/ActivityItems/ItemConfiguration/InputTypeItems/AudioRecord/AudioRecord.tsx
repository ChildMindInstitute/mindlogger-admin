import { useTranslation } from 'react-i18next';
import { FieldValues, UseControllerProps } from 'react-hook-form';
import { Box, Button } from '@mui/material';

import { InputController } from 'shared/components/FormComponents';
import { theme } from 'shared/styles';
import { Svg } from 'shared/components';
import { ItemInputTypes } from 'shared/types';

import { ItemOptionContainer } from '../ItemOptionContainer';
import { DEFAULT_AUDIO_DURATION_MS } from '../../ItemConfiguration.const';
import { useOptionalItemSetup } from '../../ItemConfiguration.hooks';

export const AudioRecord = ({ name }: UseControllerProps<FieldValues>) => {
  const { t } = useTranslation('app');
  const { control } = useOptionalItemSetup({
    itemType: ItemInputTypes.Audio,
    name,
    defaultValue: DEFAULT_AUDIO_DURATION_MS,
  });

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
