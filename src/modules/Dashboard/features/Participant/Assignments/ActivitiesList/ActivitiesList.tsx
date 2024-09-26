import { StyledFlexColumn, StyledTitleLarge, StyledTitleMedium, variables } from 'shared/styles';

import { ActivitiesListProps } from './ActivitiesList.types';

export const ActivitiesList = ({ count, title, children }: ActivitiesListProps) => (
  <StyledFlexColumn sx={{ gap: 0.8 }}>
    <StyledTitleLarge as="h2" sx={{ display: 'flex', alignItems: 'center', gap: 0.8, m: 0 }}>
      {title}
      <StyledTitleMedium color={variables.palette.outline}>•</StyledTitleMedium>
      {count}
    </StyledTitleLarge>
    {children}
  </StyledFlexColumn>
);
