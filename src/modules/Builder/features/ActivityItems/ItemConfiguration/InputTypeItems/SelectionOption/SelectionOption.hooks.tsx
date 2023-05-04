import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { ColorResult } from 'react-color';

import { SetSelectionOptionValue } from './SelectionOption.types';

export const useSetSelectionOptionValue = ({
  name,
  onUpdateOption,
  index,
  hasTooltipsChecked,
  hasTooltip,
  hasColorPicker,
  hasColor,
}: SetSelectionOptionValue) => {
  const { watch } = useFormContext();
  const option = watch(name);

  const setOptionFieldValue = (
    checkedCondition: boolean,
    elementCondition: boolean,
    fieldName: 'score' | 'tooltip' | 'color',
    defaultValue: string | number | ColorResult,
  ) =>
    checkedCondition
      ? !elementCondition && onUpdateOption(index, { ...option, [fieldName]: defaultValue })
      : elementCondition && onUpdateOption(index, { ...option, [fieldName]: undefined });

  useEffect(() => {
    setOptionFieldValue(hasTooltipsChecked, hasTooltip, 'tooltip', '');
  }, [hasTooltipsChecked, hasTooltip]);

  useEffect(() => {
    setOptionFieldValue(hasColorPicker, hasColor, 'color', { hex: '' } as ColorResult);
  }, [hasColorPicker, hasColor]);
};
