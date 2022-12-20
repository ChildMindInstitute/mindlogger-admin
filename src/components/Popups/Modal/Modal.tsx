import { Svg } from 'components/Svg';

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
  secondBtnText,
  onSecondBtnSubmit,
  disabledSecondBtn,
}: ModalProps) => (
  <StyledDialog width={width} onClose={onClose} open={open}>
    <StyledDialogTitle align={titleAlign}>
      {title}
      <StyledCloseButton onClick={() => onClose()}>
        <Svg id="cross" />
      </StyledCloseButton>
    </StyledDialogTitle>
    {children}
    <StyledDialogActions hasSecondBtn={hasSecondBtn}>
      <StyledButton variant="text" disabled={disabledSubmit} onClick={onSubmit}>
        {buttonText}
      </StyledButton>
      {hasSecondBtn && (
        <StyledButton variant="text" disabled={disabledSecondBtn} onClick={onSecondBtnSubmit}>
          {secondBtnText}
        </StyledButton>
      )}
    </StyledDialogActions>
  </StyledDialog>
);
