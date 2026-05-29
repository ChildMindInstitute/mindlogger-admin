import { yupResolver } from '@hookform/resolvers/yup';
import { endOfDay, startOfDay } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ObjectSchema } from 'yup';

import { getNormalizedTimezoneDate } from 'shared/utils/dateTimezone';
import { DateRangePickerType } from 'shared/components/DateRangePicker';
import { applet } from 'shared/state/Applet';
import { Mixpanel, MixpanelEventType } from 'shared/utils';

import {
  AuditLogsExportFormValues,
  AuditLogsExportSettingProps,
} from './AuditLogsExportSetting.types';
import { AuditLogsExportSettingsPopup } from './Popups/AuditLogsExportSettingsPopup/AuditLogsExportSettingsPopup';
import { AuditLogsExportPopup } from './Popups/AuditLogsExportPopup/AuditLogsExportPopup';
import { auditLogsExportSettingSchema } from './AuditLogsExportSetting.schema';

export const AuditLogsExportSetting = ({
  isExportSettingsOpen,
  onExportSettingsClose,
  onExportPopupClose,
  'data-testid': dataTestId,
}: AuditLogsExportSettingProps) => {
  const [dataIsExporting, setDataIsExporting] = useState(false);
  const { result } = applet.useAppletData() ?? {};
  const appletId = result?.id;
  const minDate = useMemo(() => new Date(result?.createdAt ?? ''), [result]);
  const maxDate = useMemo(() => getNormalizedTimezoneDate(new Date().toString()), []);

  const contextItemName = result?.displayName ?? '';

  /** Sets our initial values for the audit-logs export form */
  const defaultValues: AuditLogsExportFormValues = useMemo(
    () => ({
      dateType: DateRangePickerType.AllTime,
      fromDate: startOfDay(minDate),
      toDate: endOfDay(maxDate),
    }),
    [minDate, maxDate],
  );

  const methods = useForm<AuditLogsExportFormValues>({
    resolver: yupResolver(
      auditLogsExportSettingSchema() as ObjectSchema<AuditLogsExportFormValues>,
    ),
    defaultValues,
    mode: 'onSubmit',
  });

  const resetDefaultValues = useCallback(() => {
    methods.reset(defaultValues);
  }, [defaultValues, methods]);

  useEffect(() => {
    resetDefaultValues();
  }, [resetDefaultValues]);

  return (
    <FormProvider {...methods}>
      {isExportSettingsOpen && (
        <AuditLogsExportSettingsPopup
          isOpen
          onClose={() => {
            resetDefaultValues();
            onExportSettingsClose();
          }}
          onExport={() => {
            Mixpanel.track({ action: MixpanelEventType.ExportAuditLogsDownload });
            setDataIsExporting(true);
            onExportSettingsClose();
          }}
          minDate={minDate}
          maxDate={maxDate}
          contextItemName={contextItemName}
          data-testid={`${dataTestId}-settings`}
        />
      )}
      {dataIsExporting && (
        <AuditLogsExportPopup
          popupVisible={dataIsExporting}
          setPopupVisible={setDataIsExporting}
          handlePopupClose={() => {
            resetDefaultValues();
            onExportPopupClose?.();
          }}
          data-testid={`${dataTestId}-modal`}
        />
      )}
    </FormProvider>
  );
};
