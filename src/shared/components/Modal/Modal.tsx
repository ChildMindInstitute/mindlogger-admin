import { Box } from '@mui/material';

import { Svg } from 'shared/components/Svg';
import { theme, StyledModalContent } from 'shared/styles';

import { ModalProps, SubmitBtnVariant } from './Modal.types';
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
  submitBtnVariant = SubmitBtnVariant.Text,
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
  hasCloseIcon = true,
  'data-testid': dataTestid,
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
        variant={submitBtnVariant}
        disabled={disabledSubmit}
        onClick={onSubmit}
        color={submitBtnColor}
        data-testid={`${dataTestid}-submit-button`}
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
      data-testid={dataTestid}
    >
      <StyledModalContent>
        <StyledDialogTitle align={titleAlign} data-testid={`${dataTestid}-title`}>
          {title}
          {hasCloseIcon && (
            <StyledCloseButton onClick={onClose} data-testid={`${dataTestid}-close-button`}>
              <Svg id="cross" />
            </StyledCloseButton>
          )}
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
                data-testid={`${dataTestid}-third-button`}
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
                  data-testid={`${dataTestid}-secondary-button`}
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
