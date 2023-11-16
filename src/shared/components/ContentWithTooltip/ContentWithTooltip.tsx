import { useRef } from 'react';

import { Tooltip } from 'shared/components/Tooltip';
import { useIsTextNodeEllipsed } from 'shared/hooks/useIsTextNodeEllipsed';
import { useWindowSize } from 'shared/hooks/useWindowSize';

import { StyledCellText } from './ContentWithTooltip.styles';
import { ContentWithTooltipProps } from './ContentWithTooltip.types';

export const ContentWithTooltip = ({
  value,
  item,
  styles = {},
  tooltipByDefault,
}: ContentWithTooltipProps) => {
  const { width } = useWindowSize();
  const elementRef = useRef<HTMLDivElement>(null);
  const hasTooltip = useIsTextNodeEllipsed(elementRef, [elementRef.current, width, value]);

  return (
    <Tooltip placement="top" tooltipTitle={tooltipByDefault || hasTooltip ? value : undefined}>
      <StyledCellText sx={styles} ref={elementRef}>
        {item.label || value}
      </StyledCellText>
    </Tooltip>
  );
};
