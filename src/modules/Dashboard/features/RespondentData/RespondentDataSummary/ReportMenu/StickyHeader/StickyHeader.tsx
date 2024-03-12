import { useTranslation } from 'react-i18next';

import { ContentWithTooltip, DataTableItem } from 'shared/components';
import { StyledStickyHeader, theme, StyledStickyHeadline, variables } from 'shared/styles';
import {
  useRespondentLabel,
  useHeaderSticky,
  OFFSET_TO_SET_STICKY,
  OFFSET_TO_UNSET_STICKY,
} from 'shared/hooks';

import { StickyHeaderProps } from './StickyHeader.types';
import { StyledHeaderContainer } from './StickyHeader.styles';

export const StickyHeader = ({ containerRef }: StickyHeaderProps) => {
  const { t } = useTranslation();
  const respondentLabel = useRespondentLabel();
  const isHeaderSticky = useHeaderSticky(
    containerRef,
    OFFSET_TO_SET_STICKY / 2,
    OFFSET_TO_UNSET_STICKY / 2,
  );

  return (
    <StyledStickyHeader
      isSticky={isHeaderSticky}
      sx={{
        p: theme.spacing(0, 4),
      }}
    >
      <StyledHeaderContainer isSticky={isHeaderSticky}>
        <StyledStickyHeadline isSticky={isHeaderSticky} color={variables.palette.on_surface}>
          {t('activities')}
        </StyledStickyHeadline>
        <ContentWithTooltip
          value={respondentLabel}
          item={{ label: respondentLabel } as DataTableItem}
          styles={{ position: 'relative', padding: 0 }}
        />
      </StyledHeaderContainer>
    </StyledStickyHeader>
  );
};
