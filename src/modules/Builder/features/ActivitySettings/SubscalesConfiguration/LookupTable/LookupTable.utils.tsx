import { Box } from '@mui/material';

import { DataTable, FileUploader } from 'shared/components';
import { StyledTitleSmall, theme, variables } from 'shared/styles';
import i18n from 'i18n';

import { GetComponentsProps, ModalType, ScreenObjectProps } from './LookupTable.types';

const { t } = i18n;

export const getModalComponents = ({
  modalType,
  columnData,
  data,
  error,
  warning,
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
              uploadLabel={labelsObject[modalType].initDescription}
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
            <Box sx={{ mb: theme.spacing(2) }}>{labelsObject[modalType].successDescription}</Box>
            <DataTable
              tableHeadBackground={variables.modalBackground}
              columns={columnData}
              data={data}
              noDataPlaceholder={t('noElementsYet')}
            />
            {warning && (
              <StyledTitleSmall sx={{ mt: 2.2 }} color={variables.palette.semantic.error}>
                {warning}
              </StyledTitleSmall>
            )}
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
              tableHeadBackground={variables.modalBackground}
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
        component: labelsObject[modalType].initDescription,
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
        component: labelsObject[modalType].successDescription,
        buttonText: t('ok'),
        onSubmit: onClose,
      },
    ],
  };

  return components[modalType];
};
