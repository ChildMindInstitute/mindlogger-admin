import { Box } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

import { DataTable, FileUploader } from 'shared/components';
import { theme, variables } from 'shared/styles';
import i18n from 'i18n';

import { GetComponentsProps, ModalType, ScreenObjectProps, LookupTableDataItem } from './LookupTable.types';

const { t } = i18n;

export const getModalComponents = ({
  modalType,
  columnData,
  data,
  error,
  labelsObject,
  onFileReady,
  onUpdate,
  onClose,
  onDownloadTemplate,
  setModalType,
  setStep,
  setError,
}: GetComponentsProps) => {
  const components: ScreenObjectProps = {
    [ModalType.Upload]: [
      {
        title: labelsObject[modalType].title,
        component: (
          <>
            <FileUploader
              uploadLabel={labelsObject[ModalType.Upload].initDescription}
              onFileReady={onFileReady}
              onDownloadTemplate={onDownloadTemplate}
              invalidFileFormatError={labelsObject.errors.incorrectFileFormat}
              validationError={error}
              parsingError={labelsObject.errors.fileCantBeParsed}
              csvOnly
            />
          </>
        ),
        buttonText: t('save'),
        onSubmit: () => {
          setError(labelsObject.errors.haveToUploadFile);
        },
        hasSecondBtn: true,
        secondBtnText: t('cancel'),
        onSecondBtnSubmit: onClose,
      },
      {
        title: labelsObject[modalType].title,
        component: (
          <>
            <Box sx={{ mb: theme.spacing(2) }}>{labelsObject.upload.successDescription}</Box>
            <DataTable
              tableHeadBackground={variables.palette.surface3}
              columns={columnData}
              data={data}
              noDataPlaceholder={t('noElementsYet')}
            />
          </>
        ),
        buttonText: t('save'),
        onSubmit: () => {
          if (!data?.length) return;

          onUpdate(data);
          onClose();
        },
        hasSecondBtn: true,
        secondBtnText: t('cancel'),
        onSecondBtnSubmit: onClose,
      },
    ],
    [ModalType.Edit]: [
      {
        title: labelsObject[modalType].title,
        component: (
          <>
            <Box sx={{ mb: theme.spacing(2) }}>{labelsObject.edit.initDescription}</Box>
            <DataTable
              tableHeadBackground={variables.palette.surface3}
              columns={columnData}
              data={data}
              noDataPlaceholder={t('noElementsYet')}
            />
          </>
        ),
        buttonText: t('replace'),
        onSubmit: () => {
          setModalType(ModalType.Upload);
          setStep(0);
        },
        hasSecondBtn: true,
        secondBtnText: t('delete'),
        submitBtnColor: 'error',
        onSecondBtnSubmit: () => {
          setModalType(ModalType.Delete);
          setStep(0);
        },
        hasThirdBtn: true,
        thirdBtnText: t('cancel'),
        onThirdBtnSubmit: onClose,
      },
    ],
    [ModalType.Delete]: [
      {
        title: labelsObject[modalType].title,
        component: labelsObject.delete.initDescription,
        buttonText: t('delete'),
        onSubmit: () => {
          onUpdate();
          setStep(1);
        },
        submitBtnColor: 'error',
        hasSecondBtn: true,
        secondBtnText: t('cancel'),
        onSecondBtnSubmit: onClose,
      },
      {
        title: labelsObject[modalType].title,
        component: labelsObject.delete.successDescription!,
        buttonText: t('ok'),
        onSubmit: onClose,
      },
    ],
  };

  return components[modalType];
};

export const processImportedData = (item: Record<string, string | number>) => {
  Object.keys(item).forEach((k) => (item[k] = typeof item[k] === 'string' ? (item[k] as string).trim() : item[k]));

  return {
    ...item,
    sex: (item.sex as string) || null,
    id: uuidv4(),
  } as LookupTableDataItem;
};
