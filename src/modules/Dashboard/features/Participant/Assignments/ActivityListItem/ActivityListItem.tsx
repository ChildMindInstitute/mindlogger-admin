import {
  StyledActivityThumbnailContainer,
  StyledActivityThumbnailImg,
  StyledFlexTopCenter,
} from 'shared/styles';
import { ActivityFlowThumbnail, ActivityStatusChip } from 'modules/Dashboard/components';
import { FlowChip } from 'shared/components';

import { ActivityListItemProps } from './ActivityListItem.types';
import { StyledActivityListItem, StyledActivityName } from './ActivityListItem.styles';

export const ActivityListItem = ({
  activityOrFlow: { isFlow, images, name, status },
  onClick,
  children,
}: ActivityListItemProps) => (
  <StyledActivityListItem as="button" onClick={onClick}>
    <StyledFlexTopCenter sx={{ gap: 0.8 }}>
      <StyledActivityThumbnailContainer sx={{ width: '5.6rem', height: '5.6rem', mr: 0.8 }}>
        {isFlow ? (
          <ActivityFlowThumbnail activities={images} />
        ) : (
          images[0] && <StyledActivityThumbnailImg src={images[0]} alt={name} />
        )}
      </StyledActivityThumbnailContainer>
      <StyledActivityName>{name}</StyledActivityName>
      {isFlow && <FlowChip size="small" />}
      <ActivityStatusChip status={status} />
    </StyledFlexTopCenter>

    <StyledFlexTopCenter sx={{ gap: 0.8, ml: 'auto' }}>{children}</StyledFlexTopCenter>
  </StyledActivityListItem>
);
