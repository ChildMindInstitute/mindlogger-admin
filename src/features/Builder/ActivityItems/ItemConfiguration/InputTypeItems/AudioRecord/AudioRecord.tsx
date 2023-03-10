import { useTranslation } from 'react-i18next';
import { FieldValues, UseControllerProps } from 'react-hook-form';

import { InputController } from 'components/FormComponents';
import theme from 'styles/theme';
import { Svg } from 'components';

import { ItemOptionContainer } from '../ItemOptionContainer';
import { StyledButton, StyledColumn, StyledInputWrapper } from './AudioRecord.styles';

export const AudioRecord = <T extends FieldValues>({ name, control }: UseControllerProps<T>) => {
  const { t } = useTranslation('app');

  return (
    <ItemOptionContainer title={t('audio')} description={t('audioRecordDescription')}>
      <StyledColumn sx={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}>
        <StyledButton
          disabled
          sx={{ margin: theme.spacing(1.6, 0) }}
          startIcon={<Svg id="audio" width={18} height={18} />}
        >
          {t('audio')}
        </StyledButton>
        <StyledInputWrapper sx={{ mr: theme.spacing(1.25) }}>
          <InputController
            name={name}
            control={control}
            type="number"
            label={t('audioRecordDuration')}
          />
        </StyledInputWrapper>
      </StyledColumn>
    </ItemOptionContainer>
  );
};
