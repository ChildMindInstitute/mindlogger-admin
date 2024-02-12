import { Checkbox } from '@mui/material';

import { StyledBodyLarge, StyledFlexColumn, StyledFlexTopCenter, variables } from 'shared/styles';
import { Tooltip } from 'shared/components/Tooltip';

import { MultipleSelectionProps } from './MultipleSelection.types';
import { StyledFormControlLabel, StyledImage, StyledLabel, StyledSvg } from './MultipleSelection.styles';

export const MultipleSelection = ({
  activityItem,
  value,
  isDisabled = false,
  onChange,
  'data-testid': dataTestid,
  ...checkboxProps
}: MultipleSelectionProps) => {
  const options = activityItem.responseValues.options;

  return (
    <StyledFlexColumn data-testid={dataTestid}>
      {options.map((option, index) => {
        const optionValue = String(option.value!);

        return (
          <StyledFormControlLabel
            key={option.id}
            disabled={isDisabled}
            name={activityItem.id}
            value={option.id}
            data-testid={`${dataTestid}-option-${index}`}
            label={
              <StyledLabel>
                {option.image && (
                  <StyledImage src={option.image} alt="Option image" data-testid={`${dataTestid}-image-${index}`} />
                )}
                <StyledBodyLarge color={variables.palette.on_surface}>{option.text}</StyledBodyLarge>
                {option.tooltip && (
                  <Tooltip tooltipTitle={option.tooltip} data-testid={`${dataTestid}-tooltip-${index}`}>
                    <StyledFlexTopCenter data-testid={`${dataTestid}-more-info-${index}`}>
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
