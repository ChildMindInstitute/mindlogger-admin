import { Controller, useFormContext } from 'react-hook-form';
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

export const MultipleSelection = ({ item, step, isDisabled }: MultipleSelectionProps) => {
  const options = item.responseValues.options;
  const { control } = useFormContext();

  return (
    <Controller
      name={`answers.${step}.answer.value`}
      control={control}
      render={({ field }) => {
        const values = field.value.filter((value: string) => value);

        return (
          <StyledFlexColumn>
            {options.map((option) => (
              <StyledFormControlLabel
                {...field}
                key={option.id}
                disabled={isDisabled}
                name={item.id}
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
                    checked={values.includes(option.id)}
                    onChange={() => {
                      if (!values.includes(option.id)) {
                        return field.onChange([...values, option.id]);
                      }
                      const updatedOptions = values.filter((value: string) => value !== option.id);
                      field.onChange(updatedOptions);
                    }}
                  />
                }
              />
            ))}
          </StyledFlexColumn>
        );
      }}
    />
  );
};
