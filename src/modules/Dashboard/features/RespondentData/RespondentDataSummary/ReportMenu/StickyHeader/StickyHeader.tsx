import { ContentWithTooltip, DataTableItem } from 'shared/components';
import { StyledStickyHeader, theme } from 'shared/styles';
import {
  useRespondentLabel,
  useHeaderSticky,
  OFFSET_TO_SET_STICKY,
  OFFSET_TO_UNSET_STICKY,
} from 'shared/hooks';

import { StickyHeaderProps } from './StickyHeader.types';
import { StyledHeaderContainer } from './StickyHeader.styles';

export const StickyHeader = ({
  containerRef,
  'data-testid': dataTestid = '',
}: StickyHeaderProps) => {
  const respondentLabel = useRespondentLabel({ isSubject: true });
  const isHeaderSticky = useHeaderSticky(
    containerRef,
    OFFSET_TO_SET_STICKY / 2,
    OFFSET_TO_UNSET_STICKY / 2,
  );
  const contentTestId = `sticky-header-content-${dataTestid}`;

  return (
    <StyledStickyHeader
      isSticky={isHeaderSticky}
      sx={{
        p: theme.spacing(0, 4),
      }}
    >
      <StyledHeaderContainer>
        <ContentWithTooltip
          value={respondentLabel}
          item={{ label: respondentLabel } as DataTableItem}
          styles={{ position: 'relative', padding: 0 }}
          data-testid={contentTestId}
        />
      </StyledHeaderContainer>
    </StyledStickyHeader>
  );
};
