import { Radio, RadioGroup } from '@mui/material';

import { StyledBodyLarge, StyledFlexTopCenter, variables } from 'shared/styles';
import { Tooltip } from 'shared/components';

import { SingleSelectionProps } from './SingleSelection.types';
import {
  StyledFormControlLabel,
  StyledImage,
  StyledLabel,
  StyledSvg,
} from './SingleSelection.styles';

export const SingleSelection = ({
  value,
  activityItem,
  isDisabled = false,
  onChange,
  ...radioGroupProps
}: SingleSelectionProps) => {
  const options = activityItem.responseValues.options;

  return (
    <RadioGroup
      {...radioGroupProps}
      value={value}
      onChange={(_, value) => onChange && onChange(value)}
    >
      {options.map((option) => (
        <StyledFormControlLabel
          disabled={isDisabled}
          key={option.id}
          value={option.value}
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
          control={<Radio />}
        />
      ))}
    </RadioGroup>
  );
};
