import { Box, ClickAwayListener } from '@mui/material';

import { StyledFlexTopCenter, theme } from 'shared/styles';
import { Svg, Tooltip } from 'shared/components';

import { InvitationWithTooltipProps } from './InvitationWithTooltip.types';
import { StyledCopyButton } from './InvitationWithTooltip.styles';

export const InvitationWithTooltip = ({
  open,
  onClose,
  invitationLink,
}: InvitationWithTooltipProps) => (
  <Tooltip
    tooltipTitle={
      <ClickAwayListener onClickAway={onClose}>
        <StyledFlexTopCenter sx={{ cursor: 'default' }}>
          <Box sx={{ mr: theme.spacing(1) }}>{invitationLink}</Box>
          <StyledCopyButton
            sx={{ cursor: 'pointer' }}
            onClick={() => navigator.clipboard.writeText(invitationLink)}
          >
            <Svg id="duplicate" width="18" height="18" />
          </StyledCopyButton>
        </StyledFlexTopCenter>
      </ClickAwayListener>
    }
    open={open}
    maxWidth="none"
    PopperProps={{
      disablePortal: true,
    }}
  >
    <span>{invitationLink}</span>
  </Tooltip>
);
