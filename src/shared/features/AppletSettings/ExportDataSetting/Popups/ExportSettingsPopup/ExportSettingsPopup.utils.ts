import i18n from 'i18n';

import { ExportDataExported } from '../../ExportDataSetting.types';

const { t } = i18n;

export const getDataExportedOptions = () => [
  {
    value: ExportDataExported.ResponsesOnly,
    labelKey: t('dataExport.dataExported.responsesOnly'),
  },
  {
    value: ExportDataExported.ResponsesAndEhrData,
    labelKey: t('dataExport.dataExported.responsesAndEhrData'),
  },
];
