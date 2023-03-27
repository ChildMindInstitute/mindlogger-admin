import { styled } from '@mui/system';

import {
  theme,
  variables,
  StyledFlexColumn,
  StyledFlexTopCenter,
  StyledTitleBoldMedium,
  StyledTitleMedium,
} from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

const commonEllipsisStyles = `
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;`;

export const StyledItem = styled(StyledFlexTopCenter, shouldForwardProp)`
  position: relative;
  cursor: pointer;
  padding: ${theme.spacing(1.2, 1.2, 1.2, 2.2)};
  border-radius: ${variables.borderRadius.lg2};
  margin: ${theme.spacing(1.6, 4.4, 2.4, 3.2)};

  svg {
    fill: ${variables.palette.on_surface_variant};
  }

  &:hover {
    background-color: ${variables.palette.surface_variant_alfa8};
  }

  ${({ isActive }: { isActive: boolean }) =>
    isActive &&
    `
      background: ${variables.palette.secondary_container};

      &:hover {
        background: ${variables.palette.secondary_container};
      }
  `}

  &::before {
    content: '';
    position: absolute;
    display: block;
    height: 100%;
    left: -1.6rem;
    border-left: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  }
`;

export const StyledCol = styled(StyledFlexColumn)`
  margin-left: ${theme.spacing(1)};
  margin-right: ${theme.spacing(2.8)};
  flex: 1 1 100%;
  min-width: 0;
`;

export const StyledInactiveTitle = styled(StyledTitleMedium)`
  ${commonEllipsisStyles}
`;

export const StyledActiveTitle = styled(StyledTitleBoldMedium)`
  ${commonEllipsisStyles}
`;
