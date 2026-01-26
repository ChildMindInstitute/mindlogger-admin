import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

import { variables } from 'shared/styles/variables';

export const StyledInlineBanner = styled(Box)`
  display: flex;
  min-height: 7.2rem;
  padding: 1.2rem 1.6rem;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background: ${variables.palette.green_alpha30};
`;

export const StyledBannerContent = styled(Box)`
  display: flex;
  flex: 1 0 0;
  padding-left: 0;
  padding-right: 2.4rem;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  min-height: 1px;
  min-width: 1px;

  svg {
    color: ${variables.palette.green};
    flex-shrink: 0;
  }
`;

export const StyledBannerText = styled(Box)`
  color: ${variables.palette.on_surface};
  font-family: ${variables.font.family.body};
  font-size: 1.6rem;
  font-style: normal;
  font-weight: ${variables.font.weight.regular};
  line-height: 2.4rem;
  letter-spacing: 0.015rem;
  white-space: nowrap;
  flex-shrink: 0;
  max-width: 90rem;
`;
