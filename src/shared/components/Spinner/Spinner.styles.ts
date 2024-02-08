import { styled } from '@mui/material';

import { StyledFlexAllCenter } from 'shared/styles/styledComponents/Flex';
import { theme } from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

export const StyledSpinner = styled(StyledFlexAllCenter, shouldForwardProp)`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: ${({ noBackground }: { noBackground?: boolean }) =>
    noBackground ? 'transparent' : variables.palette.white_alfa50};
  z-index: ${theme.zIndex.appBar};
`;
