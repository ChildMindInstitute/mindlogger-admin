import { Button } from '@mui/material';

import { Svg } from 'shared/components/Svg';
import { StyledModalContent, StyledFlexTopCenter } from 'shared/styles';

import { ModalProps, SubmitBtnVariant } from './Modal.types';
import {
  StyledDialog,
  StyledDialogTitle,
  StyledCloseButton,
  StyledDialogActions,
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
      <Button
        sx={{ fontWeight: 'bold' }}
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
            {hasLeftBtn && (
              <Button
                variant={leftBtnVariant}
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
