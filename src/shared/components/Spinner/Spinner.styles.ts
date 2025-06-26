import { styled } from '@mui/material';

import { StyledFlexAllCenter } from 'shared/styles/styledComponents/Flex';
import { theme } from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

export const StyledSpinner = styled(StyledFlexAllCenter, shouldForwardProp)`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: ${({ noBackground }: { noBackground?: boolean }) =>
    noBackground ? 'transparent' : variables.palette.white_alpha50};
  z-index: ${theme.zIndex.appBar};
`;
