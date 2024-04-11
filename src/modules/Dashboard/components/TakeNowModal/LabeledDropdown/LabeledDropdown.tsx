import { Autocomplete, Box, TextField } from '@mui/material';
import React from 'react';

import { Tooltip } from 'shared/components';
import { AutocompleteOption } from 'shared/components/FormComponents';
import { StyledFlexColumn, StyledTitleMedium, StyledTitleTooltipIcon } from 'shared/styles';

export type Option = {
  value: string;
  labelKey: string;
};

export type LabeledDropdownProps = {
  label: string;
  name: string;
  tooltip: string;
  placeholder: string;
  options: AutocompleteOption[];
  value: AutocompleteOption | null;
  onChange: (option: AutocompleteOption | null) => void;
};

export const LabeledDropdown = ({
  label,
  name,
  tooltip,
  options,
  value,
  placeholder,
  onChange,
}: LabeledDropdownProps) => (
  <StyledFlexColumn sx={{ gap: 1.6, marginTop: 2.4 }}>
    <Box sx={{ display: 'flex', gap: 0.4 }}>
      <StyledTitleMedium fontWeight="bold">{label}</StyledTitleMedium>
      <Tooltip tooltipTitle={tooltip}>
        <Box sx={{ height: 24 }}>
          <StyledTitleTooltipIcon
            sx={{ marginLeft: 0 }}
            id="more-info-outlined"
            width={24}
            height={24}
          />
        </Box>
      </Tooltip>
    </Box>
    <Autocomplete
      renderInput={(params) => {
        const { InputLabelProps: _InputLabelProps, ...rest } = params;

        return <TextField {...rest} placeholder={placeholder} name={name} />;
      }}
      options={options}
      fullWidth={true}
      value={value}
      onChange={(_e, newValue) => onChange(newValue)}
    />
  </StyledFlexColumn>
);
