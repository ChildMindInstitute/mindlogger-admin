import { styled } from '@mui/system';

import { theme, StyledFlexAllCenter, variables } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

export const StyledSpinner = styled(StyledFlexAllCenter, shouldForwardProp)`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: ${({ noBackground }: { noBackground?: boolean }) =>
    noBackground ? 'transparent' : variables.palette.white_alfa50};
  z-index: ${theme.zIndex.appBar};
`;
