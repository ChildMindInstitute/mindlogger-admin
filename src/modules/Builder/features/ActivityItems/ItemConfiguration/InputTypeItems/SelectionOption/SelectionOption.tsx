import { useState, useRef, ChangeEvent } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ColorResult } from 'react-color';
import get from 'lodash.get';

import { Actions, Svg, Uploader, UploaderUiType } from 'shared/components';
import { InputController } from 'shared/components/FormComponents';
import {
  theme,
  StyledBodyLarge,
  StyledClearedButton,
  StyledFlexColumn,
  StyledFlexTopCenter,
  StyledLabelBoldLarge,
} from 'shared/styles';
import { ItemResponseType } from 'shared/consts';
import { falseReturnFunc, getEntityKey, getObjectFromList } from 'shared/utils';
import { SingleAndMultipleSelectionOption, ConditionalLogic } from 'shared/state';
import { useCurrentActivity } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.hooks';

import { ItemConfigurationSettings } from '../../ItemConfiguration.types';
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
import { getActions, getDependentConditions } from './SelectionOption.utils';
import { useSetSelectionOptionValue } from './SelectionOption.hooks';
import { RemoveOptionPopup } from './RemoveOptionPopup';

export const SelectionOption = ({
  name,
  onRemoveOption,
  onUpdateOption,
  index,
  optionsLength,
}: SelectionOptionProps) => {
  const optionName = `${name}.responseValues.options.${index}`;
  const { t } = useTranslation('app');
  const [optionOpen, setOptionOpen] = useState(true);
  const [indexToRemove, setIndexToRemove] = useState(-1);
  const [visibleActions, setVisibleActions] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const { setValue, watch, control, getValues } = useFormContext();
  const { fieldName, activity } = useCurrentActivity();
  const [settings, responseType, option] = useWatch({
    control,
    name: [`${name}.config`, `${name}.responseType`, `${optionName}`],
  });
  const palette = watch(`${name}.responseValues.paletteName`);
  const imageSrc = watch(`${optionName}.image`);
  const hasScoresChecked = get(settings, ItemConfigurationSettings.HasScores);
  const hasTooltipsChecked = get(settings, ItemConfigurationSettings.HasTooltips);
  const hasColorPicker = get(settings, ItemConfigurationSettings.HasColorPalette);
  const { text = '', isHidden = false, score, tooltip, color } = option || {};
  const scoreString = score?.toString();
  const hasTooltip = tooltip !== undefined;
  const hasColor = color !== undefined;
  const hasPalette = !!palette;
  const isColorSet = color?.hex !== '';
  const actionsRef = useRef(null);
  const isSingleSelection = responseType === ItemResponseType.SingleSelection;
  const dependentConditions = getDependentConditions(
    getEntityKey(option),
    activity?.conditionalLogic,
  );
  const groupedConditions = getObjectFromList(dependentConditions);

  const handleOptionToggle = () => setOptionOpen((prevState) => !prevState);
  const handlePopoverClose = () => setAnchorEl(null);
  const handleRemoveModalClose = () => setIndexToRemove(-1);
  const handleColorChange = () => {
    const settings = getValues(`${name}.config`);

    if (get(settings, ItemConfigurationSettings.HasColorPalette)) {
      setValue(`${name}.responseValues.paletteName`, undefined);
    }
  };

  const scoreName = `${optionName}.score`;

  const handleScoreChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === '') return setValue(scoreName, 0);

    setValue(scoreName, +event.target.value);
  };
  const handleRemoveOption = (index: number) => {
    onRemoveOption(index);

    if (hasColorPicker && hasPalette) {
      const options = getValues(`${name}.responseValues.options`);
      options?.forEach((option: SingleAndMultipleSelectionOption, index: number) => {
        onUpdateOption(index, {
          ...option,
          color: {
            hex: getPaletteColor(palette, index),
          } as ColorResult,
        });
      });
    }
  };
  const handleRemoveConditions = () => {
    const conditionalLogic = getValues(`${fieldName}.conditionalLogic`);

    setValue(
      `${fieldName}.conditionalLogic`,
      conditionalLogic?.filter(({ key }: ConditionalLogic) => !groupedConditions[key ?? '']),
    );
  };
  const handleSubmitRemove = () => {
    handleRemoveConditions();
    handleRemoveOption(indexToRemove);
    handleRemoveModalClose();
  };

  const actions = {
    optionHide: () => setValue(`${optionName}.isHidden`, !isHidden),
    paletteClick: () => actionsRef.current && setAnchorEl(actionsRef.current),
    optionRemove: () => {
      !dependentConditions?.length ? handleRemoveOption(index) : setIndexToRemove(index);
    },
  };

  const commonInputProps = {
    control,
    fullWidth: true,
  };

  useSetSelectionOptionValue({
    name: optionName,
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
              items={getActions({ actions, isHidden, hasColorPicker, isColorSet, optionsLength })}
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
              <StyledFlexTopCenter sx={{ mr: theme.spacing(1) }}>
                <Uploader
                  uiType={UploaderUiType.Secondary}
                  width={5.6}
                  height={5.6}
                  setValue={(val: string) => setValue(`${optionName}.image`, val || undefined)}
                  getValue={() => imageSrc || ''}
                />
              </StyledFlexTopCenter>
              <StyledTextInputWrapper hasScores={!!scoreString}>
                <InputController
                  {...commonInputProps}
                  name={`${optionName}.text`}
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
                  name={`${optionName}.tooltip`}
                />
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
          name={`${optionName}.color`}
        />
      )}
      {indexToRemove !== -1 && (
        <RemoveOptionPopup
          name={optionName}
          conditions={dependentConditions}
          onClose={handleRemoveModalClose}
          onSubmit={handleSubmitRemove}
        />
      )}
    </>
  );
};
