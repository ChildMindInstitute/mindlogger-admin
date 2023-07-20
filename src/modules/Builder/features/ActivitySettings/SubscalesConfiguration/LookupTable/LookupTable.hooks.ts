import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { DataTableItem, ImportedFile } from 'shared/components';
import { exportTemplate } from 'shared/utils';

import { ModalType, Steps, LookupTableSetupHookProps } from './LookupTable.types';
import { validateLookupTable } from './LookupTable.utils';

export const useSubscaleLookupTableSetup = ({
  errors,
  template,
  templatePrefix,
  tableData,
}: LookupTableSetupHookProps) => {
  const [modalType, setModalType] = useState<ModalType>(
    tableData?.length ? ModalType.Edit : ModalType.Upload,
  );
  const [step, setStep] = useState<Steps>(0);
  const [data, setData] = useState<DataTableItem[]>();
  const [error, setError] = useState<JSX.Element | null>(null);

  const onFileReady = (file: ImportedFile | null) => {
    const mappedData = (file?.data ?? []).map((item) => ({
      ...item,
      sex: (item.sex as string) || null,
      id: uuidv4(),
    }));
    setData(mappedData);

    if (!validateLookupTable(mappedData)) return setError(errors.fileCantBeParsed);

    setError(null);

    if (file) {
      setStep((prevState) => ++prevState as Steps);
    }
  };

  const onDownloadTemplate = () => {
    exportTemplate(template, `${templatePrefix}lookup_table_template`);
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
