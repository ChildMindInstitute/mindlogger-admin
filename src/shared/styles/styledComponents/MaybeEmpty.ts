import { styled } from '@mui/material';
import { PropsWithChildren } from 'react';

import { variables } from 'shared/styles/variables';
import { shouldForwardProp } from 'shared/utils';

export const StyledMaybeEmpty = styled('span', shouldForwardProp)`
  ${({ children }: PropsWithChildren) =>
    !children &&
    `color: ${variables.palette.outline_variant};

    &::after {
      content: '--';
    }
  `}
`;
