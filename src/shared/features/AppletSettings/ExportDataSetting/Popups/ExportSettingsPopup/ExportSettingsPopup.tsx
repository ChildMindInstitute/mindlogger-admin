import { Button } from '@mui/material';
import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DateRangePicker } from 'shared/components/DateRangePicker';
import { CheckboxController, SelectController } from 'shared/components/FormComponents';
import { Modal } from 'shared/components/Modal';
import { Svg } from 'shared/components/Svg';
import {
  StyledBodyLarge,
  StyledFlexAllCenter,
  StyledFlexColumn,
  StyledFlexTopCenter,
  StyledModalWrapper,
  StyledTitleBoldMedium,
} from 'shared/styles';

import { ExportDataFormValues, SupplementaryFilesFormValues } from '../../ExportDataSetting.types';
import { ExportSettingsPopupProps } from './ExportSettingsPopup.types';
import { getDataExportedOptions } from './ExportSettingsPopup.utils';

export const ExportSettingsPopup = ({
  isOpen,
  onClose,
  onExport,
  minDate,
  maxDate,
  contextItemName,
  supportedSupplementaryFiles,
  canExportEhrHealthData,
  'data-testid': dataTestId,
}: ExportSettingsPopupProps) => {
  const { t } = useTranslation('app');

  const { control, watch } = useFormContext<ExportDataFormValues>() ?? {};
  const supplementaryFiles = watch('supplementaryFiles');

  const filteredSupplementaryFiles = useMemo(
    () =>
      (Object.entries(supplementaryFiles) as Array<[keyof SupplementaryFilesFormValues, boolean]>)
        .filter(([fileType]) => supportedSupplementaryFiles?.includes(fileType))
        .map(([fileType]) => fileType),
    [supplementaryFiles, supportedSupplementaryFiles],
  );

  return (
    <Modal
      open={isOpen}
      title={t('exportData')}
      onClose={onClose}
      width="57.5"
      data-testid={dataTestId}
    >
      <StyledModalWrapper sx={{ pb: 0 }}>
        <form noValidate autoComplete="off">
          <StyledFlexColumn sx={{ gap: 3.2 }}>
            <StyledFlexTopCenter sx={{ gap: 0.8 }}>
              <StyledBodyLarge>{t('export')}:</StyledBodyLarge>
              <StyledTitleBoldMedium>
                {contextItemName} {t('dataExport.responses')}
              </StyledTitleBoldMedium>
            </StyledFlexTopCenter>
            {canExportEhrHealthData && (
              <StyledFlexColumn sx={{ gap: 1.6 }}>
                <SelectController
                  name="dataExported"
                  control={control}
                  options={getDataExportedOptions()}
                  label={t('dataExport.data')}
                  data-testid={`${dataTestId}-data-exported`}
                  fullWidth
                />
              </StyledFlexColumn>
            )}
            <DateRangePicker maxDate={maxDate} minDate={minDate} data-testid={dataTestId ?? ''} />

            {filteredSupplementaryFiles.length > 0 && (
              <StyledFlexColumn sx={{ gap: 1.6 }}>
                <StyledBodyLarge>{t(`dataExport.supplementaryFiles.description`)}</StyledBodyLarge>
                <StyledFlexColumn gap={0.8}>
                  {filteredSupplementaryFiles.map((fileType) => (
                    <CheckboxController
                      control={control}
                      sxLabelProps={{ m: 0 }}
                      name={`supplementaryFiles.${fileType}`}
                      key={`data-export-supplementary-file-${fileType}`}
                      label={
                        <StyledBodyLarge>
                          {t(`dataExport.supplementaryFiles.includes.${fileType}`)}
                        </StyledBodyLarge>
                      }
                    />
                  ))}
                </StyledFlexColumn>
              </StyledFlexColumn>
            )}
            <StyledFlexAllCenter>
              <Button
                onClick={onExport}
                color="primary"
                variant="contained"
                sx={{ px: 2.4 }}
                startIcon={<Svg width="18" height="18" id="export" />}
                data-testid={`${dataTestId}-download-button`}
              >
                {t('download')}
              </Button>
            </StyledFlexAllCenter>
          </StyledFlexColumn>
        </form>
      </StyledModalWrapper>
    </Modal>
  );
};
