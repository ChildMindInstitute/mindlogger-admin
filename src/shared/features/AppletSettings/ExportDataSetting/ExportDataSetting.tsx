import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ObjectSchema } from 'yup';

import { DataExportPopup } from 'shared/features/AppletSettings/ExportDataSetting/Popups/DataExportPopup';
import { useFeatureFlags } from 'shared/hooks';
import { FeatureFlagDefaults } from 'shared/hooks/useFeatureFlags.const';
import { applet } from 'shared/state/Applet';
import { UniqueTuple } from 'shared/types';
import { getNormalizedTimezoneDate } from 'shared/utils/dateTimezone';

import { exportDataSettingSchema } from './ExportDataSetting.schema';
import {
  ExportDataExported,
  ExportDataFormValues,
  ExportDataSettingProps,
  ExportDateType,
  SupplementaryFiles,
  SupplementaryFilesWithFeatureFlag,
} from './ExportDataSetting.types';
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

  const canExportEhrHealthData = featureFlags.enableEhrHealthData !== 'unavailable';

  const minDate = useMemo(() => new Date(appletData?.createdAt ?? ''), [appletData]);
  const getMaxDate = () => getNormalizedTimezoneDate(new Date().toString());
  const defaultValues: ExportDataFormValues = useMemo(
    () => ({
      dataExported: canExportEhrHealthData
        ? ExportDataExported.ResponsesAndEhrData
        : ExportDataExported.ResponsesOnly,
      dateType: ExportDateType.AllTime,
      fromDate: minDate,
      toDate: getMaxDate(),
      supplementaryFiles: SupplementaryFiles.reduce(
        (acc, fileType) => ({
          ...acc,
          [fileType]: fileType === 'userJourney',
        }),
        {} as Record<SupplementaryFiles, boolean>,
      ),
    }),
    [minDate, canExportEhrHealthData],
  );
  const methods = useForm<ExportDataFormValues>({
    resolver: yupResolver(exportDataSettingSchema() as ObjectSchema<ExportDataFormValues>),
    defaultValues,
    mode: 'onSubmit',
  });

  const resetDefaultValues = useCallback(() => {
    methods.reset(defaultValues);
  }, [defaultValues, methods]);

  // User journey is always supported
  const defaultSupportedSupplementaryFiles = supportedSupplementaryFiles
    ? [...new Set([...supportedSupplementaryFiles, 'userJourney'])]
    : (SupplementaryFiles as UniqueTuple<SupplementaryFiles>);

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
  let contextItemName = '';

  if (appletData) {
    if ('appletDisplayName' in appletData) {
      appletName = appletData.appletDisplayName ?? '';
    } else if ('displayName' in appletData) {
      appletName = appletData.displayName;
    }

    contextItemName = appletName;

    // Check if we have activity or flow filters and update the context item name accordingly
    if (filters?.activityId && 'activities' in appletData) {
      const activity = appletData.activities?.find(
        (activity) => activity.id === filters.activityId,
      );
      if (activity?.name) {
        contextItemName = activity.name;
      }
    } else if (filters?.flowId && 'activityFlows' in appletData) {
      const flow = appletData.activityFlows?.find((flow) => flow.id === filters.flowId);
      if (flow?.name) {
        contextItemName = flow.name;
      }
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
          contextItemName={contextItemName}
          supportedSupplementaryFiles={filteredSupportedSupplementaryFiles}
          canExportEhrHealthData={canExportEhrHealthData}
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
