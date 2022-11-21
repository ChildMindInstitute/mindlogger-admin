import { styled } from '@mui/system';

import { variables } from 'styles/variables';

import { StyledFlexAllCenter } from './Flex';

export const StyledQuantityCircle = styled(StyledFlexAllCenter)`
  position: absolute;
  border-radius: 100%;
  background-color: ${variables.palette.semantic.error};
`;
