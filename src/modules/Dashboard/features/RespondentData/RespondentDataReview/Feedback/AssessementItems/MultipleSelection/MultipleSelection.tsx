import { Checkbox } from '@mui/material';

import { StyledBodyLarge, StyledFlexColumn, StyledFlexTopCenter, variables } from 'shared/styles';
import { Tooltip } from 'shared/components/Tooltip';

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
  'data-testid': dataTestid,
  ...checkboxProps
}: MultipleSelectionProps) => {
  const options = activityItem.responseValues.options;
  const noneValue = options.find((option) => option.isNoneAbove)?.value;

  const handleCheckboxChange = (optionValue: string) => {
    if (!onChange) return;

    let updatedValues = [...value];
    const isNoneValue = noneValue !== undefined && +optionValue === noneValue;
    const isNoneSelected = noneValue !== undefined && value.includes(String(noneValue));

    if (isNoneValue) {
      updatedValues = isNoneSelected ? [] : [optionValue];
    } else if (isNoneSelected || updatedValues.includes(optionValue)) {
      updatedValues = isNoneSelected
        ? [optionValue]
        : updatedValues.filter((val) => val !== optionValue);
    } else {
      updatedValues.push(optionValue);
    }

    onChange(updatedValues);
  };

  return (
    <StyledFlexColumn data-testid={dataTestid}>
      {options.map((option, index) => {
        const optionValue = String(option.value!);
        const isChecked = value?.includes(optionValue);

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
                  <StyledImage
                    src={option.image}
                    alt="Option image"
                    data-testid={`${dataTestid}-image-${index}`}
                  />
                )}
                <StyledBodyLarge color={variables.palette.on_surface}>
                  {option.text}
                </StyledBodyLarge>
                {option.tooltip && (
                  <Tooltip
                    tooltipTitle={option.tooltip}
                    data-testid={`${dataTestid}-tooltip-${index}`}
                  >
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
                checked={isChecked}
                onChange={() => handleCheckboxChange(optionValue)}
              />
            }
          />
        );
      })}
    </StyledFlexColumn>
  );
};
