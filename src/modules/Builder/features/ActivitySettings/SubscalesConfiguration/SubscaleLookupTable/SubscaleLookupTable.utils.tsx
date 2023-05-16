import { Trans } from 'react-i18next';
import { Box } from '@mui/material';

import { StyledBodyLarge, StyledTitleSmall, theme, variables } from 'shared/styles';
import { DataTable, FileUploader } from 'shared/components';
import i18n from 'i18n';

import { GetComponentsProps, ModalType, ScreenObjectProps } from './SubscaleLookupTable.types';
import { columnData } from './SubscaleLookupTable.const';

const { t } = i18n;

export const labels = (name?: string) => ({
  upload: {
    title: t('subscaleLookupTable.upload.title'),
    initDescription: (
      <Trans i18nKey="subscaleLookupTable.upload.initDescription">
        Please upload file in
        <strong> .csv, .xls, .xlsx, .ods. </strong>
        format
      </Trans>
    ),
    successDescription: (
      <Trans i18nKey="subscaleLookupTable.upload.successDescription">
        Your Lookup Table for
        <strong>
          <> {{ name }} </>
        </strong>
        was parsed successfully.
      </Trans>
    ),
  },
  edit: {
    title: t('subscaleLookupTable.edit.title'),
    initDescription: (
      <Trans i18nKey="subscaleLookupTable.edit.initDescription">
        Current Lookup Table for
        <strong>
          <> {{ name }} </>
        </strong>
        .
      </Trans>
    ),
  },
  delete: {
    title: t('subscaleLookupTable.delete.title'),
    initDescription: (
      <Trans i18nKey="subscaleLookupTable.delete.initDescription">
        Are you sure you want to delete the Lookup Table for
        <strong>
          <> {{ name }} </>
        </strong>
        ?
      </Trans>
    ),
    successDescription: (
      <Trans i18nKey="subscaleLookupTable.delete.successDescription">
        The current Lookup Table for
        <strong>
          <> {{ name }} </>
        </strong>
        has been deleted successfully.
      </Trans>
    ),
  },
  errors: {
    haveToUploadFile: (
      <StyledTitleSmall sx={{ mt: 2.2 }} color={variables.palette.semantic.error}>
        {t('subscaleLookupTable.errors.haveToUploadFile')}
      </StyledTitleSmall>
    ),
    fileCantBeParsed: (
      <StyledBodyLarge sx={{ color: variables.palette.semantic.error }}>
        {t('subscaleLookupTable.errors.fileCantBeParsed')}
      </StyledBodyLarge>
    ),
    incorrectFileFormat: (
      <StyledBodyLarge sx={{ color: variables.palette.semantic.error }}>
        <Trans i18nKey="subscaleLookupTable.errors.incorrectFileFormat">
          Incorrect file format. Please upload file in
          <strong> .csv, .xls, .xlsx, .ods. </strong>
          format.
        </Trans>
      </StyledBodyLarge>
    ),
    onDelete: (
      <StyledBodyLarge sx={{ color: variables.palette.semantic.error }}>
        <Trans i18nKey="subscaleLookupTable.errors.onDelete">
          The current Lookup Table for
          <strong>
            <> {{ name }} </>
          </strong>
          has not been deleted. Please try again.
        </Trans>
      </StyledBodyLarge>
    ),
  },
});

export const getComponents = ({
  modalType,
  subscaleName,
  data,
  error,
  onFileReady,
  onUpdate,
  onClose,
  setModalType,
  setStep,
  setError,
}: GetComponentsProps) => {
  const labelsObject = labels(subscaleName);

  const components: ScreenObjectProps = {
    [ModalType.Upload]: [
      {
        title: labelsObject[modalType].title,
        component: (
          <>
            <FileUploader
              uploadLabel={labelsObject.upload.initDescription}
              onFileReady={onFileReady}
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
              styles={{ width: '100%' }}
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
              styles={{ width: '100%' }}
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
        component: labelsObject.delete.successDescription,
        buttonText: t('ok'),
        onSubmit: onClose,
      },
    ],
  };

  return components[modalType];
};
