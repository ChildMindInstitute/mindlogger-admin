import { styled } from '@mui/material';

import { StyledFlexAllCenter, StyledFlexTopCenter } from 'styles/styledComponents/Flex';
import { StyledLabelSmall } from 'styles/styledComponents/Typography';
import theme from 'styles/theme';
import { variables } from 'styles/variables';

export const StyledFolderIcon = styled(StyledFlexAllCenter)`
  height: 3.2rem;
  width: 3.2rem;
  margin-right: ${theme.spacing(1.2)};
`;

export const StyledFolderName = styled(StyledFlexTopCenter)`
  flex-wrap: wrap;
`;

export const StyledCountApplets = styled(StyledLabelSmall)`
  color: ${variables.palette.outline};
  margin-left: ${theme.spacing(0.4)};
`;
