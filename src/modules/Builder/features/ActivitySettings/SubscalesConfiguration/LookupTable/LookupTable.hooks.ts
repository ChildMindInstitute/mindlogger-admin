import { useEffect, useRef, useState } from 'react';

import { DataTableItem, FileUploaderRefProps, ImportedFile } from 'shared/components';
import { exportTemplate } from 'shared/utils';

import { ModalType, Steps, LookupTableSetupHookProps } from './LookupTable.types';
import { isFileCannotBeParsed, processImportedData } from './LookupTable.utils';

export const useSubscaleLookupTableSetup = ({
  template,
  templatePrefix,
  tableData,
  labelsObject,
  parsingRules,
}: LookupTableSetupHookProps) => {
  const [modalType, setModalType] = useState<ModalType>(
    tableData?.length ? ModalType.Edit : ModalType.Upload,
  );
  const [step, setStep] = useState<Steps>(0);
  const [data, setData] = useState<DataTableItem[]>();
  const [error, setError] = useState<JSX.Element | null>(null);
  const fileUploaderRef = useRef<null | FileUploaderRefProps>(null);

  const onFileReady = (file: ImportedFile | null) => {
    if (!file) {
      setData([]);

      return;
    }

    const mappedData = file.data.map(processImportedData);
    if (isFileCannotBeParsed(mappedData, parsingRules)) {
      fileUploaderRef.current?.setFile(null);
      setError(() => labelsObject.errors.fileCantBeParsed);

      return;
    }

    setData(mappedData);
    setStep((prevState) => ++prevState as Steps);
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
    fileUploaderRef,
    setModalType,
    setError,
    setStep,
    onFileReady,
    onDownloadTemplate,
  };
};
