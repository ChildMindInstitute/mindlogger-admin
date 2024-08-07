import { StyledFlexColumn, StyledTitleBoldMedium, StyledTitleSmall } from 'shared/styles';
import { StyledMaybeEmpty } from 'shared/styles/styledComponents/MaybeEmpty';

import { StatBoxProps } from './StatBox.types';

export const StatBox = ({ label, children, sx }: StatBoxProps) => (
  <StyledFlexColumn sx={{ ...sx, gap: 0.8 }}>
    <StyledTitleSmall>{label}</StyledTitleSmall>
    <StyledTitleBoldMedium>
      <StyledMaybeEmpty>{children}</StyledMaybeEmpty>
    </StyledTitleBoldMedium>
  </StyledFlexColumn>
);
