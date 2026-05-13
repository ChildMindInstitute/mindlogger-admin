import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal } from 'shared/components/Modal';
import {
  StyledBodyLarge,
  StyledLinearProgress,
  StyledModalWrapper,
  theme,
  variables,
} from 'shared/styles';

import { AuditLogsExportPopupProps } from './AuditLogsExportPopupProps.types';
import { exportAuditLogsCsv } from './AuditLogsExportPopup.utils';
import { useAuditLogsExport } from './useAuditLogsExport';
import { applet } from 'redux/modules';

/**
  * This handles the export logic for the audit logs export
 */
export const AuditLogsExportPopup = ({
  popupVisible,
  setPopupVisible,
  handlePopupClose,
  'data-testid': dataTestId,
}: AuditLogsExportPopupProps) => {
  const { t } = useTranslation('app');

  const { result: appletData } = applet.useAppletData() ?? {};
  const appletId = appletData?.id
  const { isLoading, error, allAuditEvents, currentPage, totalPages, retry } =
    useAuditLogsExport(appletId);

  useEffect(() => {
    if (!allAuditEvents || !appletId) return;

    // Once all audit events are fetched, export them as a CSV file and close the popup.
    const doExport = async () => {
      await exportAuditLogsCsv(allAuditEvents, appletData?.displayName ?? 'applet');
      handlePopupClose();
    };

    doExport();
  }, [allAuditEvents, setPopupVisible, handlePopupClose]);

  const exportingModal = (
    <Modal
      open={popupVisible}
      onClose={handlePopupClose}
      title={t('dataExport.auditLogs.header')}
      buttonText=""
      data-testid={dataTestId}
    >
      <StyledModalWrapper>
        <StyledBodyLarge sx={{ margin: theme.spacing(-2.4, 0, 2.4) }}>
          {t('waitForRespondentDataDownload')}
          {totalPages > 1 && (
            <>
              <br />
              <br />
              {t('dataProcessing', {
                percentages: Math.floor((currentPage / totalPages) * 100),
              })}
            </>
          )}
        </StyledBodyLarge>
        <StyledLinearProgress />
      </StyledModalWrapper>
    </Modal>
  );

  const exportErrorModal = (
    <Modal
      open={popupVisible}
      onClose={handlePopupClose}
      onSubmit={retry}
      title={t('dataExport.auditLogs.header')}
      buttonText={t('retry')}
      hasSecondBtn
      submitBtnColor="error"
      secondBtnText={t('cancel')}
      onSecondBtnSubmit={handlePopupClose}
      data-testid={`${dataTestId}-error`}
    >
      <StyledModalWrapper>
        <StyledBodyLarge sx={{ color: variables.palette.error }}>
          {t('exportFailed')}
        </StyledBodyLarge>
      </StyledModalWrapper>
    </Modal>
  );

  return (
    <>
      {error && exportErrorModal}
      {isLoading && exportingModal}
    </>
  );
};
