import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import get from 'lodash.get';

import { InputController } from 'shared/components/FormComponents';

import { ItemOptionContainer } from '../ItemOptionContainer';
import {
  StyledMaxCharacters,
  StyledRow,
  StyledTextField,
  StyledInputWrapper,
} from './TextResponse.styles';
import { TextResponseProps } from './TextResponse.types';
import { ItemConfigurationSettings } from '../../ItemConfiguration.types';

export const TextResponse = ({ name }: TextResponseProps) => {
  const { t } = useTranslation('app');

  const { control, watch } = useFormContext();
  const settings = watch(`${name}.config`);

  const isCorrectAnswerRequired = get(settings, ItemConfigurationSettings.IsCorrectAnswerRequired);

  return (
    <ItemOptionContainer title={t('textResponseTitle')} description={t('textResponseDescription')}>
      <StyledRow>
        <StyledTextField disabled variant="outlined" value={t('text')} />
        <StyledMaxCharacters>
          <InputController
            name={`${name}.config.maxResponseLength`}
            control={control}
            type="number"
            label={t('maxCharacters')}
            minNumberValue={1}
            data-testid="builder-activity-items-item-configuration-text-response-max-length"
          />
        </StyledMaxCharacters>
      </StyledRow>
      {isCorrectAnswerRequired && (
        <StyledInputWrapper>
          <InputController
            name={`${name}.config.correctAnswer`}
            control={control}
            label={t('correctAnswer')}
            data-testid="builder-activity-items-item-configuration-correct-answer"
          />
        </StyledInputWrapper>
      )}
    </ItemOptionContainer>
  );
};
