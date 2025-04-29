import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ObjectSchema } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { DataExportPopup } from 'shared/features/AppletSettings/ExportDataSetting/Popups/DataExportPopup';
import { applet } from 'shared/state/Applet';
import { getNormalizedTimezoneDate } from 'shared/utils/dateTimezone';

import {
  ExportDataFormValues,
  ExportDataSettingProps,
  ExportDateType,
} from './ExportDataSetting.types';
import { DATA_TESTID_EXPORT_DATA_EXPORT_POPUP } from './ExportDataSetting.const';
import { exportDataSettingSchema } from './ExportDataSetting.schema';
import { ExportSettingsPopup } from './Popups/ExportSettingsPopup/ExportSettingsPopup';

export const ExportDataSetting = ({
  isExportSettingsOpen,
  onExportSettingsClose,
  onDataExportPopupClose,
  chosenAppletData,
  isAppletSetting,
}: ExportDataSettingProps) => {
  const { result } = applet.useAppletData() ?? {};
  const appletData = chosenAppletData ?? result;
  const [dataIsExporting, setDataIsExporting] = useState(false);

  const minDate = new Date(appletData?.createdAt ?? '');
  const getMaxDate = () => getNormalizedTimezoneDate(new Date().toString());
  const methods = useForm<ExportDataFormValues>({
    resolver: yupResolver(exportDataSettingSchema() as ObjectSchema<ExportDataFormValues>),
    defaultValues: {
      dateType: ExportDateType.AllTime,
      fromDate: minDate,
      toDate: getMaxDate(),
    },
    mode: 'onSubmit',
  });

  return (
    <FormProvider {...methods}>
      {isExportSettingsOpen && (
        <ExportSettingsPopup
          isOpen
          onClose={onExportSettingsClose}
          onExport={() => {
            setDataIsExporting(true);
            onExportSettingsClose();
          }}
          minDate={minDate}
          getMaxDate={getMaxDate}
        />
      )}
      {dataIsExporting && (
        <DataExportPopup
          isAppletSetting={isAppletSetting ?? true}
          popupVisible={dataIsExporting}
          setPopupVisible={setDataIsExporting}
          chosenAppletData={appletData ?? null}
          data-testid={DATA_TESTID_EXPORT_DATA_EXPORT_POPUP}
          handlePopupClose={onDataExportPopupClose}
        />
      )}
    </FormProvider>
  );
};
