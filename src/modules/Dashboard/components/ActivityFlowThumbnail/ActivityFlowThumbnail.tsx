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
  const images = activities.map((item) => (typeof item === 'object' ? item.image : item));

  return (
    <StyledRoot {...otherProps}>
      {images.map(
        (image, i) => image && <StyledActivityThumbnail aria-hidden key={i} src={image} />,
      )}

      {itemsCount > 4 && <StyledItemCount>{itemsCount}</StyledItemCount>}
    </StyledRoot>
  );
};
