import {
  StyledActivityThumbnail,
  StyledItemCount,
  StyledRoot,
} from './FlowSummaryThumbnail.styles';
import { FlowSummaryThumbnailProps } from './FlowSummaryThumbnail.types';

export const FlowSummaryThumbnail = ({
  activities = [],
  ...otherProps
}: FlowSummaryThumbnailProps) => {
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
