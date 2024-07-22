import { useCallback, useEffect, useRef, useState } from 'react';
import { Autocomplete, AutocompleteRenderInputParams, Box } from '@mui/material';
import unionBy from 'lodash/unionBy';
import { useTranslation } from 'react-i18next';

import { Chip, Svg } from 'shared/components';
import { theme, variables } from 'shared/styles';
import { ParticipantSnippet } from 'modules/Dashboard/components/ParticipantSnippet';

import {
  ParticipantDropdownProps,
  ParticipantDropdownOption,
  ParticipantDropdownVariant,
} from './ParticipantDropdown.types';
import {
  StyledEmptyError,
  StyledGroupLabel,
  StyledTextField,
  StyledTextFieldWrapper,
} from './ParticipantDropdown.styles';
import { getParticipantLabel } from './ParticipantDropdown.utils';

export const ParticipantDropdown = ({
  name,
  options,
  value,
  placeholder,
  onOpen,
  onChange,
  handleSearch,
  debounce = 500,
  disabled,
  showGroups,
  emptyValueError,
  variant = ParticipantDropdownVariant.Outlined,
  'data-testid': dataTestId,
  ...rest
}: ParticipantDropdownProps) => {
  const { t } = useTranslation('app');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [combinedOptions, setCombinedOptions] = useState<ParticipantDropdownOption[]>(options);
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const debouncedSearchHandler = useCallback(
    (search: string) => {
      const searchTrimmed = search.trim();
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      if (!handleSearch || !searchTrimmed) {
        return;
      }

      setIsSearching(true);

      debounceRef.current = setTimeout(async () => {
        try {
          let results = handleSearch(searchTrimmed);

          if (results instanceof Promise) {
            results = await results;
          }

          setCombinedOptions((prev) => unionBy(prev, results as ParticipantDropdownOption[], 'id'));
        } finally {
          setIsSearching(false);
        }
      }, debounce);
    },
    [debounce, handleSearch],
  );

  useEffect(() => {
    setCombinedOptions((prev) => unionBy(options, prev, 'id'));
  }, [options]);

  let groupBy: ParticipantDropdownProps['groupBy'];

  if (showGroups) {
    groupBy = (option: ParticipantDropdownOption) => {
      if (!option.isTeamMember) {
        return t('participantDropdown.participantGrouping');
      } else {
        return t('participantDropdown.teamMemberGrouping');
      }
    };
  }

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Autocomplete
      size={variant === ParticipantDropdownVariant.Full ? 'large' : 'medium'}
      renderInput={(params: AutocompleteRenderInputParams) => {
        const { InputLabelProps: _InputLabelProps, ...rest } = params;
        const hasEmptyError = !value && !isFocused && emptyValueError;
        const isSnippetVisible = !!value && !isFocused;
        const isFullVariant = variant === ParticipantDropdownVariant.Full;

        return (
          <StyledTextFieldWrapper isShaded={isFullVariant && !isFocused}>
            <StyledTextField
              {...rest}
              placeholder={hasEmptyError ? undefined : placeholder}
              name={name}
              inputRef={inputRef}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              isSnippetVisible={isSnippetVisible}
              isFullVariant={isFullVariant}
            />
            {isSnippetVisible && (
              <ParticipantSnippet
                {...value}
                hasLimitedAccountIcon={!value.userId}
                boxProps={{
                  sx: {
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    transition: variables.transitions.all,
                    p: theme.spacing(0, 5.6, 0, isFullVariant ? 3.2 : 1.6),
                    '.MuiAutocomplete-root:hover &': {
                      pr: 10.4,
                    },
                  },
                }}
                data-testid={`${dataTestId}-selected-option`}
              />
            )}
            {hasEmptyError && (
              <StyledEmptyError isFullVariant={isFullVariant}>
                <Chip
                  color="warning"
                  icon={<Svg id="exclamation-outline" width={18} height={18} />}
                  title={emptyValueError}
                />
              </StyledEmptyError>
            )}
          </StyledTextFieldWrapper>
        );
      }}
      options={combinedOptions ?? options}
      renderOption={({ children: _children, ...props }, value) => (
        <ParticipantSnippet<'li'>
          key={value.id}
          hasLimitedAccountIcon={!value.userId}
          {...value}
          boxProps={{
            sx: {
              p: theme.spacing(0.6, 1.6),
              cursor: 'pointer',
            },
            ...props,
          }}
          data-testid={`${dataTestId}-option-${value.id}`}
        />
      )}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      groupBy={groupBy}
      renderGroup={(params) => {
        const { key, group, children } = params;

        return (
          <Box
            component="li"
            key={key}
            sx={{
              '&:not(:last-child)': {
                borderBottom: `${variables.borderWidth.md} solid ${variables.palette.surface_variant}`,
              },
            }}
          >
            <StyledGroupLabel>{group}</StyledGroupLabel>
            <Box component="ul" sx={{ p: 0 }}>
              {children}
            </Box>
          </Box>
        );
      }}
      getOptionLabel={getParticipantLabel}
      disabled={disabled}
      popupIcon={
        <Svg
          id="navigate-down"
          width={24}
          height={24}
          fill={variables.palette[disabled ? 'on_surface_alfa38' : 'on_surface_variant']}
        />
      }
      fullWidth={true}
      value={value}
      onChange={(_e, newValue) => onChange(newValue)}
      onOpen={(event) => {
        debouncedSearchHandler('');
        onOpen?.(event);
      }}
      openOnFocus
      clearOnBlur
      handleHomeEndKeys
      loading={isSearching}
      loadingText={t('loadingEllipsis')}
      noOptionsText={t('participantDropdown.notFound')}
      onInputChange={(_e, search) => debouncedSearchHandler(search)}
      componentsProps={{
        clearIndicator: {
          onClick: () => {
            onChange(null);
          },
        },
        paper: variant === ParticipantDropdownVariant.Full ? { sx: { mx: -0.8 } } : undefined,
      }}
      data-testid={dataTestId}
      {...rest}
    />
  );
};
