import { useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import get from 'lodash.get';

import { Svg } from 'shared/components';
import { InputController, Option, SelectController } from 'shared/components/FormComponents';
import { StyledTitleBoldSmall, StyledIconButton, variables } from 'shared/styles';
import { ItemResponseType } from 'shared/consts';
import { SliderItemResponseValues } from 'shared/state';

import { ItemFormValues } from 'modules/Builder/types';
import { ItemConfigurationSettings } from '../../ItemConfiguration.types';
import { StyledAlert, StyledRow, StyledDescription, StyledSelectController } from './Alert.styles';
import { AlertProps } from './Alert.types';
import { getItemsList, getOptionsList, getSliderRowsItemList } from './Alert.utils';
import { minMaxValues } from './Alert.const';

export const Alert = ({ name, index, removeAlert }: AlertProps) => {
  const { t } = useTranslation('app');
  const { control, getValues, watch, setValue } = useFormContext();
  // const [sliderItems, setSliderItems] = useState<Option[]>([]);

  const alertName = `${name}.alerts.${index}`;
  const optionName = `${alertName}.optionId`;
  const rowName = `${alertName}.rowId`;

  const alert = watch(alertName);
  // const slider = watch(`${alertsName}.${index}.slider`);

  const { responseType, config: settings, responseValues } = getValues(name);
  // const sliderOptions = responseValues?.rows;

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
              />,
              <StyledSelectController
                name={`${rowName}`}
                control={control}
                placeholder={t('row')}
                options={getItemsList(getValues(name) as ItemFormValues, alert)}
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
              />,
              <StyledSelectController
                name={`${alertName}.value`}
                control={control}
                placeholder={t('option')}
                options={getSliderRowsItemList(
                  getValues(name) as ItemFormValues,
                  getValues(`${alertName}`),
                )}
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
                maxNumberValue={maxValue - 1}
                minNumberValue={minValue}
              />,
              <InputController
                type="number"
                control={control}
                name={`${alertName}.maxValue`}
                maxNumberValue={maxValue}
                minNumberValue={minValue + 1}
              />,
            ]}
          />
        );
    }
  };

  // useEffect(() => {
  //   setValue(`${alertsName}.${index}.item`, '');
  //   const sliderId = getValues().alerts?.[index]?.slider;
  //   const slider = sliderOptions?.filter(
  //     (sliderOption: SliderItemResponseValues) => sliderOption.id === sliderId,
  //   )[0];
  //   const { minValue, maxValue } = slider || minMaxValues;
  //   setSliderItems(getSliderOptions(minValue, maxValue));
  // }, [slider]);

  return (
    <StyledAlert>
      <StyledRow>
        <StyledTitleBoldSmall>
          {t('alert')} {index + 1}
        </StyledTitleBoldSmall>
        <StyledIconButton onClick={() => removeAlert(index)}>
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
      />
    </StyledAlert>
  );
};
