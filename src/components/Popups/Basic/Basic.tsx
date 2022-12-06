import Modal from '@mui/material/Modal';

import { BasicProps } from './Basic.types';

export const Basic = ({ children, handleClose, open }: BasicProps) => (
  <Modal
    open={open}
    onClose={handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    {children}
  </Modal>
);
