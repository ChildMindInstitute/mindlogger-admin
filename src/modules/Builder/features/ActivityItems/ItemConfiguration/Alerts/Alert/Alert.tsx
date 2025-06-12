import get from 'lodash.get';
import { Trans, useTranslation } from 'react-i18next';

import { useCustomFormContext } from 'modules/Builder/hooks';
import { ItemFormValues } from 'modules/Builder/types';
import { InputController } from 'shared/components/FormComponents';
import { Svg } from 'shared/components/Svg';
import { ItemResponseType } from 'shared/consts';
import {
  StyledBodyMedium,
  StyledIconButton,
  StyledTitleBoldSmall,
  theme,
  variables,
} from 'shared/styles';

import { ItemConfigurationSettings } from '../../ItemConfiguration.types';
import { StyledAlert, StyledDescription, StyledRow, StyledSelectController } from './Alert.styles';
import { AlertProps } from './Alert.types';
import { getItemsList, getOptionsList, getSliderRowsItemList } from './Alert.utils';

export const Alert = ({ name, index, removeAlert }: AlertProps) => {
  const { t } = useTranslation('app');
  const {
    control,
    getValues,
    watch,
    formState: { errors },
  } = useCustomFormContext();

  const alertName = `${name}.alerts.${index}`;
  const alertValueName = `${alertName}.value`;
  const alertMinValueName = `${alertName}.minValue`;
  const alertMaxValueName = `${alertName}.maxValue`;
  const alertTextName = `${alertName}.alert`;
  const alertSliderIdName = `${alertName}.sliderId`;
  const optionName = `${alertName}.optionId`;
  const rowName = `${alertName}.rowId`;

  const alert = watch(alertName);

  const { responseType, config: settings } = watch(name);
  const dataTestid = `builder-activity-items-item-configuration-alerts-${index}`;

  const alertValueErrorMessage = get(errors, alertValueName)?.message;
  const alertMinValueErrorMessage = get(errors, alertMinValueName)?.message;
  const alertMaxValueErrorMessage = get(errors, alertMaxValueName)?.message;
  const alertSliderIdErrorMessage = get(errors, alertSliderIdName)?.message;
  const alertTextError = get(errors, alertTextName);
  const getSliderErrorText = () => {
    if (responseType !== ItemResponseType.Slider && responseType !== ItemResponseType.SliderRows) {
      return null;
    }
    if (alertSliderIdErrorMessage && typeof alertSliderIdErrorMessage === 'string') {
      return alertSliderIdErrorMessage;
    }
    if (alertValueErrorMessage && typeof alertValueErrorMessage === 'string') {
      return alertValueErrorMessage;
    }
    if (alertMinValueErrorMessage && typeof alertMinValueErrorMessage === 'string') {
      return alertMinValueErrorMessage;
    }
    if (alertMaxValueErrorMessage && typeof alertMaxValueErrorMessage === 'string') {
      return alertMaxValueErrorMessage;
    }

    return null;
  };
  const sliderErrorText = getSliderErrorText();

  const renderAlertContent = () => {
    switch (responseType) {
      case ItemResponseType.SingleSelection:
      case ItemResponseType.MultipleSelection:
        return (
          <Trans
            i18nKey="alertSingleMultipleNonContinuousSlider"
            components={[
              <StyledSelectController
                name={alertValueName}
                control={control}
                placeholder={t('option')}
                options={getOptionsList(getValues(name) as ItemFormValues, alert)}
                isErrorVisible={false}
                data-testid={`${dataTestid}-selection-option`}
              />,
            ]}
          />
        );
      case ItemResponseType.SingleSelectionPerRow:
      case ItemResponseType.MultipleSelectionPerRow:
        return (
          <Trans
            i18nKey="alertSingleMultipleSelectionPerRow"
            components={[
              <StyledSelectController
                name={`${optionName}`}
                control={control}
                placeholder={t('option')}
                options={getOptionsList(getValues(name) as ItemFormValues, alert)}
                isErrorVisible={false}
                data-testid={`${dataTestid}-selection-per-row-option`}
              />,
              <StyledSelectController
                name={`${rowName}`}
                control={control}
                placeholder={t('row')}
                options={getItemsList(getValues(name) as ItemFormValues, alert)}
                isErrorVisible={false}
                data-testid={`${dataTestid}-selection-per-row-row`}
              />,
            ]}
          />
        );
      case ItemResponseType.SliderRows:
        return (
          <Trans
            i18nKey="alertSliderRows"
            components={[
              <StyledSelectController
                name={alertSliderIdName}
                control={control}
                placeholder={t('slider')}
                options={getOptionsList(getValues(name) as ItemFormValues, alert)}
                isErrorVisible={false}
                data-testid={`${dataTestid}-slider-rows-row`}
              />,
              <StyledSelectController
                name={alertValueName}
                control={control}
                placeholder={t('option')}
                options={getSliderRowsItemList(getValues(name), alert)}
                isErrorVisible={false}
                data-testid={`${dataTestid}-slider-rows-value`}
              />,
            ]}
          />
        );
      case ItemResponseType.Slider:
        if (!get(settings, ItemConfigurationSettings.IsContinuous)) {
          return (
            <Trans
              i18nKey="alertSingleMultipleNonContinuousSlider"
              components={[
                <InputController
                  type="number"
                  control={control}
                  name={alertValueName}
                  isErrorVisible={false}
                  data-testid={`${dataTestid}-slider-value`}
                />,
              ]}
            />
          );
        }

        return (
          <Trans
            i18nKey="alertContinuousSlider"
            components={[
              <InputController
                type="number"
                control={control}
                name={alertMinValueName}
                isErrorVisible={false}
                data-testid={`${dataTestid}-cont-slider-min-value`}
              />,
              <InputController
                type="number"
                control={control}
                name={alertMaxValueName}
                isErrorVisible={false}
                data-testid={`${dataTestid}-cont-slider-max-value`}
              />,
            ]}
          />
        );
    }
  };

  return (
    <StyledAlert data-testid={`${dataTestid}-panel`}>
      <StyledRow>
        <StyledTitleBoldSmall>
          {t('alert')} {index + 1}
        </StyledTitleBoldSmall>
        <StyledIconButton onClick={() => removeAlert(index)} data-testid={`${dataTestid}-remove`}>
          <Svg id="trash" />
        </StyledIconButton>
      </StyledRow>
      <StyledDescription>{renderAlertContent()}</StyledDescription>
      <InputController
        fullWidth
        withDebounce
        name={alertTextName}
        control={control}
        label={t('alertMessage')}
        type="text"
        sx={{
          fieldset: { borderColor: variables.palette.outline_variant },
        }}
        data-testid={`${dataTestid}-text`}
      />
      {sliderErrorText && (
        <StyledBodyMedium
          sx={{ pt: theme.spacing(alertTextError ? 2.5 : 0.5) }}
          color={variables.palette.error}
        >
          {sliderErrorText}
        </StyledBodyMedium>
      )}
    </StyledAlert>
  );
};
