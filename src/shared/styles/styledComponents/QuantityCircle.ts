import { styled } from '@mui/system';

import { variables } from 'shared/styles/variables';

import { StyledFlexAllCenter } from './Flex';

export const StyledQuantityCircle = styled(StyledFlexAllCenter)`
  position: absolute;
  border-radius: ${variables.borderRadius.xxxl};
  background-color: ${variables.palette.semantic.error};

  p {
    line-height: 1;
  }

  &::after {
    content: '';
    position: absolute;
    width: calc(100% + 0.2rem);
    height: calc(100% + 0.2rem);
    top: -0.1rem;
    left: -0.1rem;
    border: ${variables.borderWidth.lg} solid ${variables.palette.white};
    border-radius: ${variables.borderRadius.xxxl};
  }
`;
