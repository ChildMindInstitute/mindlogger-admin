import { Svg } from 'components';
import theme from 'styles/theme';

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
  onSubmit,
  open,
  title,
  buttonText,
  children,
  titleAlign = 'left',
  disabledSubmit = false,
  width,
  hasSecondBtn = false,
  submitBtnColor = 'primary',
  secondBtnText,
  onSecondBtnSubmit,
  disabledSecondBtn,
}: ModalProps) => (
  <StyledDialog width={width} onClose={onClose} open={open}>
    <StyledDialogTitle align={titleAlign}>
      {title}
      <StyledCloseButton onClick={onClose}>
        <Svg id="cross" />
      </StyledCloseButton>
    </StyledDialogTitle>
    {children}
    <StyledDialogActions actionsAlign={hasSecondBtn ? 'end' : 'center'}>
      {hasSecondBtn && (
        <StyledButton
          fontWeight="regular"
          variant="text"
          disabled={disabledSecondBtn}
          onClick={onSecondBtnSubmit}
          sx={{ marginLeft: theme.spacing(1.6) }}
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
  </StyledDialog>
);
