import { useCallback, useRef, useState } from 'react';
import { Autocomplete, Box, TextField } from '@mui/material';
import unionBy from 'lodash/unionBy';
import { useTranslation } from 'react-i18next';

import { Svg, Tooltip } from 'shared/components';
import {
  StyledBodyMedium,
  StyledFlexColumn,
  StyledFlexTopCenter,
  StyledLabelBoldLarge,
  StyledTitleMedium,
  StyledTitleTooltipIcon,
  theme,
  variables,
} from 'shared/styles';
import { ParticipantSnippet } from 'modules/Dashboard/components/ParticipantSnippet';

import { LabeledUserDropdownProps, ParticipantDropdownOption } from './LabeledUserDropdown.types';
import { RenderIf } from '../../../../../shared/components/RenderIf/RenderIf';
import { palette } from '../../../../../shared/styles/variables/palette';

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

  const shouldShowWarningMessage = !!canShowWarningMessage && value && !value.userId;

  return (
    <StyledFlexColumn sx={{ gap: 1.6, ...sx }}>
      <Box sx={{ display: 'flex', gap: 0.4 }}>
        <StyledTitleMedium sx={{ fontWeight: 700, color: palette.on_surface }}>
          {label}
        </StyledTitleMedium>
        <RenderIf condition={!!tooltip}>
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
        </RenderIf>
      </Box>
      <Autocomplete
        renderInput={(params) => {
          const { InputLabelProps: _InputLabelProps, ...rest } = params;

          return <TextField {...rest} placeholder={placeholder} name={name} />;
        }}
        sx={{
          '& .MuiInputBase-root': {
            borderBottomLeftRadius: shouldShowWarningMessage ? 0 : 5,
            borderBottomRightRadius: shouldShowWarningMessage ? 0 : 5,
          },
        }}
        options={combinedOptions}
        renderOption={({ children: _children, ...props }, { id, ...psProps }) => (
          <ParticipantSnippet<'li'>
            key={id}
            {...psProps}
            boxProps={{
              sx: {
                p: theme.spacing(0.6, 1.6),
                cursor: 'pointer',
                ':last-child': {
                  borderBottom: `${variables.borderWidth.md} solid ${palette.surface_variant}`,
                },
              },
              ...props,
            }}
          />
        )}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        groupBy={(option: ParticipantDropdownOption) => {
          if (!showGroups) return undefined;

          if (option.tag !== 'Team') {
            return t('takeNow.modal.dropdown.participantGrouping');
          } else {
            return t('takeNow.modal.dropdown.teamMemberGrouping');
          }
        }}
        renderGroup={(params) => {
          const { key, group, children } = params;

          return (
            <li key={key}>
              <StyledLabelBoldLarge
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  color: palette.on_surface_variant,
                  p: theme.spacing(1.6, 1.6, 0.4),
                  // position: 'sticky',
                  // top: -8,
                  // background: palette.surface,
                }}
              >
                {group}
              </StyledLabelBoldLarge>
              <ul style={{ padding: 0 }}>{children}</ul>
            </li>
          );
        }}
        getOptionLabel={(value) =>
          `${value.secretId}${value.nickname ? ` (${value.nickname})` : ''}`
        }
        disabled={disabled}
        popupIcon={
          <Svg
            id="navigate-down"
            width={24}
            height={24}
            fill={variables.palette[disabled ? 'on_surface_alfa38' : 'on_surface_variant']}
          />
        }
        isOptionEqualToValue={(option, value) => value.id === option.id}
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
      <RenderIf condition={shouldShowWarningMessage}>
        <StyledFlexTopCenter
          sx={{
            gap: 1.6,
            backgroundColor: variables.palette.yellow_light,
            p: theme.spacing(0.8, 1.6),
            mt: -1.6,
          }}
        >
          <Box width={24} height={24}>
            <Svg id={'supervisor-account'} fill={variables.palette.on_surface_variant} />
          </Box>
          <StyledBodyMedium>{t('takeNow.modal.dropdown.limitedAccountWarning')}</StyledBodyMedium>
        </StyledFlexTopCenter>
      </RenderIf>
    </StyledFlexColumn>
  );
};
