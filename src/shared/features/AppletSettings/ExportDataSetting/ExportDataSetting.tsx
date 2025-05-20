import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ObjectSchema } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { DataExportPopup } from 'shared/features/AppletSettings/ExportDataSetting/Popups/DataExportPopup';
import { applet } from 'shared/state/Applet';
import { getNormalizedTimezoneDate } from 'shared/utils/dateTimezone';
import { UniqueTuple } from 'shared/types';
import { useFeatureFlags, useHasEhrHealthData } from 'shared/hooks';
import { FeatureFlagDefaults } from 'shared/hooks/useFeatureFlags.const';

import {
  ExportDataExported,
  ExportDataFormValues,
  ExportDataSettingProps,
  ExportDateType,
  SupplementaryFiles,
  SupplementaryFilesWithFeatureFlag,
} from './ExportDataSetting.types';
import { exportDataSettingSchema } from './ExportDataSetting.schema';
import { ExportSettingsPopup } from './Popups/ExportSettingsPopup/ExportSettingsPopup';

export const ExportDataSetting = ({
  isExportSettingsOpen,
  onExportSettingsClose,
  onDataExportPopupClose,
  chosenAppletData,
  isAppletSetting,
  supportedSupplementaryFiles,
  filters,
  'data-testid': dataTestId,
}: ExportDataSettingProps) => {
  const { featureFlags } = useFeatureFlags();
  const { result } = applet.useAppletData() ?? {};
  const appletData = chosenAppletData ?? result;
  const [dataIsExporting, setDataIsExporting] = useState(false);

  const appletId = appletData && ('appletId' in appletData ? appletData.appletId : appletData.id);
  const hasEhrHealthData = useHasEhrHealthData({
    appletId,
    activityId: filters?.activityId,
    flowId: filters?.flowId,
  });

  const minDate = useMemo(() => new Date(appletData?.createdAt ?? ''), [appletData]);
  const getMaxDate = () => getNormalizedTimezoneDate(new Date().toString());
  const defaultValues: ExportDataFormValues = useMemo(
    () => ({
      dataExported: hasEhrHealthData
        ? ExportDataExported.ResponsesAndEhrData
        : ExportDataExported.ResponsesOnly,
      dateType: ExportDateType.AllTime,
      fromDate: minDate,
      toDate: getMaxDate(),
      supplementaryFiles: SupplementaryFiles.reduce(
        (acc, fileType) => ({ ...acc, [fileType]: false }),
        {} as Record<SupplementaryFiles, boolean>,
      ),
    }),
    [minDate, hasEhrHealthData],
  );
  const methods = useForm<ExportDataFormValues>({
    resolver: yupResolver(exportDataSettingSchema() as ObjectSchema<ExportDataFormValues>),
    defaultValues,
    mode: 'onSubmit',
  });

  const resetDefaultValues = useCallback(() => {
    methods.reset(defaultValues);
  }, [defaultValues, methods]);

  const defaultSupportedSupplementaryFiles =
    supportedSupplementaryFiles ?? (SupplementaryFiles as UniqueTuple<SupplementaryFiles>);

  const filteredSupportedSupplementaryFiles = (
    Object.entries(SupplementaryFilesWithFeatureFlag) as unknown as [
      keyof typeof FeatureFlagDefaults | 'none',
      SupplementaryFiles[],
    ][]
  )
    .filter(([flag]) => {
      if (flag === 'none') {
        return true;
      }

      if (flag in featureFlags) {
        return featureFlags[flag];
      }

      console.warn(`No such feature flag: ${flag}`);

      return false;
    })
    .flatMap(([_, files]) => files)
    .filter((file) => (defaultSupportedSupplementaryFiles as string[]).includes(file));

  let appletName = '';
  if (appletData) {
    if ('appletDisplayName' in appletData) {
      appletName = appletData.appletDisplayName ?? '';
    } else if ('displayName' in appletData) {
      appletName = appletData.displayName;
    }
  }

  useEffect(() => {
    resetDefaultValues();
  }, [resetDefaultValues]);

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
          appletName={appletName}
          supportedSupplementaryFiles={filteredSupportedSupplementaryFiles}
          hasEhrHealthData={hasEhrHealthData}
          data-testid={`${dataTestId}-settings`}
        />
      )}
      {dataIsExporting && (
        <DataExportPopup
          isAppletSetting={isAppletSetting ?? true}
          popupVisible={dataIsExporting}
          setPopupVisible={setDataIsExporting}
          chosenAppletData={appletData ?? null}
          data-testid={`${dataTestId}-modal`}
          filters={filters}
          handlePopupClose={() => {
            resetDefaultValues();
            onDataExportPopupClose?.();
          }}
        />
      )}
    </FormProvider>
  );
};
