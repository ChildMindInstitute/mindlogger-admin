import { styled } from '@mui/material';

import { variables } from 'shared/styles/variables';

export const StyledToast = styled('div')`
  position: fixed;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${variables.palette.neutral10};
  color: ${variables.palette.white};
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 1.4rem;
  font-weight: ${variables.font.weight.regular};
  z-index: 9999;
  box-shadow:
    0 3px 5px -1px ${variables.palette.black}33,
    0 6px 10px 0 ${variables.palette.black}24,
    0 1px 18px 0 ${variables.palette.black}1F;
`;
