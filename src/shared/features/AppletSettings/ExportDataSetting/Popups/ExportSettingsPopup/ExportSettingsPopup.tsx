import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { addDays, endOfDay, startOfDay } from 'date-fns';
import { useFormContext } from 'react-hook-form';

import { Svg } from 'shared/components/Svg';
import { applet } from 'shared/state';
import { SelectController } from 'shared/components/FormComponents';
import { DatePicker } from 'shared/components/DatePicker';
import { Modal } from 'shared/components/Modal';
import { StyledBodyLarge, StyledFlexTopCenter, StyledModalWrapper, theme } from 'shared/styles';
import { SelectEvent } from 'shared/types';
import { DateType } from 'shared/components/DatePicker/DatePicker.types';
import { StyledAppletSettingsButton } from 'shared/features/AppletSettings/AppletSettings.styles';

import { ExportSettingsPopupProps } from './ExportSettingsPopup.types';
import { getDateTypeOptions } from './ExportSettingsPopup.utils';
import { DATA_TESTID_EXPORT_DATA_SETTINGS_POPUP } from '../../ExportDataSetting.const';
import { ExportDataFormValues, ExportDateType } from '../../ExportDataSetting.types';
import { StyledExportSettingsDescription } from './ExportSettingsPopup.styles';

export const ExportSettingsPopup = ({
  isOpen,
  onClose,
  onExport,
  minDate,
  getMaxDate,
}: ExportSettingsPopupProps) => {
  const { t } = useTranslation('app');
  const { result: appletData } = applet.useAppletData() ?? {};

  const { control, setValue, watch } = useFormContext<ExportDataFormValues>() ?? {};
  const dateType = watch('dateType');
  const fromDate = watch('fromDate');
  const toDate = watch('toDate');
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

  return (
    <Modal
      open={isOpen}
      title={t('exportDataForApplet', {
        name: appletData?.displayName ?? '',
      })}
      onClose={onClose}
      buttonText=""
      data-testid={DATA_TESTID_EXPORT_DATA_SETTINGS_POPUP}
    >
      <StyledModalWrapper>
        <form noValidate autoComplete="off">
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
            <StyledFlexTopCenter
              sx={{
                mt: theme.spacing(2.4),
              }}
            >
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
          <Box sx={{ textAlign: 'center' }}>
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
        </form>
      </StyledModalWrapper>
    </Modal>
  );
};
