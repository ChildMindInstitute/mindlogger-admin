import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { ColorResult } from 'react-color';

import { SetSelectionOptionValue } from './SelectionOption.types';

export const useSetSelectionOptionValue = ({
  name,
  onUpdateOption,
  index,
  hasColorPicker,
  hasColor,
}: SetSelectionOptionValue) => {
  const { watch } = useFormContext();
  const option = watch(name);

  const setOptionFieldValue = (
    checkedCondition: boolean,
    elementCondition: boolean,
    fieldName: 'color',
    defaultValue: string | number | ColorResult,
  ) =>
    checkedCondition
      ? !elementCondition && onUpdateOption(index, { ...option, [fieldName]: defaultValue })
      : elementCondition && onUpdateOption(index, { ...option, [fieldName]: null });

  useEffect(() => {
    setOptionFieldValue(hasColorPicker, hasColor, 'color', { hex: '' } as ColorResult);
  }, [hasColorPicker, hasColor]);
};
