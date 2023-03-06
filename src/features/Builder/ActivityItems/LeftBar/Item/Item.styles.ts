import { styled } from '@mui/system';

import theme from 'styles/theme';
import {
  StyledClearedButton,
  StyledFlexColumn,
  StyledFlexTopCenter,
  StyledTitleBoldMedium,
  StyledTitleMedium,
} from 'styles/styledComponents';
import { variables } from 'styles/variables';

const commonStyles = `
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;`;

export const StyledItem = styled(StyledFlexTopCenter)`
  cursor: pointer;
  padding: ${theme.spacing(1.2, 1.2, 1.2, 2.2)};
  border-radius: ${variables.borderRadius.lg2};
  margin-bottom: ${theme.spacing(1.6)};

  .actions {
    display: none;
  }

  .dots {
    display: flex;
    align-items: center;
    width: 4rem;
    height: 4rem;
    min-width: 4rem;
  }

  &:hover {
    background-color: rgba(222, 227, 235, 0.08);

    .actions {
      display: ${({ hidden }: { hidden: boolean }) => (hidden ? 'none' : 'flex')};
    }

    .dots {
      display: ${({ hidden }) => (hidden ? 'flex' : 'none')};
    }
  }
`;

export const StyledCol = styled(StyledFlexColumn)`
  margin-left: ${theme.spacing(1)};
  margin-right: ${theme.spacing(2.8)};
  flex: 1 1 100%;
  min-width: 0;
`;

export const StyledDsc = styled(StyledTitleMedium)`
  ${commonStyles}
`;

export const StyledTitle = styled(StyledTitleBoldMedium)`
  ${commonStyles}
`;

export const StyledActionButton = styled(StyledClearedButton)`
  width: 4rem;
  height: 4rem;
  min-width: 4rem;
  border-radius: ${variables.borderRadius.half};
  margin-right: ${theme.spacing(1.9)};

  &:hover {
    background: ${variables.palette.secondary_container};

    svg {
      fill: ${variables.palette.primary};
    }
  }
`;
