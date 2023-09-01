import { useTranslation, Trans } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import get from 'lodash.get';

import { Svg } from 'shared/components';
import { InputController } from 'shared/components/FormComponents';
import { StyledTitleBoldSmall, StyledIconButton, variables } from 'shared/styles';
import { ItemResponseType } from 'shared/consts';
import { ItemFormValues } from 'modules/Builder/types';

import { ItemConfigurationSettings } from '../../ItemConfiguration.types';
import { StyledAlert, StyledRow, StyledDescription, StyledSelectController } from './Alert.styles';
import { AlertProps } from './Alert.types';
import { getItemsList, getOptionsList, getSliderRowsItemList } from './Alert.utils';

export const Alert = ({ name, index, removeAlert }: AlertProps) => {
  const { t } = useTranslation('app');
  const { control, getValues, watch } = useFormContext();

  const alertName = `${name}.alerts.${index}`;
  const optionName = `${alertName}.optionId`;
  const rowName = `${alertName}.rowId`;

  const alert = watch(alertName);

  const continuousSliderMax = watch(`${alertName}.maxValue`);

  const { responseType, config: settings, responseValues } = watch(name);
  const dataTestid = `builder-activity-items-item-configuration-alerts-${index}`;

  const renderAlertContent = () => {
    switch (responseType) {
      case ItemResponseType.SingleSelection:
      case ItemResponseType.MultipleSelection:
        return (
          <Trans
            i18nKey="alertSingleMultipleNonContinuousSlider"
            components={[
              <StyledSelectController
                name={`${alertName}.value`}
                control={control}
                placeholder={t('option')}
                options={getOptionsList(getValues(name) as ItemFormValues, alert)}
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
                data-testid={`${dataTestid}-selection-per-row-option`}
              />,
              <StyledSelectController
                name={`${rowName}`}
                control={control}
                placeholder={t('row')}
                options={getItemsList(getValues(name) as ItemFormValues, alert)}
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
                name={`${alertName}.sliderId`}
                control={control}
                placeholder={t('slider')}
                options={getOptionsList(getValues(name) as ItemFormValues, alert)}
                data-testid={`${dataTestid}-slider-rows-row`}
              />,
              <StyledSelectController
                name={`${alertName}.value`}
                control={control}
                placeholder={t('option')}
                options={getSliderRowsItemList(getValues(name) as ItemFormValues, alert)}
                data-testid={`${dataTestid}-slider-rows-value`}
              />,
            ]}
          />
        );
      case ItemResponseType.Slider:
        // eslint-disable-next-line no-case-declarations
        const { minValue, maxValue } = responseValues;

        if (!get(settings, ItemConfigurationSettings.IsContinuous)) {
          return (
            <Trans
              i18nKey="alertSingleMultipleNonContinuousSlider"
              components={[
                <InputController
                  type="number"
                  control={control}
                  name={`${alertName}.value`}
                  maxNumberValue={maxValue}
                  minNumberValue={minValue}
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
                name={`${alertName}.minValue`}
                maxNumberValue={continuousSliderMax - 1}
                minNumberValue={minValue}
                data-testid={`${dataTestid}-cont-slider-min-value`}
              />,
              <InputController
                type="number"
                control={control}
                name={`${alertName}.maxValue`}
                maxNumberValue={maxValue}
                minNumberValue={minValue + 1}
                data-testid={`${dataTestid}-cont-slider-max-value`}
              />,
            ]}
          />
        );
    }
  };

  return (
    <StyledAlert>
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
        name={`${alertName}.alert`}
        control={control}
        label={t('alertMessage')}
        type="text"
        sx={{
          fieldset: { borderColor: variables.palette.outline_variant },
        }}
        data-testid={`${dataTestid}-text`}
      />
    </StyledAlert>
  );
};
