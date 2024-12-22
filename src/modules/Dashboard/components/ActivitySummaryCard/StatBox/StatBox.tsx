import {
  StyledFlexColumn,
  StyledTitleBoldMedium,
  StyledTitleSmall,
  StyledMaybeEmpty,
} from 'shared/styles';

import { StatBoxProps } from './StatBox.types';

export const StatBox = ({ label, children, sx }: StatBoxProps) => (
  <StyledFlexColumn sx={{ ...sx, gap: 0.8 }}>
    <StyledTitleSmall>{label}</StyledTitleSmall>
    <StyledTitleBoldMedium>
      <StyledMaybeEmpty>{children}</StyledMaybeEmpty>
    </StyledTitleBoldMedium>
  </StyledFlexColumn>
);
