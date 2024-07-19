import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import {
  StyledBodyMedium,
  StyledFlexColumn,
  StyledTitleMedium,
  StyledTitleTooltipIcon,
  variables,
} from 'shared/styles';
import { ParticipantDropdown } from 'modules/Dashboard/components';
import { Svg, Tooltip } from 'shared/components';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';

import { TakeNowDropdownProps } from './TakeNowModal.types';
import { StyledWarningMessageContainer } from './TakeNowDropdown.styles';

export const TakeNowDropdown = ({
  label,
  tooltip,
  value,
  canShowWarningMessage,
  sx,
  ...rest
}: TakeNowDropdownProps) => {
  const { t } = useTranslation('app');
  const {
    featureFlags: { enableParticipantMultiInformant },
  } = useFeatureFlags();

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
      <ParticipantDropdown
        value={value}
        sx={{
          '& .MuiInputBase-root': {
            borderBottomLeftRadius: shouldShowWarningMessage ? 0 : variables.borderRadius.sm,
            borderBottomRightRadius: shouldShowWarningMessage ? 0 : variables.borderRadius.sm,
          },
        }}
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
