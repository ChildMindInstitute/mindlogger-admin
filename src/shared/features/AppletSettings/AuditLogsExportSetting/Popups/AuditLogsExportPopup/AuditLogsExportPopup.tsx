import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal } from 'shared/components/Modal';
import {
  StyledBodyLarge,
  StyledLinearProgress,
  StyledModalWrapper,
  theme,
  variables,
} from 'shared/styles';
import { applet } from 'redux/modules';

import { AuditLogsExportPopupProps } from './AuditLogsExportPopupProps.types';
import { useAuditLogsExport } from './useAuditLogsExport';

/**
 * This handles the export logic for the audit logs export
 */
export const AuditLogsExportPopup = ({
  popupVisible,
  setPopupVisible,
  handlePopupClose: providedCloseHandler,
  'data-testid': dataTestId,
}: AuditLogsExportPopupProps) => {
  const { t } = useTranslation('app');

  const { result: appletData } = applet.useAppletData() ?? {};
  const appletId = appletData?.id;

  const handlePopupClose = useCallback(() => {
    setPopupVisible(false);
    providedCloseHandler?.();
  }, [providedCloseHandler, setPopupVisible]);

  const { isLoading, error, currentPage, totalPages, retry } = useAuditLogsExport(
    appletId,
    appletData?.displayName ?? 'applet',
    handlePopupClose,
  );

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
