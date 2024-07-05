import { useParams } from 'react-router-dom';
import download from 'downloadjs';

import { useAsync } from 'shared/hooks/useAsync';
import { getLatestReportApi } from 'modules/Dashboard/api';
import { getErrorMessage } from 'shared/utils/errors';
import { applet } from 'shared/state/Applet';

import { getLatestReportUrl } from './DownloadReport.utils';
import {
  LATEST_REPORT_DEFAULT_NAME,
  LATEST_REPORT_REGEX,
  LATEST_REPORT_TYPE,
} from './DownloadReport.const';
import { DownloadReportProps } from './DownloadReport.types';

export const useDownloadReport = ({ id, isFlow }: Omit<DownloadReportProps, 'data-testid'>) => {
  const { appletId, respondentId } = useParams();
  const { result: appletData } = applet.useAppletData() ?? {};

  const currentActivity = isFlow
    ? null
    : appletData?.activities.find((activity) => activity.id === id);
  const currentFlow = isFlow ? appletData?.activityFlows?.find((flow) => flow.id === id) : null;
  const hasReportPublicKey = !!appletData?.reportPublicKey;
  const canGenerateReport = isFlow
    ? !!(
        currentFlow?.isSingleReport &&
        appletData?.activities.some((activity) => activity?.scoresAndReports?.generateReport)
      )
    : !!currentActivity?.scoresAndReports?.generateReport;
  const isDownloadReportDisabled = !(hasReportPublicKey && canGenerateReport);

  const {
    execute: getReport,
    isLoading: isDownloadReportLoading,
    error: reportError,
  } = useAsync(getLatestReportApi, (response) => {
    const data = response?.data;
    const headers = response?.headers;

    if (data) {
      const contentDisposition = headers?.['content-disposition'];
      const fileName =
        (contentDisposition && LATEST_REPORT_REGEX.exec(contentDisposition)?.groups?.filename) ??
        LATEST_REPORT_DEFAULT_NAME;
      const base64Str = Buffer.from(data).toString('base64');
      const linkSource = getLatestReportUrl(base64Str);

      download(linkSource, fileName, LATEST_REPORT_TYPE);
    }
  });

  const downloadReportHandler = async () => {
    if (!appletId || !respondentId) return;

    getReport({
      appletId,
      ...(isFlow ? { flowId: id } : { activityId: id }),
      subjectId: respondentId,
    });
  };

  return {
    downloadReportError: reportError ? getErrorMessage(reportError) : null,
    isDownloadReportDisabled,
    downloadReportHandler,
    isDownloadReportLoading,
  };
};
