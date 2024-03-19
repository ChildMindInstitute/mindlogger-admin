import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components/Svg';

import { StyledIconBtn, StyledTextField } from '../DatePicker.styles';
import { DatePickerContainerProps } from './DatePickerContainer.types';

export const DatePickerContainer = ({
  value,
  label,
  disabled,
  isOpen,
  inputSx,
  error,
  id,
  dataTestid,
  handlePickerShow,
}: DatePickerContainerProps) => {
  const { t } = useTranslation('app');
  const textFieldProps = {
    fullWidth: true,
    disabled,
    onClick: handlePickerShow,
    className: isOpen ? 'active' : '',
    sx: { ...inputSx },
    error: !!error,
    helperText: error?.message || null,
    InputProps: {
      endAdornment: (
        <StyledIconBtn aria-describedby={id} disabled={disabled}>
          <Svg id="date" />
        </StyledIconBtn>
      ),
    },
    'data-testid': dataTestid,
  };

  return (
    <StyledTextField
      variant="outlined"
      {...textFieldProps}
      label={label || t('date')}
      value={value}
    />
  );
};
