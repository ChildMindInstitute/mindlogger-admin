import { Svg } from 'components/Svg';
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
  actionsAlign = 'center',
  disabledSubmit = false,
  width,
  hasSecondBtn = false,
  secondBtnColor = 'primary',
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
    <StyledDialogActions actionsAlign={actionsAlign}>
      <StyledButton variant="text" disabled={disabledSubmit} onClick={onSubmit}>
        {buttonText}
      </StyledButton>
      {hasSecondBtn && (
        <StyledButton
          variant="text"
          disabled={disabledSecondBtn}
          onClick={onSecondBtnSubmit}
          color={secondBtnColor}
          sx={{ marginLeft: theme.spacing(1.6) }}
        >
          {secondBtnText}
        </StyledButton>
      )}
    </StyledDialogActions>
  </StyledDialog>
);
