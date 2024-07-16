import {
  StyledActivityThumbnail,
  StyledItemCount,
  StyledRoot,
} from './ActivityFlowThumbnail.styles';
import { ActivityFlowThumbnailProps } from './ActivityFlowThumbnail.types';

export const ActivityFlowThumbnail = ({
  activities = [],
  ...otherProps
}: ActivityFlowThumbnailProps) => {
  const itemsCount = activities?.length ?? 0;

  return (
    <StyledRoot {...otherProps}>
      {activities.map(
        ({ image }, i) => image && <StyledActivityThumbnail aria-hidden key={i} src={image} />,
      )}

      {itemsCount > 4 && <StyledItemCount>{itemsCount}</StyledItemCount>}
    </StyledRoot>
  );
};
