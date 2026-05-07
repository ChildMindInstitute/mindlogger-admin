import { yupResolver } from '@hookform/resolvers/yup';
import { endOfDay, startOfDay } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ObjectSchema } from 'yup';

import { DataExportPopup } from 'shared/features/AppletSettings/ExportDataSetting/Popups/DataExportPopup';
import { getNormalizedTimezoneDate } from 'shared/utils/dateTimezone';
import { DateRangePickerType } from 'shared/components/DateRangePicker';
import { applet } from 'shared/state/Applet';

import {
  AuditLogsExportFormValues,
  AuditLogsExportSettingProps,
} from './AuditLogsExportSetting.types';
import { AuditLogsExportPopup } from './AuditLogsExportPopup/AuditLogsExportPopup';
import { auditLogsExportSettingSchema } from './AuditLogsExportSetting.schema';

export const AuditLogsExportSetting = ({
  isExportSettingsOpen,
  onExportSettingsClose,
  onExportPopupClose,
  chosenAppletData,
  'data-testid': dataTestId,
}: AuditLogsExportSettingProps) => {
  const [dataIsExporting, setDataIsExporting] = useState(false);
  const { result } = applet.useAppletData() ?? {};
  const appletData = chosenAppletData ?? result;

  const minDate = useMemo(() => new Date(appletData?.createdAt ?? ''), [appletData]);
  const maxDate = useMemo(() => getNormalizedTimezoneDate(new Date().toString()), []);

  let appletName = '';
  let contextItemName = '';

  if (appletData) {
    if ('appletDisplayName' in appletData) {
      appletName = appletData.appletDisplayName ?? '';
    } else if ('displayName' in appletData) {
      appletName = appletData.displayName;
    }

    contextItemName = appletName;
  }

  const defaultValues: AuditLogsExportFormValues = useMemo(
    () => ({
      dateType: DateRangePickerType.AllTime,
      fromDate: startOfDay(minDate),
      toDate: endOfDay(maxDate),
      supplementaryFiles: { tsv: false },
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
        <AuditLogsExportPopup
          contextItemName={contextItemName}
          isOpen
          onClose={() => {
            resetDefaultValues();
            onExportSettingsClose();
          }}
          onExport={() => {
            setDataIsExporting(true);
            onExportSettingsClose();
          }}
          minDate={minDate}
          maxDate={maxDate}
          data-testid={`${dataTestId}-settings`}
        />
      )}
      {dataIsExporting && (
        <DataExportPopup
          isAppletSetting={false}
          popupVisible={dataIsExporting}
          setPopupVisible={setDataIsExporting}
          chosenAppletData={null}
          data-testid={`${dataTestId}-modal`}
          handlePopupClose={() => {
            resetDefaultValues();
            onExportPopupClose?.();
          }}
        />
      )}
    </FormProvider>
  );
};
