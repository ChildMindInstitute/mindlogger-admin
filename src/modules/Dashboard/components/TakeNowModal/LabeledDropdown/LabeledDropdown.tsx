import { Autocomplete, Box, TextField } from '@mui/material';
import React, { useCallback, useRef, useState } from 'react';
import unionBy from 'lodash/unionBy';
import { useTranslation } from 'react-i18next';

import { Tooltip } from 'shared/components';
import { AutocompleteOption } from 'shared/components/FormComponents';
import { StyledFlexColumn, StyledTitleMedium, StyledTitleTooltipIcon } from 'shared/styles';

import { LabeledDropdownProps } from './LabeledDropdown.types';

export const LabeledDropdown = ({
  label,
  name,
  tooltip,
  options,
  value,
  placeholder,
  onChange,
  handleSearch,
  debounce,
  ...rest
}: LabeledDropdownProps) => {
  const { t } = useTranslation('app');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [combinedOptions, setCombinedOptions] = useState<AutocompleteOption[]>(options);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearchHandler = useCallback(
    (search: string) => {
      const searchTrimmed = search.trim();
      if (!handleSearch || !searchTrimmed) {
        return;
      }

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      setIsSearching(true);

      debounceRef.current = setTimeout(async () => {
        try {
          let results = handleSearch(searchTrimmed);

          if (results instanceof Promise) {
            results = await results;
          }

          setCombinedOptions((prev) => unionBy(prev, results as AutocompleteOption[], 'id'));
          setIsSearching(false);
        } catch (_e) {
          // Ignored
        }
      }, debounce ?? 500);
    },
    [debounce, handleSearch],
  );

  return (
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
        options={combinedOptions}
        fullWidth={true}
        value={value}
        onChange={(_e, newValue) => onChange(newValue)}
        clearOnBlur={false}
        handleHomeEndKeys
        loading={isSearching}
        loadingText={t('loadingEllipsis')}
        noOptionsText={t('takeNowNotFound')}
        onInputChange={(_e, search) => debouncedSearchHandler(search)}
        {...rest}
      />
    </StyledFlexColumn>
  );
};
