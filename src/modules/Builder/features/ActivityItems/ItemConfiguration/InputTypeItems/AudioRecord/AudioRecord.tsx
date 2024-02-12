import { useTranslation } from 'react-i18next';
import { UseControllerProps } from 'react-hook-form';
import { Box } from '@mui/material';

import { InputController } from 'shared/components/FormComponents';
import { theme } from 'shared/styles';
import { useCustomFormContext } from 'modules/Builder/hooks';

import { ItemInfo } from '../ItemInfo';
import { ItemOptionContainer } from '../ItemOptionContainer';

export const AudioRecord = ({ name }: UseControllerProps) => {
  const { t } = useTranslation('app');

  const { control } = useCustomFormContext();

  const dataTestid = 'builder-activity-items-item-configuration-audio';

  return (
    <ItemOptionContainer title={t('audio')} description={t('audioRecordDescription')} data-testid={dataTestid}>
      <Box sx={{ mb: theme.spacing(2.6) }}>
        <ItemInfo svgId="audio" textKey="audio" />
      </Box>
      <InputController
        name={`${name}.responseValues.maxDuration`}
        control={control}
        type="number"
        label={t('audioRecordDuration')}
        data-testid={`${dataTestid}-record-max-duration`}
      />
    </ItemOptionContainer>
  );
};
