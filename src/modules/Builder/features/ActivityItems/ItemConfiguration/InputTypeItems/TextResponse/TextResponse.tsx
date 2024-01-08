import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import get from 'lodash.get';

import { InputController } from 'shared/components/FormComponents';
import { useCustomFormContext } from 'modules/Builder/hooks';

import { ItemOptionContainer } from '../ItemOptionContainer';
import {
  StyledMaxCharacters,
  StyledRow,
  StyledTextField,
  StyledInputWrapper,
} from './TextResponse.styles';
import { TextResponseProps } from './TextResponse.types';
import { ItemConfigurationSettings } from '../../ItemConfiguration.types';
import { MIN_TEXT_RESPONSE_LENGTH } from './TextResponse.const';

export const TextResponse = ({ name }: TextResponseProps) => {
  const { t } = useTranslation('app');

  const { control, watch, setValue, trigger } = useCustomFormContext();
  const responseLengthName = `${name}.config.maxResponseLength`;
  const correctAnswerName = `${name}.config.correctAnswer`;
  const settings = watch(`${name}.config`);
  const maxResponseLength = watch(responseLengthName);
  const correctAnswer = watch(correctAnswerName);

  const handleResponseLengthChange = (value: number) => {
    setValue(responseLengthName, value);
    trigger(responseLengthName);
    if (correctAnswer && value >= MIN_TEXT_RESPONSE_LENGTH && correctAnswer.length > value) {
      const trimmedCorrectAnswer = correctAnswer.slice(0, -1 * (correctAnswer.length - value));

      setValue(correctAnswerName, trimmedCorrectAnswer);
    }
  };

  const handleResponseLengthOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = +event.target.value;
    handleResponseLengthChange(newValue);
  };

  const isCorrectAnswerRequired = get(settings, ItemConfigurationSettings.IsCorrectAnswerRequired);

  return (
    <ItemOptionContainer title={t('textResponseTitle')} description={t('textResponseDescription')}>
      <StyledRow>
        <StyledTextField disabled variant="outlined" value={t('text')} />
        <StyledMaxCharacters>
          <InputController
            name={responseLengthName}
            control={control}
            onChange={handleResponseLengthOnChange}
            onArrowPress={handleResponseLengthChange}
            withDebounce
            type="number"
            label={t('maxCharacters')}
            data-testid="builder-activity-items-item-configuration-text-response-max-length"
          />
        </StyledMaxCharacters>
      </StyledRow>
      {isCorrectAnswerRequired && (
        <StyledInputWrapper>
          <InputController
            name={correctAnswerName}
            control={control}
            label={t('correctAnswer')}
            restrictExceededValueLength
            maxLength={maxResponseLength > 0 ? maxResponseLength : MIN_TEXT_RESPONSE_LENGTH}
            data-testid="builder-activity-items-item-configuration-correct-answer"
          />
        </StyledInputWrapper>
      )}
    </ItemOptionContainer>
  );
};
