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
      {options.map((option) => (
        <StyledFormControlLabel
          key={option.id}
          disabled={isDisabled}
          name={activityItem.id}
          value={option.id}
          label={
            <StyledLabel>
              {option.image && <StyledImage src={option.image} alt="Option image" />}
              <StyledBodyLarge color={variables.palette.on_surface}>{option.text}</StyledBodyLarge>
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
              checked={value?.includes(option.value!)}
              onChange={() => {
                if (!value?.includes(option.value!)) {
                  return onChange && onChange([...value, option.value!]);
                }
                const updatedOptions = value.filter((value) => value !== option.value!);
                onChange && onChange(updatedOptions);
              }}
            />
          }
        />
      ))}
    </StyledFlexColumn>
  );
};
