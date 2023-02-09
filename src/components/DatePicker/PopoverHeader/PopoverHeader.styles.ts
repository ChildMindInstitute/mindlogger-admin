import { styled } from '@mui/system';

import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';
import { StyledTitleSmall } from 'styles/styledComponents/Typography';

export const StyledHeader = styled(StyledFlexTopCenter)`
  border-bottom: ${variables.borderWidth.md} solid ${variables.palette.outline_variant};
  padding: ${theme.spacing(1.6, 2.4, 1.2)};
  align-items: flex-end;
`;

export const StyledSmalltext = styled(StyledTitleSmall)`
  margin: ${theme.spacing(0, 1.6, 0.3)};
  text-transform: lowercase;
`;
