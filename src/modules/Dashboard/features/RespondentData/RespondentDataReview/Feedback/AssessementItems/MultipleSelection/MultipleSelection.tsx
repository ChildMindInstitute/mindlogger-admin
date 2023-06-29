import { Checkbox } from '@mui/material';

import { StyledBodyLarge, StyledFlexColumn, StyledFlexTopCenter, variables } from 'shared/styles';
import { Tooltip } from 'shared/components';

import { MultipleSelectionProps } from './MultipleSelection.types';
import {
  StyledFormControlLabel,
  StyledImage,
  StyledLabel,
  StyledSvg,
} from './MultipleSelection.styles';

export const MultipleSelection = ({
  activityItem,
  value,
  isDisabled = false,
  onChange,
  ...checkboxProps
}: MultipleSelectionProps) => {
  const options = activityItem.responseValues.options;

  return (
    <StyledFlexColumn>
      {options.map((option) => {
        const optionValue = String(option.value!);

        return (
          <StyledFormControlLabel
            key={option.id}
            disabled={isDisabled}
            name={activityItem.id}
            value={option.id}
            label={
              <StyledLabel>
                {option.image && <StyledImage src={option.image} alt="Option image" />}
                <StyledBodyLarge color={variables.palette.on_surface}>
                  {option.text}
                </StyledBodyLarge>
                {option.tooltip && (
                  <Tooltip tooltipTitle={option.tooltip}>
                    <StyledFlexTopCenter>
                      <StyledSvg id="more-info-outlined" />
                    </StyledFlexTopCenter>
                  </Tooltip>
                )}
              </StyledLabel>
            }
            control={
              <Checkbox
                {...checkboxProps}
                checked={value?.includes(optionValue)}
                onChange={() => {
                  if (!value?.includes(optionValue)) {
                    return onChange && onChange([...value, optionValue]);
                  }
                  const updatedOptions = value.filter((value) => String(value) !== optionValue);
                  onChange && onChange(updatedOptions);
                }}
              />
            }
          />
        );
      })}
    </StyledFlexColumn>
  );
};
