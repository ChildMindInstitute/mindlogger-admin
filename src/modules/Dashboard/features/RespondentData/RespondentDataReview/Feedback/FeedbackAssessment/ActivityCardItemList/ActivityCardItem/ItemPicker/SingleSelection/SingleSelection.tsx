import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
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

export const SingleSelection = ({ item, step, isDisabled }: SingleSelectionProps) => {
  const options = item.responseValues.options;
  const { control } = useFormContext();
  const { update } = useFieldArray({
    control,
    name: `answers.${step}.answer.value`,
  });

  return (
    <Controller
      name={`answers.${step}.answer.value[0]`}
      control={control}
      render={({ field }) => (
        <RadioGroup {...field} onChange={(_, value) => update(0, value)}>
          {options.map((option) => (
            <StyledFormControlLabel
              disabled={isDisabled}
              key={option.id}
              value={option.id}
              label={
                <StyledLabel>
                  {option.image && <StyledImage src={option.image} />}
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
              control={<Radio />}
            />
          ))}
        </RadioGroup>
      )}
    />
  );
};
