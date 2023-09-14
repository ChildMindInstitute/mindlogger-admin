import { Box, styled } from '@mui/material';

import {
  StyledBodyMedium,
  StyledClearedButton,
  StyledFlexTopCenter,
  commonEllipsisStyles,
  theme,
  variables,
} from 'shared/styles';

export const StyledRemoveButton = styled(StyledClearedButton)`
  padding: ${theme.spacing(0.5)};
  margin-left: ${theme.spacing(0.2)};
`;

export const StyledWrapper = styled(Box)`
  border: ${variables.borderWidth.md} solid ${variables.palette.outline_variant};
  border-radius: ${variables.borderRadius.lg2};
`;

export const StyledInfoSection = styled(StyledFlexTopCenter)`
  height: 8rem;
  padding: ${theme.spacing(1.4, 1.6)};
`;

export const StyledHeader = styled(StyledFlexTopCenter)`
  height: 4.8rem;
  padding: ${theme.spacing(1.4, 1.6)};
`;

export const StyledRow = styled(StyledFlexTopCenter)`
  padding: ${theme.spacing(1.2, 1.6)};
  border-top: ${variables.borderWidth.md} solid ${variables.palette.outline_variant};
`;

export const StyledBtmSection = styled(StyledFlexTopCenter)`
  height: 8rem;
  padding: ${theme.spacing(1.4, 0.3)};
  border-top: ${variables.borderWidth.md} solid ${variables.palette.outline_variant};
`;

export const StyledFileName = styled(StyledBodyMedium)`
  ${commonEllipsisStyles};
  margin-left: ${theme.spacing(1)};
  color: ${variables.palette.on_surface_variant};
  width: 27rem;
`;
