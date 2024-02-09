import { useEffect, useState } from 'react';

import { DataTableItem, FileError, ImportedFile } from 'shared/components';
import { exportTemplate } from 'shared/utils';

import { ModalType, Steps, LookupTableSetupHookProps } from './LookupTable.types';
import { processImportedData } from './LookupTable.utils';

export const useSubscaleLookupTableSetup = ({
  errors,
  template,
  templatePrefix,
  tableData,
  schema,
}: LookupTableSetupHookProps) => {
  const [modalType, setModalType] = useState<ModalType>(tableData?.length ? ModalType.Edit : ModalType.Upload);
  const [step, setStep] = useState<Steps>(0);
  const [data, setData] = useState<DataTableItem[]>();
  const [error, setError] = useState<JSX.Element | null>(null);

  const onFileReady = (file: ImportedFile | null) => {
    if (!file) return setData([]);

    if (!schema.isValidSync(file.data, { stripUnknown: false })) {
      setError(errors.fileCantBeParsed);

      return FileError.SchemaValidation;
    }

    const mappedData = file.data.map(processImportedData);
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
