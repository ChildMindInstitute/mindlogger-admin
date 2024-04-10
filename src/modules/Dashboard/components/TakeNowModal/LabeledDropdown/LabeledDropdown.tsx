import { Box } from '@mui/material';
import React from 'react';

import { Tooltip } from 'shared/components';
import { SelectController, SelectUiType } from 'shared/components/FormComponents';
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
  options: Option[];
  value: Option | null;
  onChange: (option: Option) => void;
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
    <SelectController
      name={name}
      options={options}
      fullWidth={true}
      placeholder={placeholder}
      uiType={SelectUiType.Secondary}
      value={value?.value || ''}
      dropdownStyles={{ maxHeight: '29.2rem' }}
      customChange={(e) => {
        const selectedOption = options.find((option) => option.value === e.target.value);
        if (selectedOption) {
          onChange(selectedOption);
        }
      }}
    />
  </StyledFlexColumn>
);
