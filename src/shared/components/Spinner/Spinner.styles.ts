import { styled } from '@mui/system';

import { theme, StyledFlexAllCenter } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

export const StyledSpinner = styled(StyledFlexAllCenter, shouldForwardProp)`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: ${({ noBackground }: { noBackground?: boolean }) =>
    noBackground ? 'transparent' : 'rgb(255 255 255 50%)'};
  z-index: ${theme.zIndex.appBar};
`;
