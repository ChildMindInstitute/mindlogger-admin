import { Button, ModalComponentsPropsOverrides } from '@mui/material';

import { Svg } from 'shared/components/Svg';
import { StyledModalContent, StyledFlexTopCenter, StyledFlexSpaceBetween } from 'shared/styles';

import { ModalProps } from './Modal.types';
import {
  StyledDialog,
  StyledDialogTitle,
  StyledCloseButton,
  StyledDialogActions,
  StyledDialogHeader,
} from './Modal.styles';
import { Tooltip } from '../Tooltip';

export const Modal = ({
  onClose,
  onBackdropClick: onOverlayClick = onClose,
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
  submitBtnVariant = 'contained',
  onSecondBtnSubmit,
  secondBtnVariant = 'text',
  disabledSecondBtn,
  sxProps,
  secondBtnStyles = {},
  hasThirdBtn = false,
  thirdBtnText,
  thirdBtnStyles = {},
  onThirdBtnSubmit,
  hasLeftBtn = false,
  leftBtnText,
  leftBtnVariant = 'text',
  onLeftBtnSubmit,
  disabledLeftBtn,
  footerStyles,
  hasActions = true,
  submitBtnTooltip,
  onTransitionEntered,
  hasCloseIcon = true,
  footer,
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
      <Button
        variant={submitBtnVariant}
        disabled={disabledSubmit}
        onClick={onSubmit}
        color={submitBtnColor}
        data-testid={`${dataTestid}-submit-button`}
      >
        {buttonText}
      </Button>
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
      onClose={onOverlayClick ?? undefined}
      open={open}
      TransitionProps={{
        onEntered: onTransitionEntered,
      }}
      data-testid={dataTestid}
      slotProps={{
        backdrop: { 'data-testid': `${dataTestid}-backdrop` } as ModalComponentsPropsOverrides,
      }}
    >
      <StyledModalContent>
        <StyledDialogHeader>
          <StyledDialogTitle align={titleAlign} data-testid={`${dataTestid}-title`}>
            {title}
          </StyledDialogTitle>
          {hasCloseIcon && (
            <StyledCloseButton onClick={onClose} data-testid={`${dataTestid}-close-button`}>
              <Svg id="cross" />
            </StyledCloseButton>
          )}
        </StyledDialogHeader>
        {children}
        {footer && (
          <StyledFlexSpaceBetween sx={{ gap: 1.6, px: 3.2, py: 2.4, ...footerStyles }}>
            {footer}
          </StyledFlexSpaceBetween>
        )}
        {hasActions && (
          <StyledDialogActions actionsAlign={getActionsAlign()} sx={footerStyles}>
            {hasLeftBtn && (
              <Button
                variant={leftBtnVariant}
                disabled={disabledLeftBtn}
                onClick={onLeftBtnSubmit}
                sx={{ mr: 'auto' }}
                data-testid={`${dataTestid}-left-button`}
              >
                {leftBtnText}
              </Button>
            )}
            {hasThirdBtn && (
              <Button
                variant="text"
                onClick={onThirdBtnSubmit}
                sx={{ ...thirdBtnStyles }}
                data-testid={`${dataTestid}-third-button`}
              >
                {thirdBtnText}
              </Button>
            )}
            <StyledFlexTopCenter sx={{ gap: 1.6 }}>
              {hasSecondBtn && (
                <Button
                  variant={secondBtnVariant}
                  disabled={disabledSecondBtn}
                  onClick={onSecondBtnSubmit}
                  sx={{ ...secondBtnStyles }}
                  data-testid={`${dataTestid}-secondary-button`}
                >
                  {secondBtnText}
                </Button>
              )}
              {getSubmitBtn()}
            </StyledFlexTopCenter>
          </StyledDialogActions>
        )}
      </StyledModalContent>
    </StyledDialog>
  );
};
