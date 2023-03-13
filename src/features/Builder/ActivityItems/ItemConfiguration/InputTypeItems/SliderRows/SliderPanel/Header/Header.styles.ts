import { styled } from '@mui/material';

import { StyledFlexTopCenter } from 'styles/styledComponents';
import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { shouldForwardProp } from 'utils/shouldForwardProp';

export const StyledSliderPanelHeader = styled(StyledFlexTopCenter, shouldForwardProp)`
  width: 100%;
  gap: 2.4rem;
  margin-bottom: ${theme.spacing(2.4)};

  ${({ isExpanded }: { isExpanded?: boolean }) =>
    !isExpanded &&
    `
  height: 100%;`}

  .MuiTypography-root {
    white-space: nowrap;
    flex-grow: ${({ isExpanded }: { isExpanded?: boolean }) => (isExpanded ? '1' : '0')};
  }
`;

export const StyledImg = styled('img')`
  width: 5.6rem;
  height: 5.6rem;
  border-radius: ${variables.borderRadius.lg2};
  object-fit: cover;
`;
