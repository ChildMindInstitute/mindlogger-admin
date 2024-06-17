import { useCallback, useRef, useState } from 'react';
import { Autocomplete, AutocompleteRenderInputParams, TextField, Box } from '@mui/material';
import unionBy from 'lodash/unionBy';
import { useTranslation } from 'react-i18next';

import { Svg, Tooltip } from 'shared/components';
import {
  StyledBodyMedium,
  StyledFlexColumn,
  StyledTitleMedium,
  StyledTitleTooltipIcon,
  theme,
  variables,
} from 'shared/styles';
import { ParticipantSnippet } from 'modules/Dashboard/components/ParticipantSnippet';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';

import { LabeledUserDropdownProps, ParticipantDropdownOption } from './LabeledUserDropdown.types';
import { StyledGroupLabel, StyledWarningMessageContainer } from './LabeledUserDropdown.styles';

export const LabeledUserDropdown = ({
  label,
  name,
  tooltip,
  options,
  value,
  placeholder,
  onChange,
  handleSearch,
  debounce,
  disabled,
  canShowWarningMessage,
  sx,
  showGroups,
  ...rest
}: LabeledUserDropdownProps) => {
  const { t } = useTranslation('app');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [combinedOptions, setCombinedOptions] = useState<ParticipantDropdownOption[]>(options);
  const [isSearching, setIsSearching] = useState(false);
  const {
    featureFlags: { enableParticipantMultiInformant },
  } = useFeatureFlags();

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

  let shouldShowWarningMessage = false;

  // We only potentially show the warning when there is a value
  if (value) {
    const hasFullAccount = !!value.userId;
    const isTeamMember = value.tag === 'Team';
    const warningMessageValueCondition = enableParticipantMultiInformant
      ? !hasFullAccount
      : !isTeamMember;
    shouldShowWarningMessage = !!canShowWarningMessage && warningMessageValueCondition;
  }

  let groupBy: LabeledUserDropdownProps['groupBy'];

  if (showGroups) {
    groupBy = (option: ParticipantDropdownOption) => {
      if (option.tag !== 'Team') {
        return t('takeNow.modal.dropdown.participantGrouping');
      } else {
        return t('takeNow.modal.dropdown.teamMemberGrouping');
      }
    };
  }

  return (
    <StyledFlexColumn sx={{ gap: 1.6, ...sx }}>
      <Box sx={{ display: 'flex', gap: 0.4 }}>
        <StyledTitleMedium sx={{ fontWeight: 700, color: variables.palette.on_surface }}>
          {label}
        </StyledTitleMedium>
        {!!tooltip && (
          <Tooltip tooltipTitle={tooltip}>
            <Box sx={{ height: 24 }}>
              <StyledTitleTooltipIcon
                sx={{ marginLeft: 0 }}
                id="more-info-outlined"
                width={24}
                height={24}
                data-testid={`${rest['data-testid']}-tooltip-icon`}
              />
            </Box>
          </Tooltip>
        )}
      </Box>
      <Autocomplete
        renderInput={(params: AutocompleteRenderInputParams) => {
          const { InputLabelProps: _InputLabelProps, ...rest } = params;

          return <TextField {...rest} placeholder={placeholder} name={name} />;
        }}
        sx={{
          '& .MuiInputBase-root': {
            borderBottomLeftRadius: shouldShowWarningMessage ? 0 : variables.borderRadius.sm,
            borderBottomRightRadius: shouldShowWarningMessage ? 0 : variables.borderRadius.sm,
          },
        }}
        options={combinedOptions}
        renderOption={(
          { children: _children, ...props },
          { id, tag, secretId, nickname, ...psProps },
        ) => (
          <ParticipantSnippet<'li'>
            key={id}
            tag={tag}
            secretId={tag === 'Team' ? nickname : secretId}
            nickname={tag === 'Team' ? null : nickname}
            {...psProps}
            boxProps={{
              sx: {
                p: theme.spacing(0.6, 1.6),
                cursor: 'pointer',
              },
              ...props,
            }}
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
        getOptionLabel={(value) => {
          if (value.tag === 'Team') {
            return `${value.nickname} (${value.tag})`;
          }

          return `${value.secretId}${value.nickname ? ` (${value.nickname})` : ''}${
            value.tag ? ` (${value.tag})` : ''
          }`;
        }}
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
      {shouldShowWarningMessage && (
        <StyledWarningMessageContainer data-testid={`${rest['data-testid']}-warning-message`}>
          <Box width={24} height={24}>
            <Svg id={'supervisor-account'} fill={variables.palette.on_surface_variant} />
          </Box>
          <StyledBodyMedium>{t('takeNow.modal.dropdown.limitedAccountWarning')}</StyledBodyMedium>
        </StyledWarningMessageContainer>
      )}
    </StyledFlexColumn>
  );
};
