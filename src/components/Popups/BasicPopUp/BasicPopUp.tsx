import Modal from '@mui/material/Modal';

import { BasicPopUpProps } from './BasicPopUp.types';

export const BasicPopUp = ({ children, handleClose, open }: BasicPopUpProps) => (
  <Modal
    open={open}
    onClose={handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    {children}
  </Modal>
);
