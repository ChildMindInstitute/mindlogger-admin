import { Svg } from 'shared/components';
import {
  StyledFlexTopCenter,
  StyledMaybeEmpty,
  StyledTitleBoldMedium,
  StyledTitleMedium,
} from 'shared/styles';

import { ActivityListItemCounterProps } from './ActivityListItemCounter.types';

export const ActivityListItemCounter = ({
  icon,
  label,
  count,
  isLoading,
}: ActivityListItemCounterProps) => (
  <StyledFlexTopCenter sx={{ gap: 0.8, width: '18.4rem' }}>
    <Svg id={icon} width="18" height="18" fill="currentColor" />
    <StyledTitleMedium>{label}</StyledTitleMedium>
    <StyledTitleBoldMedium>
      <StyledMaybeEmpty isLoading={isLoading}>{count}</StyledMaybeEmpty>
    </StyledTitleBoldMedium>
  </StyledFlexTopCenter>
);
