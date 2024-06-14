import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components/Svg';

import { StyledIconBtn, StyledTextField } from '../DatePicker.styles';
import { DatePickerInputProps } from './DatePickerInput.types';

export const DatePickerInput = ({
  value,
  label,
  disabled,
  isOpen,
  inputWrapperSx = {},
  inputSx = {},
  error,
  id,
  dataTestid,
  handlePickerShow,
  placeholder = '',
  hideLabel = false,
}: DatePickerInputProps) => {
  const { t } = useTranslation('app');
  const textFieldProps = {
    fullWidth: true,
    disabled,
    onClick: handlePickerShow,
    className: isOpen ? 'active' : '',
    sx: { ...inputWrapperSx },
    error: !!error,
    helperText: error?.message || null,
    InputProps: {
      endAdornment: (
        <StyledIconBtn aria-describedby={id} disabled={disabled}>
          <Svg id="date" />
        </StyledIconBtn>
      ),
      sx: { ...inputSx },
    },
    placeholder,
    'data-testid': dataTestid,
  };

  return (
    <StyledTextField
      variant="outlined"
      {...textFieldProps}
      label={hideLabel ? '' : label || t('date')}
      value={value}
    />
  );
};
