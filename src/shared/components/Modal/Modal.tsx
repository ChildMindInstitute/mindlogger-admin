import { Svg } from 'shared/components/Svg';
import theme from 'shared/styles/theme';

import { ModalProps } from './Modal.types';
import {
  StyledDialog,
  StyledDialogTitle,
  StyledCloseButton,
  StyledDialogActions,
  StyledButton,
} from './Modal.styles';

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
  hasActions = true,
}: ModalProps) => {
  const getActionsAlign = () => {
    if (hasThirdBtn) {
      return 'space-between';
    } else {
      return hasSecondBtn ? 'end' : 'center';
    }
  };

  return (
    <StyledDialog sx={sxProps} width={width} height={height} onClose={onClose} open={open}>
      <StyledDialogTitle align={titleAlign}>
        {title}
        <StyledCloseButton onClick={onClose}>
          <Svg id="cross" />
        </StyledCloseButton>
      </StyledDialogTitle>
      {children}
      {hasActions && (
        <StyledDialogActions actionsAlign={getActionsAlign()} sx={{ p: 0 }}>
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
          <StyledDialogActions>
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
            {buttonText && (
              <StyledButton
                variant="text"
                disabled={disabledSubmit}
                onClick={onSubmit}
                color={submitBtnColor}
              >
                {buttonText}
              </StyledButton>
            )}
          </StyledDialogActions>
        </StyledDialogActions>
      )}
    </StyledDialog>
  );
};
