import { useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { Svg } from 'shared/components';
import { InputController, Option, SelectController } from 'shared/components/FormComponents';
import { StyledTitleBoldSmall, StyledIconButton, variables } from 'shared/styles';
import { ItemResponseType } from 'shared/consts';

import { ItemConfigurationForm } from '../../ItemConfiguration.types';
import { ItemConfigurationSettings } from '../../ItemConfiguration.types';
import { StyledAlert, StyledRow, StyledDescription } from './Alert.styles';
import { AlertProps } from './Alert.types';
import { getItemsList, getOptionsList, getSliderOptions } from './Alert.utils';
import { minMaxValues } from './Alert.const';

export const Alert = ({ index, removeAlert }: AlertProps) => {
  const { t } = useTranslation('app');
  const { control, getValues, watch, setValue } = useFormContext<ItemConfigurationForm>();
  const [sliderItems, setSliderItems] = useState<Option[]>([]);

  const slider = watch(`alerts.${index}.slider`);

  const { itemsInputType, settings, sliderOptions } = getValues();

  const renderAlertContent = () => {
    switch (itemsInputType) {
      case ItemResponseType.SingleSelection:
      case ItemResponseType.MultipleSelection:
        return (
          <Trans
            i18nKey="alertSingleMultipleNonContinuousSlider"
            components={[
              <SelectController
                name={`alerts.${index}.option`}
                control={control}
                options={getOptionsList(getValues())}
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
                name={`alerts.${index}.option`}
                control={control}
                options={getOptionsList(getValues())}
              />,
              <SelectController
                name={`alerts.${index}.item`}
                control={control}
                options={getItemsList(getValues())}
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
                name={`alerts.${index}.slider`}
                control={control}
                options={getOptionsList(getValues())}
              />,
              <SelectController
                name={`alerts.${index}.item`}
                control={control}
                options={sliderItems}
              />,
            ]}
          />
        );
      case ItemResponseType.Slider:
        // eslint-disable-next-line no-case-declarations
        const { min, max } = sliderOptions?.[0] || minMaxValues;

        if (!settings?.includes(ItemConfigurationSettings.IsContinuous)) {
          return (
            <Trans
              i18nKey="alertSingleMultipleNonContinuousSlider"
              components={[
                <InputController
                  type="number"
                  control={control}
                  name={`alerts.${index}.option`}
                  maxNumberValue={max}
                  minNumberValue={min}
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
                name={`alerts.${index}.min`}
                maxNumberValue={max - 1}
                minNumberValue={min}
              />,
              <InputController
                type="number"
                control={control}
                name={`alerts.${index}.max`}
                maxNumberValue={max}
                minNumberValue={min + 1}
              />,
            ]}
          />
        );
    }
  };

  useEffect(() => {
    setValue(`alerts.${index}.item`, '');
    const sliderId = getValues().alerts?.[index]?.slider;
    const slider = sliderOptions?.filter((sliderOption) => sliderOption.id === sliderId)[0];
    const { min, max } = slider || minMaxValues;
    setSliderItems(getSliderOptions(min, max));
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
        name={`alerts.${index}.message`}
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
