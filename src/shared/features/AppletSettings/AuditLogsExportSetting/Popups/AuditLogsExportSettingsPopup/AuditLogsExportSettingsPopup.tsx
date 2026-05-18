import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { Modal } from 'shared/components/Modal';
import { Svg } from 'shared/components/Svg';
import {
  StyledBodyLarge,
  StyledFlexAllCenter,
  StyledFlexColumn,
  StyledFlexTopCenter,
  StyledModalWrapper,
  StyledTitleBoldMedium,
} from 'shared/styles';
import { DateRangePicker } from 'shared/components/DateRangePicker';

import { AuditLogsExportSettingsPopupProps } from './AuditLogsExportSettingsPopup.types';
import { AuditLogsExportFormValues } from '../../AuditLogsExportSetting.types';

/**
 * Audit Logs Export Popup - This is the popup that appears when the user clicks the "Export Audit Logs" button in the applet settings page.
 * This is only responsible for rendering the popup UI. It does not handle the export logic.
 * The export logic is handled in the {@link AuditLogsExportSetting} component.
 */
export const AuditLogsExportSettingsPopup = ({
  isOpen,
  onClose,
  onExport,
  minDate,
  maxDate,
  contextItemName,
  'data-testid': dataTestId,
}: AuditLogsExportSettingsPopupProps) => {
  const { t } = useTranslation('app');

  const { control } = useFormContext<AuditLogsExportFormValues>();

  return (
    <Modal
      open={isOpen}
      title={t('dataExport.auditLogs.header')}
      onClose={onClose}
      width="57.5"
      data-testid={dataTestId}
    >
      <StyledModalWrapper sx={{ pb: 0 }}>
        <form noValidate autoComplete="off">
          <StyledFlexColumn sx={{ gap: 3.2 }}>
            <StyledFlexTopCenter sx={{ gap: 0.8 }}>
              {t('dataExport.auditLogs.label')}
              <StyledTitleBoldMedium>
                {t('dataExport.auditLogs.title', { name: contextItemName })}
              </StyledTitleBoldMedium>
            </StyledFlexTopCenter>
            <StyledFlexColumn sx={{ gap: 1.6 }}>
              <StyledFlexTopCenter sx={{ gap: 0.8 }}>
                <StyledBodyLarge>{t('dataExport.auditLogs.description')}</StyledBodyLarge>
              </StyledFlexTopCenter>
            </StyledFlexColumn>
            <DateRangePicker
              maxDate={maxDate}
              minDate={minDate}
              data-testid={`${dataTestId}-date-range-picker`}
            />

            <StyledFlexAllCenter>
              <Button
                onClick={onExport}
                color="primary"
                variant="contained"
                sx={{ px: 2.4 }}
                startIcon={<Svg width="18" height="18" id="export" />}
                data-testid={`${dataTestId}-download-button`}
              >
                {t('dataExport.auditLogs.button')}
              </Button>
            </StyledFlexAllCenter>
          </StyledFlexColumn>
        </form>
      </StyledModalWrapper>
    </Modal>
  );
};
