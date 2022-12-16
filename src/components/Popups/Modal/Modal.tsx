import { Svg } from 'components/Svg';

import { ModalProps } from './Modal.types';
import {
  StyledDialog,
  StyledDialogTitle,
  StyledCloseButton,
  StyledDialogActions,
  StyledOkButton,
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
}: ModalProps) => (
  <StyledDialog onClose={onClose} open={open}>
    <StyledDialogTitle align={titleAlign}>
      {title}
      <StyledCloseButton onClick={() => onClose()}>
        <Svg width={24} height={24} id="cross" />
      </StyledCloseButton>
    </StyledDialogTitle>
    {children}
    <StyledDialogActions>
      <StyledOkButton variant="text" disabled={disabledSubmit} onClick={onSubmit}>
        {buttonText}
      </StyledOkButton>
    </StyledDialogActions>
  </StyledDialog>
);
