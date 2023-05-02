import { Box } from '@mui/material';
import { styled } from '@mui/system';

import { StyledTitleMedium } from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';

export const StyledContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 54.6rem;
`;

export const StyledUploadImg = styled(Box)`
  width: 20rem;
  margin-left: ${theme.spacing(4.8)};
`;

export const StyledUploadImgs = styled(StyledContainer)`
  flex-direction: row;
  justify-content: flex-end;
`;

export const StyledTitle = styled(StyledTitleMedium)`
  display: flex;
  margin-bottom: ${theme.spacing(1.6)};

  svg {
    height: 2.4rem;
    margin-left: ${theme.spacing(0.4)};
  }
`;
