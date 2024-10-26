import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import get from 'lodash.get';

import { InputController } from 'shared/components/FormComponents';
import { useCustomFormContext } from 'modules/Builder/hooks';
import { TEXTAREA_ROWS_COUNT } from 'shared/consts';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';

import { ItemOptionContainer } from '../ItemOptionContainer';
import {
  StyledInputWrapper,
  StyledMaxCharacters,
  StyledRow,
  StyledTextField,
} from './TextResponse.styles';
import { TextResponseProps, TextResponseUiType } from './TextResponse.types';
import { ItemConfigurationSettings } from '../../ItemConfiguration.types';
import { MIN_TEXT_RESPONSE_LENGTH } from './TextResponse.const';

export const TextResponse = ({ name, uiType }: TextResponseProps) => {
  const { t } = useTranslation('app');
  const {
    featureFlags: { enableParagraphTextItem },
  } = useFeatureFlags();
  const isShortTextUiType = uiType === TextResponseUiType.ShortText;

  const { control, watch, setValue, trigger } = useCustomFormContext();
  const responseLengthName = `${name}.config.maxResponseLength`;
  const correctAnswerName = `${name}.config.correctAnswer`;
  const settings = watch(`${name}.config`);
  const maxResponseLength = watch(responseLengthName);
  const correctAnswer = watch(correctAnswerName);
  const dataTestid = isShortTextUiType
    ? 'builder-activity-items-item-configuration-text-response'
    : 'builder-activity-items-item-configuration-paragraph-text-response';

  const handleResponseLengthChange = (value: number) => {
    setValue(responseLengthName, value);
    trigger(responseLengthName);
    if (correctAnswer && value >= MIN_TEXT_RESPONSE_LENGTH && correctAnswer.length > value) {
      const trimmedCorrectAnswer = correctAnswer.slice(0, value - correctAnswer.length);

      setValue(correctAnswerName, trimmedCorrectAnswer);
    }
  };

  const handleResponseLengthOnChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newValue = +event.target.value;
    handleResponseLengthChange(newValue);
  };

  const isCorrectAnswerRequired =
    isShortTextUiType && get(settings, ItemConfigurationSettings.IsCorrectAnswerRequired);
  const getOptionTitleKey = () => {
    if (isShortTextUiType) {
      return enableParagraphTextItem ? 'shortTextResponse' : 'textResponse';
    }

    return 'paragraphTextResponse';
  };
  const getOptionDescriptionKey = () => {
    if (isShortTextUiType) {
      return enableParagraphTextItem ? 'shortTextResponseDescription' : 'textResponseDescription';
    }

    return 'paragraphTextResponseDescription';
  };

  return (
    <ItemOptionContainer
      title={t(getOptionTitleKey())}
      description={t(getOptionDescriptionKey())}
      data-testid={dataTestid}
    >
      <StyledRow>
        <StyledTextField
          disabled
          variant="outlined"
          value={t('text')}
          data-testid={`${dataTestid}-input`}
          {...(!isShortTextUiType && { multiline: true, rows: TEXTAREA_ROWS_COUNT })}
        />
        <StyledMaxCharacters>
          <InputController
            name={responseLengthName}
            control={control}
            onChange={handleResponseLengthOnChange}
            onArrowPress={handleResponseLengthChange}
            withDebounce
            type="number"
            label={t('maxCharacters')}
            data-testid={`${dataTestid}-max-length`}
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
            data-testid={`${dataTestid}-correct-answer`}
          />
        </StyledInputWrapper>
      )}
    </ItemOptionContainer>
  );
};
