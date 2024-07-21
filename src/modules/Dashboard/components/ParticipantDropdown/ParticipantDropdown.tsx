import { useCallback, useEffect, useRef, useState } from 'react';
import { Autocomplete, AutocompleteRenderInputParams, TextField, Box } from '@mui/material';
import unionBy from 'lodash/unionBy';
import { useTranslation } from 'react-i18next';

import { Chip, Svg } from 'shared/components';
import { StyledFlexTopCenter, theme, variables } from 'shared/styles';
import { ParticipantSnippet } from 'modules/Dashboard/components/ParticipantSnippet';

import { ParticipantDropdownProps, ParticipantDropdownOption } from './ParticipantDropdown.types';
import { StyledGroupLabel } from './ParticipantDropdown.styles';
import { getParticipantLabel } from './ParticipantDropdown.utils';

export const ParticipantDropdown = ({
  name,
  options,
  value,
  placeholder,
  onChange,
  handleSearch,
  debounce,
  disabled,
  showGroups,
  emptyValueError,
  ...rest
}: ParticipantDropdownProps) => {
  const { t } = useTranslation('app');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [combinedOptions, setCombinedOptions] = useState<ParticipantDropdownOption[]>(options);
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

          setCombinedOptions((prev) => unionBy(prev, results as ParticipantDropdownOption[], 'id'));
          setIsSearching(false);
        } catch (_e) {
          setIsSearching(false);
        }
      }, debounce ?? 500);
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
        return t('takeNow.modal.dropdown.participantGrouping');
      } else {
        return t('takeNow.modal.dropdown.teamMemberGrouping');
      }
    };
  }

  return (
    <Autocomplete
      renderInput={(params: AutocompleteRenderInputParams) => {
        const { InputLabelProps: _InputLabelProps, ...rest } = params;
        const hasEmptyError = !value && emptyValueError;

        return (
          <Box sx={{ position: 'relative' }}>
            <TextField
              {...rest}
              placeholder={hasEmptyError ? undefined : placeholder}
              name={name}
            />
            {hasEmptyError && (
              <StyledFlexTopCenter sx={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <Chip
                  color="warning"
                  icon={<Svg id="exclamation-outline" width={18} height={18} />}
                  title={emptyValueError}
                />
              </StyledFlexTopCenter>
            )}
          </Box>
        );
      }}
      options={searchResults ?? options}
      renderOption={(
        { children: _children, ...props },
        { id, tag, secretId, nickname, isTeamMember, ...psProps },
      ) => (
        <ParticipantSnippet<'li'>
          key={id}
          tag={tag}
          secretId={isTeamMember ? nickname : secretId}
          nickname={isTeamMember ? null : nickname}
          {...psProps}
          boxProps={{
            sx: {
              p: theme.spacing(0.6, 1.6),
              cursor: 'pointer',
            },
            ...props,
          }}
          data-testid={`${rest['data-testid']}-option-${id}`}
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
      clearOnBlur={false}
      handleHomeEndKeys
      loading={isSearching}
      loadingText={t('loadingEllipsis')}
      noOptionsText={t('takeNow.modal.dropdown.notFound')}
      onInputChange={(_e, search) => debouncedSearchHandler(search)}
      {...rest}
    />
  );
};
