import { useState, useRef, ChangeEvent } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ColorResult } from 'react-color';

import { Actions, Svg } from 'shared/components';
import { InputController } from 'shared/components/FormComponents';
import {
  theme,
  variables,
  StyledBodyLarge,
  StyledBodyMedium,
  StyledClearedButton,
  StyledFlexColumn,
  StyledFlexTopCenter,
  StyledLabelBoldLarge,
} from 'shared/styles';
import { ItemResponseType } from 'shared/state';
import { falseReturnFunc } from 'shared/utils';

import { ItemConfigurationForm, ItemConfigurationSettings } from '../../ItemConfiguration.types';
import { SELECTION_OPTION_TEXT_MAX_LENGTH } from '../../ItemConfiguration.const';
import { getPaletteColor } from '../../ItemConfiguration.utils';
import { ColorPicker } from './ColorPicker';
import {
  StyledCollapsedWrapper,
  StyledImg,
  StyledItemOption,
  StyledScoreWrapper,
  StyledSvgWrapper,
  StyledTextInputWrapper,
  StyledTooltipWrapper,
} from './SelectionOption.styles';
import { SelectionOptionProps } from './SelectionOption.types';
import { getActions, getUploaderComponent } from './SelectionOption.utils';
import { useSetSelectionOptionValue } from './SelectionOption.hooks';

export const SelectionOption = ({
  onRemoveOption,
  onUpdateOption,
  index,
  optionsLength,
}: SelectionOptionProps) => {
  const { t } = useTranslation('app');
  const [optionOpen, setOptionOpen] = useState(true);
  const [visibleActions, setVisibleActions] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const { setValue, watch, control, getValues } = useFormContext<ItemConfigurationForm>();
  const settings = watch('settings');
  const selectedInputType = watch('itemsInputType');
  const option = watch(`options.${index}`);
  const palette = watch('paletteName');
  const imageSrc = watch(`options.${index}.image`);
  const hasScoresChecked = settings?.includes(ItemConfigurationSettings.HasScores);
  const hasTooltipsChecked = settings?.includes(ItemConfigurationSettings.HasTooltips);
  const hasColorPicker = settings?.includes(ItemConfigurationSettings.HasColorPalette);
  const { text = '', isVisible = true, score, tooltip, color } = option || {};
  const scoreString = score?.toString();
  const hasTooltip = tooltip !== undefined;
  const hasColor = color !== undefined;
  const hasPalette = !!palette;
  const isColorSet = color?.hex !== '';
  const actionsRef = useRef(null);
  const isSingleSelection = selectedInputType === ItemResponseType.SingleSelection;

  const handleOptionToggle = () => setOptionOpen((prevState) => !prevState);
  const handlePopoverClose = () => setAnchorEl(null);
  const handleColorChange = () => {
    const settings = getValues('settings');
    if (settings?.includes(ItemConfigurationSettings.HasColorPalette)) {
      setValue('paletteName', '');
    }
  };

  const scoreName = `options.${index}.score` as `options.${number}.score`;

  const handleScoreChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === '') return setValue(scoreName, 0);

    setValue(scoreName, +event.target.value);
  };

  const actions = {
    optionHide: () => setValue(`options.${index}.isVisible`, !isVisible),
    paletteClick: () => actionsRef.current && setAnchorEl(actionsRef.current),
    optionRemove: () => {
      onRemoveOption(index);
      if (hasColorPicker && hasPalette) {
        const options = getValues('options');
        options?.forEach((option, index) => {
          onUpdateOption(index, {
            ...option,
            color: {
              hex: getPaletteColor(palette, index),
            } as ColorResult,
          });
        });
      }
    },
  };

  const commonInputProps = {
    control,
    fullWidth: true,
  };

  useSetSelectionOptionValue({
    option,
    onUpdateOption,
    index,
    hasScoresChecked,
    scoreString,
    hasTooltipsChecked,
    hasTooltip,
    hasColorPicker,
    hasColor,
  });

  return (
    <>
      <StyledItemOption
        onMouseEnter={optionOpen ? falseReturnFunc : () => setVisibleActions(true)}
        onMouseLeave={optionOpen ? falseReturnFunc : () => setVisibleActions(false)}
        optionOpen={optionOpen}
        leftBorderColor={color?.hex}
      >
        <StyledFlexTopCenter sx={{ justifyContent: 'space-between' }}>
          <StyledFlexTopCenter sx={{ mr: theme.spacing(1) }}>
            <StyledClearedButton onClick={handleOptionToggle}>
              <Svg id={optionOpen ? 'navigate-up' : 'navigate-down'} />
            </StyledClearedButton>
            <StyledLabelBoldLarge sx={{ ml: theme.spacing(2) }}>{`${t('option')} ${
              index + 1
            }`}</StyledLabelBoldLarge>
            {!optionOpen && (
              <StyledCollapsedWrapper>
                <StyledSvgWrapper sx={{ m: theme.spacing(0, 2, 0, 6) }}>
                  <Svg
                    id={isSingleSelection ? 'radio-button-outline' : 'checkbox-multiple-filled'}
                  />
                </StyledSvgWrapper>
                {imageSrc && <StyledImg src={imageSrc} alt="option-image" />}
                {text && (
                  <StyledBodyLarge sx={{ ml: imageSrc ? theme.spacing(1) : 0 }}>
                    {text}
                  </StyledBodyLarge>
                )}
              </StyledCollapsedWrapper>
            )}
          </StyledFlexTopCenter>
          <StyledFlexTopCenter ref={actionsRef}>
            <Actions
              items={getActions({ actions, isVisible, hasColorPicker, isColorSet, optionsLength })}
              context={option}
              visibleByDefault={optionOpen || visibleActions}
            />
          </StyledFlexTopCenter>
        </StyledFlexTopCenter>
        {optionOpen && (
          <StyledFlexColumn>
            <StyledFlexTopCenter sx={{ m: theme.spacing(1.5, 0, hasTooltipsChecked ? 4 : 2.4) }}>
              <StyledSvgWrapper sx={{ mr: theme.spacing(2) }}>
                <Svg id={isSingleSelection ? 'radio-button-outline' : 'checkbox-multiple-filled'} />
              </StyledSvgWrapper>
              {getUploaderComponent(setValue, index, imageSrc)}
              <StyledTextInputWrapper hasScores={!!scoreString}>
                <InputController
                  {...commonInputProps}
                  name={`options.${index}.text`}
                  label={t('optionText')}
                  maxLength={SELECTION_OPTION_TEXT_MAX_LENGTH}
                />
              </StyledTextInputWrapper>
              {scoreString && (
                <StyledScoreWrapper>
                  <InputController
                    {...commonInputProps}
                    name={scoreName}
                    type="number"
                    label={t('score')}
                    minNumberValue={Number.MIN_SAFE_INTEGER}
                    onChange={handleScoreChange}
                  />
                </StyledScoreWrapper>
              )}
            </StyledFlexTopCenter>
            {hasTooltipsChecked && (
              <StyledTooltipWrapper>
                <InputController
                  {...commonInputProps}
                  label={t('tooltip')}
                  name={`options.${index}.tooltip`}
                />
                <StyledBodyMedium
                  color={variables.palette.on_surface_variant}
                  sx={{ mr: theme.spacing(1.5) }}
                >
                  {t('supportingText')}
                </StyledBodyMedium>
              </StyledTooltipWrapper>
            )}
          </StyledFlexColumn>
        )}
      </StyledItemOption>
      {anchorEl && (
        <ColorPicker
          anchorEl={anchorEl}
          handleColorChange={handleColorChange}
          handlePopoverClose={handlePopoverClose}
          name={`options.${index}.color`}
        />
      )}
    </>
  );
};
