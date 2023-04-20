import { styled } from '@mui/system';

import { StyledFlexAllCenter } from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';

export const StyledSpinner = styled(StyledFlexAllCenter)`
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgb(255 255 255 / 50%);
  z-index: ${theme.zIndex.appBar};
`;
