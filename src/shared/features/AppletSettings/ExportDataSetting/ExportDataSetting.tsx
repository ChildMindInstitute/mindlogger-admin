import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { addDays, endOfDay, startOfDay } from 'date-fns';
import { ObjectSchema } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';

import { DataExportPopup } from 'modules/Dashboard/features/Respondents/Popups';
import { Svg } from 'shared/components/Svg';
import { applet } from 'shared/state';
import { SelectController } from 'shared/components/FormComponents';
import { DatePicker, Modal } from 'shared/components';
import { theme, StyledBodyLarge, StyledFlexTopCenter, StyledModalWrapper } from 'shared/styles';
import { SelectEvent } from 'shared/types';
import { DateType } from 'shared/components/DatePicker/DatePicker.types';
import { getNormalizedTimezoneDate } from 'shared/utils';

import {
  StyledAppletSettingsButton,
  StyledAppletSettingsDescription,
} from '../AppletSettings.styles';
import { ExportDataFormValues, ExportDateType } from './ExportDataSettings.types';
import { exportDataSettingSchema } from './ExportDataSetting.schema';
import { getDateTypeOptions } from './ExportDataSetting.utils';

export const ExportDataSetting = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { t } = useTranslation('app');
  const { result: appletData } = applet.useAppletData() ?? {};
  const [dataIsExporting, setDataIsExporting] = useState(false);
  const dataTestid = 'applet-settings-export-data-export';
  const minDate = new Date(appletData?.createdAt ?? '');
  const getMaxDate = () => getNormalizedTimezoneDate(new Date().toString());
  const methods = useForm<ExportDataFormValues>({
    resolver: yupResolver(exportDataSettingSchema() as ObjectSchema<ExportDataFormValues>),
    defaultValues: {
      dateType: ExportDateType.AllTime,
      fromDate: minDate,
      toDate: getMaxDate(),
    },
    mode: 'onSubmit',
  });
  const { control, setValue, watch } = methods;
  const dateType = watch('dateType');
  const fromDate = watch('fromDate');
  const toDate = watch('toDate');
  const hasCustomDate = dateType === ExportDateType.ChooseDates;
  const commonProps = {
    maxDate: getMaxDate(),
    control,
    inputSx: {
      width: '19rem',
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
        name: appletData?.displayName,
      })}
      onClose={onClose}
      buttonText=""
    >
      <StyledModalWrapper>
        <FormProvider {...methods}>
          <form noValidate autoComplete="off">
            <StyledAppletSettingsDescription>
              {t('exportDescription')}
            </StyledAppletSettingsDescription>
            <SelectController
              name={'dateType'}
              control={control}
              options={getDateTypeOptions()}
              label={t('dateRange')}
              data-testid={`${dataTestid}-dateType`}
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
                  data-testid={`${dataTestid}-from-date`}
                  inputSx={{ width: '100%' }}
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
                  data-testid={`${dataTestid}-to-date`}
                  inputSx={{ width: '100%' }}
                />
              </StyledFlexTopCenter>
            )}
            <Box sx={{ textAlign: 'center' }}>
              <StyledAppletSettingsButton
                onClick={() => {
                  setDataIsExporting(true);
                }}
                variant="contained"
                startIcon={<Svg width="18" height="18" id="export" />}
                data-testid={dataTestid}
              >
                {t('downloadCSV')}
              </StyledAppletSettingsButton>
            </Box>
            {dataIsExporting && (
              <DataExportPopup
                isAppletSetting
                popupVisible={dataIsExporting}
                setPopupVisible={setDataIsExporting}
                chosenAppletData={appletData ?? null}
                data-testid={`${dataTestid}-popup`}
              />
            )}
          </form>
        </FormProvider>
      </StyledModalWrapper>
    </Modal>
  );
};
