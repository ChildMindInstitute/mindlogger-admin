import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { addDays, endOfDay, startOfDay } from 'date-fns';
import { useFormContext } from 'react-hook-form';
import { useMemo } from 'react';

import { Svg } from 'shared/components/Svg';
import { CheckboxController, SelectController } from 'shared/components/FormComponents';
import { DatePicker } from 'shared/components/DatePicker';
import { Modal } from 'shared/components/Modal';
import {
  StyledBodyLarge,
  StyledFlexColumn,
  StyledFlexTopCenter,
  StyledModalWrapper,
  theme,
} from 'shared/styles';
import { SelectEvent } from 'shared/types';
import { DateType } from 'shared/components/DatePicker/DatePicker.types';
import {
  StyledAppletSettingsButton,
  StyledAppletSettingsDescription,
} from 'shared/features/AppletSettings/AppletSettings.styles';

import { ExportSettingsPopupProps } from './ExportSettingsPopup.types';
import { getDateTypeOptions } from './ExportSettingsPopup.utils';
import { DATA_TESTID_EXPORT_DATA_SETTINGS_POPUP } from '../../ExportDataSetting.const';
import {
  ExportDataFormValues,
  ExportDateType,
  SupplementaryFilesFormValues,
} from '../../ExportDataSetting.types';
import {
  StyledExportSettingsDescription,
  StyledExportSettingsForm,
} from './ExportSettingsPopup.styles';

export const ExportSettingsPopup = ({
  isOpen,
  onClose,
  onExport,
  minDate,
  getMaxDate,
  appletName,
  supportedSupplementaryFiles,
}: ExportSettingsPopupProps) => {
  const { t } = useTranslation('app');

  const { control, setValue, watch } = useFormContext<ExportDataFormValues>() ?? {};
  const dateType = watch('dateType');
  const fromDate = watch('fromDate');
  const toDate = watch('toDate');
  const supplementaryFiles = watch('supplementaryFiles');
  const hasCustomDate = dateType === ExportDateType.ChooseDates;

  const commonProps = {
    maxDate: getMaxDate(),
    control,
    inputSx: {
      '& .MuiInputLabel-outlined': {
        textTransform: 'capitalize',
      },
    },
  };

  const onFromDateSubmit = (date: DateType) => {
    if (!date) return;
    setValue('fromDate', startOfDay(date));
  };
  const onToDateSubmit = (date: DateType) => {
    if (!date) return;
    setValue('toDate', endOfDay(date));
  };
  const onDatePickerClose = () => {
    if (toDate < fromDate) {
      setValue('toDate', addDays(fromDate, 1));
    }
  };
  const onDateTypeChange = (e: SelectEvent) => {
    const dateType = e.target.value as ExportDateType;
    const maxDate = getMaxDate();
    switch (dateType) {
      case ExportDateType.AllTime:
        setValue('fromDate', minDate);
        setValue('toDate', maxDate);
        break;
      case ExportDateType.Last24h:
        setValue('fromDate', addDays(maxDate, -1));
        setValue('toDate', maxDate);
        break;
      case ExportDateType.LastWeek:
        setValue('fromDate', addDays(maxDate, -7));
        setValue('toDate', maxDate);
        break;
      case ExportDateType.LastMonth:
        setValue('fromDate', addDays(maxDate, -30));
        setValue('toDate', maxDate);
        break;
      case ExportDateType.ChooseDates:
        setValue('fromDate', minDate);
        setValue('toDate', maxDate);
        break;
    }
  };

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
      buttonText=""
      data-testid={DATA_TESTID_EXPORT_DATA_SETTINGS_POPUP}
    >
      <StyledModalWrapper>
        <StyledExportSettingsForm noValidate autoComplete="off">
          <StyledExportSettingsDescription>
            {t('exportDescription')}
          </StyledExportSettingsDescription>
          <SelectController
            name={'dateType'}
            control={control}
            options={getDateTypeOptions()}
            label={t('dateRange')}
            data-testid={`${DATA_TESTID_EXPORT_DATA_SETTINGS_POPUP}-dateType`}
            dropdownStyles={{
              width: '30rem',
            }}
            SelectProps={{
              autoWidth: true,
            }}
            customChange={onDateTypeChange}
            style={{ width: '100%' }}
          />
          {hasCustomDate && (
            <StyledFlexTopCenter>
              <DatePicker
                {...commonProps}
                name="fromDate"
                onCloseCallback={onDatePickerClose}
                onSubmitCallback={onFromDateSubmit}
                label={t('startDate')}
                minDate={minDate}
                data-testid={`${DATA_TESTID_EXPORT_DATA_SETTINGS_POPUP}-from-date`}
                inputWrapperSx={{ width: '100%' }}
              />
              <StyledBodyLarge sx={{ margin: theme.spacing(0, 0.8) }}>
                {t('smallTo')}
              </StyledBodyLarge>
              <DatePicker
                {...commonProps}
                name="toDate"
                onSubmitCallback={onToDateSubmit}
                minDate={fromDate}
                label={t('endDate')}
                data-testid={`${DATA_TESTID_EXPORT_DATA_SETTINGS_POPUP}-to-date`}
                inputWrapperSx={{ width: '100%' }}
              />
            </StyledFlexTopCenter>
          )}
          {filteredSupplementaryFiles.length > 0 && (
            <StyledAppletSettingsDescription>
              {t(`dataExport.supplementaryFiles.description`)}
            </StyledAppletSettingsDescription>
          )}
          <StyledFlexColumn>
            {filteredSupplementaryFiles.map((fileType) => (
              <CheckboxController
                control={control}
                sxLabelProps={{ mt: 0, ml: '12px' }}
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
          <Box sx={{ textAlign: 'center' }} className="no-gap">
            <StyledAppletSettingsButton
              onClick={() => {
                if (dateType !== 'chooseDates') {
                  setValue('toDate', getMaxDate());
                }

                onExport();
              }}
              variant="contained"
              startIcon={<Svg width="18" height="18" id="export" />}
              data-testid={`${DATA_TESTID_EXPORT_DATA_SETTINGS_POPUP}-button`}
            >
              {t('download')}
            </StyledAppletSettingsButton>
          </Box>
        </StyledExportSettingsForm>
      </StyledModalWrapper>
    </Modal>
  );
};
