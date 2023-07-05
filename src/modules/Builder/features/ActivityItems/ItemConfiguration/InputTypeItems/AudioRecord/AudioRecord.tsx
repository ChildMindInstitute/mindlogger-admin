import { useTranslation } from 'react-i18next';
import { UseControllerProps, useFormContext } from 'react-hook-form';
import { Box } from '@mui/material';

import { InputController } from 'shared/components/FormComponents';
import { theme } from 'shared/styles';

import { ItemInfo } from '../ItemInfo';
import { ItemOptionContainer } from '../ItemOptionContainer';

export const AudioRecord = ({ name }: UseControllerProps) => {
  const { t } = useTranslation('app');

  const { control } = useFormContext();

  return (
    <ItemOptionContainer title={t('audio')} description={t('audioRecordDescription')}>
      <Box sx={{ mb: theme.spacing(2.6) }}>
        <ItemInfo svgId="audio" textKey="audio" />
      </Box>
      <InputController
        name={`${name}.responseValues.maxDuration`}
        control={control}
        type="number"
        label={t('audioRecordDuration')}
        minNumberValue={1}
      />
    </ItemOptionContainer>
  );
};
