import { styled } from '@mui/system';

import { StyledFlexAllCenter } from 'styles/styledComponents';
import theme from 'styles/theme';

export const StyledSpinner = styled(StyledFlexAllCenter)`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgb(255 255 255 / 50%);
  z-index: ${theme.zIndex.appBar};
`;
