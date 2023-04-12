import { useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { Svg } from 'shared/components';
import { InputController, Option, SelectController } from 'shared/components/FormComponents';
import { StyledTitleBoldSmall, StyledIconButton, variables } from 'shared/styles';
import { ItemResponseType } from 'shared/consts';
import { SliderItemResponseValues } from 'shared/state';

import { ItemFormValues } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.types';
import { ItemConfigurationForm } from '../../ItemConfiguration.types';
import { ItemConfigurationSettings } from '../../ItemConfiguration.types';
import { StyledAlert, StyledRow, StyledDescription } from './Alert.styles';
import { AlertProps } from './Alert.types';
import { getItemsList, getOptionsList, getSliderOptions } from './Alert.utils';
import { minMaxValues } from './Alert.const';

export const Alert = ({ name, index, removeAlert }: AlertProps) => {
  const { t } = useTranslation('app');
  const { control, getValues, watch, setValue } = useFormContext();
  const [sliderItems, setSliderItems] = useState<Option[]>([]);

  const alertsName = `${name}.alerts`;
  const slider = watch(`${alertsName}.${index}.slider`);

  const { responseType, config: settings, responseValues } = getValues(name);
  const sliderOptions = responseValues?.rows;

  const renderAlertContent = () => {
    switch (responseType) {
      case ItemResponseType.SingleSelection:
      case ItemResponseType.MultipleSelection:
        return (
          <Trans
            i18nKey="alertSingleMultipleNonContinuousSlider"
            components={[
              <SelectController
                name={`${alertsName}.${index}.option`}
                control={control}
                options={getOptionsList(getValues() as ItemFormValues)}
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
              <SelectController
                name={`${alertsName}.${index}.option`}
                control={control}
                options={getOptionsList(getValues() as ItemFormValues)}
              />,
              <SelectController
                name={`${alertsName}.${index}.item`}
                control={control}
                options={getItemsList(getValues() as ItemFormValues)}
              />,
            ]}
          />
        );
      case ItemResponseType.SliderRows:
        return (
          <Trans
            i18nKey="alertSliderRows"
            components={[
              <SelectController
                name={`${alertsName}.${index}.slider`}
                control={control}
                options={getOptionsList(getValues() as ItemFormValues)}
              />,
              <SelectController
                name={`${alertsName}.${index}.item`}
                control={control}
                options={sliderItems}
              />,
            ]}
          />
        );
      case ItemResponseType.Slider:
        // eslint-disable-next-line no-case-declarations
        const { minValue, maxValue } = sliderOptions?.[0] || minMaxValues;

        if (!settings?.includes(ItemConfigurationSettings.IsContinuous)) {
          return (
            <Trans
              i18nKey="alertSingleMultipleNonContinuousSlider"
              components={[
                <InputController
                  type="number"
                  control={control}
                  name={`${alertsName}.${index}.option`}
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
                name={`${alertsName}.${index}.min`}
                maxNumberValue={maxValue - 1}
                minNumberValue={minValue}
              />,
              <InputController
                type="number"
                control={control}
                name={`${alertsName}.${index}.max`}
                maxNumberValue={maxValue}
                minNumberValue={minValue + 1}
              />,
            ]}
          />
        );
    }
  };

  useEffect(() => {
    setValue(`${alertsName}.${index}.item`, '');
    const sliderId = getValues().alerts?.[index]?.slider;
    const slider = sliderOptions?.filter(
      (sliderOption: SliderItemResponseValues) => sliderOption.id === sliderId,
    )[0];
    const { minValue, maxValue } = slider || minMaxValues;
    setSliderItems(getSliderOptions(minValue, maxValue));
  }, [slider]);

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
        name={`${alertsName}.${index}.message`}
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
