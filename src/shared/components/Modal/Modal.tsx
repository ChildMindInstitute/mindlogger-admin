import { Box } from '@mui/material';

import { Svg } from 'shared/components/Svg';
import { theme, StyledModalContent } from 'shared/styles';

import { ModalProps } from './Modal.types';
import {
  StyledDialog,
  StyledDialogTitle,
  StyledCloseButton,
  StyledDialogActions,
  StyledButton,
} from './Modal.styles';
import { Tooltip } from '../Tooltip';

export const Modal = ({
  onClose,
  onSubmit = () => null,
  open,
  title,
  buttonText,
  children,
  titleAlign = 'left',
  disabledSubmit = false,
  width = '66',
  height,
  hasSecondBtn = false,
  submitBtnColor = 'primary',
  secondBtnText,
  onSecondBtnSubmit,
  disabledSecondBtn,
  sxProps,
  secondBtnStyles = {},
  hasThirdBtn = false,
  thirdBtnText,
  thirdBtnStyles = {},
  onThirdBtnSubmit,
  footerStyles,
  hasActions = true,
  submitBtnTooltip,
  onTransitionEntered,
  'data-testid': dataTestId,
}: ModalProps) => {
  const getActionsAlign = () => {
    if (hasThirdBtn) {
      return 'space-between';
    } else {
      return hasSecondBtn ? 'end' : 'center';
    }
  };

  const getSubmitBtn = () => {
    if (!buttonText) return;
    const button = (
      <StyledButton
        variant="text"
        disabled={disabledSubmit}
        onClick={onSubmit}
        color={submitBtnColor}
      >
        {buttonText}
      </StyledButton>
    );

    if (submitBtnTooltip) {
      return (
        <Tooltip tooltipTitle={submitBtnTooltip}>
          <span>{button}</span>
        </Tooltip>
      );
    }

    return button;
  };

  return (
    <StyledDialog
      sx={sxProps}
      width={width}
      height={height}
      onClose={onClose}
      open={open}
      TransitionProps={{
        onEntered: onTransitionEntered,
      }}
      data-testid={dataTestId}
    >
      <StyledModalContent>
        <StyledDialogTitle align={titleAlign}>
          {title}
          <StyledCloseButton onClick={onClose} data-testid={`${dataTestId}-close-button`}>
            <Svg id="cross" />
          </StyledCloseButton>
        </StyledDialogTitle>
        {children}
        {hasActions && (
          <StyledDialogActions actionsAlign={getActionsAlign()} sx={footerStyles}>
            {hasThirdBtn && (
              <StyledButton
                fontWeight="regular"
                variant="text"
                onClick={onThirdBtnSubmit}
                sx={{ ...thirdBtnStyles }}
              >
                {thirdBtnText}
              </StyledButton>
            )}
            <Box sx={{ display: 'flex' }}>
              {hasSecondBtn && (
                <StyledButton
                  fontWeight="regular"
                  variant="text"
                  disabled={disabledSecondBtn}
                  onClick={onSecondBtnSubmit}
                  sx={{ marginLeft: theme.spacing(1.6), ...secondBtnStyles }}
                >
                  {secondBtnText}
                </StyledButton>
              )}
              {getSubmitBtn()}
            </Box>
          </StyledDialogActions>
        )}
      </StyledModalContent>
    </StyledDialog>
  );
};
