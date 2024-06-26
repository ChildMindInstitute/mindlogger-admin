import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ObjectSchema } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { DataExportPopup } from 'modules/Dashboard/features/Respondents/Popups/DataExportPopup';
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
}: ExportDataSettingProps) => {
  const { result: appletData } = applet.useAppletData() ?? {};
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
          isAppletSetting
          popupVisible={dataIsExporting}
          setPopupVisible={setDataIsExporting}
          chosenAppletData={appletData ?? null}
          data-testid={DATA_TESTID_EXPORT_DATA_EXPORT_POPUP}
        />
      )}
    </FormProvider>
  );
};
