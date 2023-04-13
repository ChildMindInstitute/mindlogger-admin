import { styled } from '@mui/material';

import { theme, variables, StyledFlexTopCenter } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

export const StyledSliderPanelHeader = styled(StyledFlexTopCenter, shouldForwardProp)`
  width: 100%;
  gap: 2.4rem;
  margin-bottom: ${theme.spacing(2.4)};

  ${({ isExpanded }: { isExpanded?: boolean }) =>
    !isExpanded &&
    `
      height: 100%;
  `}

  .MuiTypography-root {
    white-space: nowrap;
    flex-grow: ${({ isExpanded }: { isExpanded?: boolean }) => (isExpanded ? '1' : '0')};
  }

  .MuiSlider-root {
    margin-bottom: 0;
  }
`;

export const StyledImg = styled('img')`
  width: 5.6rem;
  height: 5.6rem;
  border-radius: ${variables.borderRadius.lg2};
  object-fit: cover;
`;

export const StyledSliderPanelPreviewContainer = styled(StyledFlexTopCenter)`
  width: 100%;
  gap: 2.4rem;
`;
