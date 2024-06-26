import { MouseEvent, useState } from 'react';
import { Box } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';

import { variables, StyledBodyLarge } from 'shared/styles';
import { RespondentStatus } from 'modules/Dashboard/types';

import { StyledButton, StyledPopover, StyledLinkBtn } from './StatusFlag.styles';
import { StatusFlagProps } from './StatusFlag.types';
import { dataTestId } from './StatusFlag.const';

export const StatusFlag = ({ status, onInviteClick, isInviteDisabled }: StatusFlagProps) => {
  const { t } = useTranslation('app');
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const isNotInvitedStatus = status === RespondentStatus.NotInvited;
  const open = isNotInvitedStatus && !isInviteDisabled && Boolean(anchorEl);
  const id = open ? 'status-flag-popover' : undefined;

  const handleBtnClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleInviteClick = () => {
    onInviteClick?.();
    handleClose();
  };

  return (
    <Box>
      <StyledButton
        disabled={isInviteDisabled || !isNotInvitedStatus}
        aria-describedby={id}
        variant="contained"
        onClick={handleBtnClick}
        data-testid={`${dataTestId}-button`}
      >
        {isNotInvitedStatus ? t('notInvited') : t('pending')}
      </StyledButton>
      <StyledPopover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        data-testid={`${dataTestId}-popover`}
      >
        <Trans i18nKey="inviteTooltip">
          <StyledBodyLarge color={variables.palette.on_surface}>
            To enable this person to use MindLogger on their own,
          </StyledBodyLarge>
          <StyledLinkBtn onClick={handleInviteClick}>invite them now</StyledLinkBtn>.
        </Trans>
      </StyledPopover>
    </Box>
  );
};
