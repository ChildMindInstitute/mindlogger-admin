import { Radio, RadioGroup } from '@mui/material';

import { Tooltip } from 'shared/components/Tooltip';
import { StyledBodyLarge, StyledFlexTopCenter, variables } from 'shared/styles';

import { StyledFormControlLabel, StyledImage, StyledLabel, StyledSvg } from './SingleSelection.styles';
import { SingleSelectionProps } from './SingleSelection.types';

export const SingleSelection = ({
  value,
  activityItem,
  isDisabled = false,
  onChange,
  'data-testid': dataTestid,
  ...radioGroupProps
}: SingleSelectionProps) => {
  const options = activityItem.responseValues.options;

  return (
    <RadioGroup
      {...radioGroupProps}
      value={value}
      onChange={(_, value) => onChange && onChange(value)}
      data-testid={dataTestid}>
      {options.map((option, index) => (
        <StyledFormControlLabel
          disabled={isDisabled}
          key={option.id}
          value={option.value}
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
          control={<Radio />}
        />
      ))}
    </RadioGroup>
  );
};
