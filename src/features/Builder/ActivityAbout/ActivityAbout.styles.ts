import { Box } from '@mui/material';
import { styled } from '@mui/system';

import { Svg } from 'components';
import { StyledTitleMedium } from 'styles/styledComponents';
import theme from 'styles/theme';
import { variables } from 'styles/variables';

const column = `
  display: flex;
  flex-direction: column;
`;

export const StyledForm = styled('form')`
  ${column}
`;

export const StyledContainer = styled(Box)`
  ${column}
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

export const StyledSvg = styled(Svg)`
  fill: ${variables.palette.outline};
  position: absolute;
  margin-left: ${theme.spacing(1)};
`;

export const StyledTitle = styled(StyledTitleMedium)`
  display: flex;
  margin-bottom: ${theme.spacing(1.6)};

  svg {
    height: 2.4rem;
    margin-left: ${theme.spacing(0.4)};
  }
`;

export const StyledSettings = styled(Box)`
  ${column}
`;
