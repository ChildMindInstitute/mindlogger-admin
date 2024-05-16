import { useHeaderSticky } from 'shared/hooks';
import { StyledStickyHeadline, variables } from 'shared/styles';

import { StyledHeader } from './ReportHeader.styles';
import { ReportHeaderProps } from './ReportHeader.types';
import { DownloadReport } from '../DownloadReport';

export const ReportHeader = ({
  containerRef,
  selectedEntity,
  'data-testid': dataTestId,
}: ReportHeaderProps) => {
  const isHeaderSticky = useHeaderSticky(containerRef);
  const { name = '', id = '', isFlow = false } = selectedEntity ?? {};

  return (
    <StyledHeader data-testid={dataTestId} isSticky={isHeaderSticky}>
      {name && (
        <StyledStickyHeadline isSticky={isHeaderSticky} color={variables.palette.on_surface}>
          {name}
        </StyledStickyHeadline>
      )}
      {/*TODO: implement Download Latest Report (Combined) for Flow after back-end is ready*/}
      <DownloadReport id={id} isFlow={isFlow} data-testid={`${dataTestId}-download-report`} />
    </StyledHeader>
  );
};
