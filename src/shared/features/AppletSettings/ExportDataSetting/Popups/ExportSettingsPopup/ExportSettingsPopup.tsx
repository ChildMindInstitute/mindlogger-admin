import { Button } from '@mui/material';
import { addDays, endOfDay, startOfDay } from 'date-fns';
import { useCallback, useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DatePicker } from 'shared/components/DatePicker';
import { DateType } from 'shared/components/DatePicker/DatePicker.types';
import { CheckboxController, SelectController } from 'shared/components/FormComponents';
import { Modal } from 'shared/components/Modal';
import { Svg } from 'shared/components/Svg';
import {
  StyledBodyLarge,
  StyledFlexAllCenter,
  StyledFlexColumn,
  StyledFlexTopCenter,
  StyledModalWrapper,
  theme,
} from 'shared/styles';

import {
  ExportDataFormValues,
  ExportDateType,
  SupplementaryFilesFormValues,
} from '../../ExportDataSetting.types';
import { ExportSettingsPopupProps } from './ExportSettingsPopup.types';
import { getDataExportedOptions, getDateTypeOptions } from './ExportSettingsPopup.utils';

export const ExportSettingsPopup = ({
  isOpen,
  onClose,
  onExport,
  minDate,
  maxDate,
  appletName,
  supportedSupplementaryFiles,
  canExportEhrHealthData,
  'data-testid': dataTestId,
}: ExportSettingsPopupProps) => {
  const { t } = useTranslation('app');

  const { control, setValue, watch } = useFormContext<ExportDataFormValues>() ?? {};
  const dateType = watch('dateType');
  const fromDate = watch('fromDate');
  const toDate = watch('toDate');
  const supplementaryFiles = watch('supplementaryFiles');
  const hasCustomDate = dateType === ExportDateType.ChooseDates;

  const commonProps = {
    maxDate,
    control,
    inputSx: {
      '& .MuiInputLabel-outlined': {
        textTransform: 'capitalize',
      },
    },
  };

  const processFromDate = useCallback(
    (date: DateType | undefined) => {
      if (!date) return;
      setValue('fromDate', startOfDay(date));
    },
    [setValue],
  );

  const processToDate = useCallback(
    (date: DateType | undefined) => {
      if (!date) return;
      setValue('toDate', endOfDay(date));
    },
    [setValue],
  );

  const onFromDatePickerClose = () => {
    let newToDate = toDate;
    if (toDate < fromDate) {
      const increasedFromDate = addDays(fromDate, 1);

      newToDate = increasedFromDate <= maxDate ? increasedFromDate : maxDate;
    }
    processToDate(newToDate);
  };

  useEffect(() => {
    switch (dateType) {
      case ExportDateType.AllTime:
        processFromDate(minDate);
        processToDate(maxDate);
        break;
      case ExportDateType.Last24h:
        setValue('fromDate', addDays(maxDate, -1));
        setValue('toDate', maxDate);
        break;
      case ExportDateType.LastWeek:
        processFromDate(addDays(maxDate, -7));
        processToDate(maxDate);
        break;
      case ExportDateType.LastMonth:
        processFromDate(addDays(maxDate, -30));
        processToDate(maxDate);
        break;
      case ExportDateType.ChooseDates:
        processFromDate(minDate);
        processToDate(maxDate);
        break;
    }
  }, [dateType, minDate, maxDate, processFromDate, processToDate, setValue]);

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
      title={t('exportDataForApplet', {
        name: appletName,
      })}
      onClose={onClose}
      width="57.5"
      data-testid={dataTestId}
    >
      <StyledModalWrapper sx={{ pb: 0 }}>
        <form noValidate autoComplete="off">
          <StyledFlexColumn sx={{ gap: 3.2 }}>
            <StyledFlexColumn sx={{ gap: 1.6 }}>
              {canExportEhrHealthData && (
                <SelectController
                  name="dataExported"
                  control={control}
                  options={getDataExportedOptions()}
                  label={t('dataExport.data')}
                  data-testid={`${dataTestId}-data-exported`}
                  fullWidth
                />
              )}
              <SelectController
                name="dateType"
                control={control}
                options={getDateTypeOptions()}
                label={t('dateRange')}
                data-testid={`${dataTestId}-dateType`}
                fullWidth
              />
            </StyledFlexColumn>
            {hasCustomDate && (
              <StyledFlexTopCenter>
                <DatePicker
                  {...commonProps}
                  name="fromDate"
                  onCloseCallback={(date) => {
                    processFromDate(date);
                    onFromDatePickerClose();
                  }}
                  label={t('startDate')}
                  minDate={minDate}
                  data-testid={`${dataTestId}-from-date`}
                  inputWrapperSx={{ width: '100%' }}
                />
                <StyledBodyLarge sx={{ margin: theme.spacing(0, 0.8) }}>
                  {t('smallTo')}
                </StyledBodyLarge>
                <DatePicker
                  {...commonProps}
                  name="toDate"
                  onCloseCallback={processToDate}
                  minDate={fromDate}
                  label={t('endDate')}
                  data-testid={`${dataTestId}-to-date`}
                  inputWrapperSx={{ width: '100%' }}
                />
              </StyledFlexTopCenter>
            )}
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
