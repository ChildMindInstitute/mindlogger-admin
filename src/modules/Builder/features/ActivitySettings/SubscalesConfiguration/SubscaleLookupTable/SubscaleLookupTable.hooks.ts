import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { DataTableItem, ImportedFile } from 'shared/components';
import { exportToCsv } from 'shared/utils';

import { ModalType, Steps, SubscaleLookupTableSetupHookProps } from './SubscaleLookupTable.types';
import { defaultTemplate } from './SubscaleLookupTable.const';

export const useSubscaleLookupTableSetup = ({ tableData }: SubscaleLookupTableSetupHookProps) => {
  const [modalType, setModalType] = useState<ModalType>(
    tableData ? ModalType.Edit : ModalType.Upload,
  );
  const [step, setStep] = useState<Steps>(0);
  const [data, setData] = useState<DataTableItem[]>();
  const [error, setError] = useState<JSX.Element | null>(null);

  const onFileReady = (file: ImportedFile | null) => {
    const mappedData = (file?.data ?? []).map((item) => ({
      ...item,
      id: uuidv4(),
    }));
    setData(mappedData);
    setError(null);

    if (file) {
      setStep((prevState) => ++prevState as Steps);
    }
  };

  const onDownloadTemplate = () => {
    exportToCsv(defaultTemplate, 'subscale_lookup_table_template');
  };

  useEffect(() => {
    if (!tableData?.length) return;

    try {
      setData(JSON.parse(tableData));
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
