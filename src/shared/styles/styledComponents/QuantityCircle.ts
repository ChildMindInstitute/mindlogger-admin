import { styled } from '@mui/material';

import { variables } from 'shared/styles/variables';

import { StyledFlexAllCenter } from './Flex';

export const StyledQuantityCircle = styled(StyledFlexAllCenter)`
  position: absolute;
  border-radius: ${variables.borderRadius.xxxl};
  background-color: ${variables.palette.semantic.error};
  outline: ${variables.borderWidth.lg} solid ${variables.palette.white};

  p {
    line-height: 1;
  }
`;
