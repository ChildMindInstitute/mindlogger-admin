import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { Svg, Tooltip } from 'shared/components';
import { StyledErrorText, theme } from 'shared/styles';
import { StyledTextBtn } from 'modules/Dashboard/features/RespondentData/RespondentData.styles';

import { useDownloadReport } from './DownloadReport.hooks';
import { StyledCircularProgress } from './DownloadReport.styles';
import { DownloadReportProps } from './DownloadReport.types';
import { CIRCULAR_PROGRESS_SIZE } from './DownloadReport.const';

export const DownloadReport = ({ id, isFlow, 'data-testid': dataTestId }: DownloadReportProps) => {
  const { t } = useTranslation('app');
  const {
    downloadReportError,
    isDownloadReportDisabled,
    downloadReportHandler,
    isDownloadReportLoading,
  } = useDownloadReport({ id, isFlow });

  return (
    <Box data-testid={dataTestId}>
      <Tooltip tooltipTitle={isDownloadReportDisabled ? t('configureServer') : ''}>
        <Box sx={{ position: 'relative' }} data-testid={`${dataTestId}-button-wrapper`}>
          <StyledTextBtn
            onClick={downloadReportHandler}
            variant="text"
            startIcon={<Svg id="export" width="18" height="18" />}
            disabled={isDownloadReportDisabled || isDownloadReportLoading}
            data-testid={`${dataTestId}-button`}
          >
            {t(isFlow ? 'downloadLatestReportCombined' : 'downloadLatestReport')}
          </StyledTextBtn>
          {isDownloadReportLoading && (
            <StyledCircularProgress
              data-testid={`${dataTestId}-loader`}
              size={CIRCULAR_PROGRESS_SIZE}
            />
          )}
        </Box>
      </Tooltip>
      {downloadReportError && (
        <StyledErrorText data-testid={`${dataTestId}-error`} sx={{ mt: theme.spacing(0.5) }}>
          {downloadReportError}
        </StyledErrorText>
      )}
    </Box>
  );
};
