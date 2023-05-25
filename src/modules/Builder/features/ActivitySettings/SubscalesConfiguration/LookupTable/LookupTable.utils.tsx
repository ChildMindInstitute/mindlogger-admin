import { Box } from '@mui/material';

import { DataTable, FileUploader } from 'shared/components';
import { theme, variables } from 'shared/styles';
import i18n from 'i18n';

import { GetComponentsProps, ModalType, ScreenObjectProps } from './LookupTable.types';

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
            />
            {error}
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
              columns={columnData}
              data={data}
              noDataPlaceholder={t('noElementsYet')}
              tableHeadBgColor={variables.palette.surface3}
            />
          </>
        ),
        buttonText: t('save'),
        onSubmit: () => {
          if (!data?.length) return;

          onUpdate(JSON.stringify(data));
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
              columns={columnData}
              data={data}
              noDataPlaceholder={t('noElementsYet')}
              tableHeadBgColor={variables.palette.surface3}
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
