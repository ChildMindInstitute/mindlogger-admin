import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { DataTableItem, FileError, ImportedFile } from 'shared/components';
import { exportTemplate } from 'shared/utils';
import { useFeatureFlags } from 'shared/hooks';

import {
  ModalType,
  Steps,
  LookupTableSetupHookProps,
  LookupTableDataItem,
  TScoreSeverity,
} from './LookupTable.types';

export const useSubscaleLookupTableSetup = ({
  errors,
  template,
  templatePrefix,
  tableData,
  schema,
}: LookupTableSetupHookProps) => {
  const [modalType, setModalType] = useState<ModalType>(
    tableData?.length ? ModalType.Edit : ModalType.Upload,
  );
  const [step, setStep] = useState<Steps>(0);
  const [data, setData] = useState<DataTableItem[]>();
  const [error, setError] = useState<JSX.Element | null>(null);

  const { featureFlags } = useFeatureFlags();

  const onFileReady = (file: ImportedFile | null) => {
    if (!file) return setData([]);

    if (!schema.isValidSync(file.data, { stripUnknown: false })) {
      setError(errors.fileCantBeParsed);

      return FileError.SchemaValidation;
    }

    const mappedData = file.data.map((item: Record<string, string | number>) => {
      Object.keys(item).forEach(
        (k) => (item[k] = typeof item[k] === 'string' ? (item[k] as string).trim() : item[k]),
      );

      const mappedItem: LookupTableDataItem = {
        ...(item as LookupTableDataItem),
        sex: (item.sex as string) || null,
        id: uuidv4(),
      };

      if (featureFlags.enableCahmiSubscaleScoring) {
        mappedItem.severity = (item.severity as TScoreSeverity) || null;
      }

      return mappedItem;
    });
    setError(null);
    setData(mappedData);
    setStep((prevState) => ++prevState as Steps);
  };

  const onDownloadTemplate = async () => {
    await exportTemplate({ data: template, fileName: `${templatePrefix}lookup_table_template` });
  };

  useEffect(() => {
    try {
      setData(tableData);
    } catch {
      console.warn('Error while table data parsing.');
    }
  }, [tableData]);

  return {
    modalType,
    step,
    data,
    error,
    setModalType,
    setError,
    setStep,
    onFileReady,
    onDownloadTemplate,
  };
};
