import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ObjectSchema } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { DataExportPopup } from 'shared/features/AppletSettings/ExportDataSetting/Popups/DataExportPopup';
import { applet } from 'shared/state/Applet';
import { getNormalizedTimezoneDate } from 'shared/utils/dateTimezone';
import { UniqueTuple } from 'shared/types';
import { useFeatureFlags } from 'shared/hooks';

import {
  EMAExtraFiles,
  ExportDataFormValues,
  ExportDataSettingProps,
  ExportDateType,
  SupplementaryFiles,
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
  supportedSupplementaryFiles,
}: ExportDataSettingProps) => {
  const { featureFlags } = useFeatureFlags();
  const { result } = applet.useAppletData() ?? {};
  const appletData = chosenAppletData ?? result;
  const [dataIsExporting, setDataIsExporting] = useState(false);

  const minDate = new Date(appletData?.createdAt ?? '');
  const getMaxDate = () => getNormalizedTimezoneDate(new Date().toString());
  const defaultValues: ExportDataFormValues = {
    dateType: ExportDateType.AllTime,
    fromDate: minDate,
    toDate: getMaxDate(),
    supplementaryFiles: SupplementaryFiles.reduce(
      (acc, fileType) => ({ ...acc, [fileType]: false }),
      {} as Record<SupplementaryFiles, boolean>,
    ),
  };
  const methods = useForm<ExportDataFormValues>({
    resolver: yupResolver(exportDataSettingSchema() as ObjectSchema<ExportDataFormValues>),
    defaultValues,
    mode: 'onSubmit',
  });

  const resetDefaultValues = () => {
    methods.reset(defaultValues);
  };

  const filteredSupportedSupplementaryFiles = (
    supportedSupplementaryFiles ?? (SupplementaryFiles as UniqueTuple<SupplementaryFiles>)
  ).filter((fileType) => {
    if (EMAExtraFiles.includes(fileType)) {
      return featureFlags.enableEmaExtraFiles;
    }

    return true;
  });

  return (
    <FormProvider {...methods}>
      {isExportSettingsOpen && (
        <ExportSettingsPopup
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
          getMaxDate={getMaxDate}
          supportedSupplementaryFiles={filteredSupportedSupplementaryFiles}
        />
      )}
      {dataIsExporting && (
        <DataExportPopup
          isAppletSetting={isAppletSetting ?? true}
          popupVisible={dataIsExporting}
          setPopupVisible={setDataIsExporting}
          chosenAppletData={appletData ?? null}
          data-testid={DATA_TESTID_EXPORT_DATA_EXPORT_POPUP}
          handlePopupClose={() => {
            resetDefaultValues();
            onDataExportPopupClose?.();
          }}
        />
      )}
    </FormProvider>
  );
};
