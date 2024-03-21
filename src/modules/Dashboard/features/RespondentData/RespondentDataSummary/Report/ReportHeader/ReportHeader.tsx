import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { Svg, Tooltip } from 'shared/components';
import { useHeaderSticky } from 'shared/hooks';
import { StyledErrorText, StyledStickyHeadline, theme, variables } from 'shared/styles';

import { StyledTextBtn } from '../../../RespondentData.styles';
import { StyledHeader } from './ReportHeader.styles';
import { ReportHeaderProps } from './ReportHeader.types';

export const ReportHeader = ({
  containerRef,
  onButtonClick,
  activityName,
  isButtonDisabled,
  error,
}: ReportHeaderProps) => {
  const { t } = useTranslation('app');
  const isHeaderSticky = useHeaderSticky(containerRef);

  return (
    <StyledHeader isSticky={isHeaderSticky}>
      <StyledStickyHeadline isSticky={isHeaderSticky} color={variables.palette.on_surface}>
        {activityName}
      </StyledStickyHeadline>
      <Box>
        <Tooltip tooltipTitle={t('configureServer')}>
          <span>
            <StyledTextBtn
              onClick={onButtonClick}
              variant="text"
              startIcon={<Svg id="export" width="18" height="18" />}
              disabled={isButtonDisabled}
              data-testid="respondents-summary-download-report"
            >
              {t('downloadLatestReport')}
            </StyledTextBtn>
          </span>
        </Tooltip>
        {error && <StyledErrorText sx={{ mt: theme.spacing(0.8) }}>{error}</StyledErrorText>}
      </Box>
    </StyledHeader>
  );
};
