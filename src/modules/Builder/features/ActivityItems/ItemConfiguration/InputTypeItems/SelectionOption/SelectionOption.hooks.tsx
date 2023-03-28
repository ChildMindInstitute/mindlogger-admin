import { useEffect } from 'react';
import { ColorResult } from 'react-color';

import { DEFAULT_SCORE_VALUE } from '../../ItemConfiguration.const';
import { SetSelectionOptionValue } from './SelectionOption.types';

export const useSetSelectionOptionValue = ({
  option,
  onUpdateOption,
  index,
  hasScoresChecked,
  scoreString,
  hasTooltipsChecked,
  hasTooltip,
  hasColorPicker,
  hasColor,
}: SetSelectionOptionValue) => {
  const setOptionFieldValue = (
    checkedCondition: boolean,
    elementCondition: boolean,
    fieldName: string,
    defaultValue: string | number | ColorResult,
  ) =>
    checkedCondition
      ? !elementCondition && onUpdateOption(index, { ...option, [fieldName]: defaultValue })
      : elementCondition && onUpdateOption(index, { ...option, [fieldName]: undefined });

  useEffect(() => {
    setOptionFieldValue(hasScoresChecked, !!scoreString, 'score', DEFAULT_SCORE_VALUE);
  }, [hasScoresChecked, scoreString]);

  useEffect(() => {
    setOptionFieldValue(hasTooltipsChecked, hasTooltip, 'tooltip', '');
  }, [hasTooltipsChecked, hasTooltip]);

  useEffect(() => {
    setOptionFieldValue(hasColorPicker, hasColor, 'color', { hex: '' } as ColorResult);
  }, [hasColorPicker, hasColor]);
};
