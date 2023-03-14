import { useState, useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ColorResult } from 'react-color';

import { Actions, Svg, Uploader, UploaderUiType } from 'shared/components';
import { InputController } from 'shared/components/FormComponents';
import theme from 'shared/styles/theme';
import {
  StyledBodyLarge,
  StyledBodyMedium,
  StyledClearedButton,
  StyledFlexColumn,
  StyledFlexTopCenter,
  StyledLabelBoldLarge,
} from 'shared/styles/styledComponents';
import { variables } from 'shared/styles/variables';

import { ItemConfigurationForm, ItemConfigurationSettings } from '../../ItemConfiguration.types';
import { DEFAULT_SCORE_VALUE } from '../../ItemConfiguration.const';
import { ColorPicker } from './ColorPicker';
import {
  StyledCollapsedWrapper,
  StyledItemOption,
  StyledScoreWrapper,
  StyledTextInputWrapper,
  StyledTooltipWrapper,
} from './SelectionOption.styles';
import { SelectionOptionProps } from './SelectionOption.types';
import { getActions, OPTION_TEXT_MAX_LENGTH } from './SelectionOption.const';

export const SelectionOption = ({
  onRemoveOption,
  onUpdateOption,
  index,
}: SelectionOptionProps) => {
  const { t } = useTranslation('app');
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { setValue, watch, control } = useFormContext<ItemConfigurationForm>();
  const settings = watch('settings');
  const option = watch(`options.${index}`);
  const { text, isVisible, score, tooltip, color } = option;
  const hasScoresChecked = settings?.includes(ItemConfigurationSettings.HasScores);
  const hasTooltipsChecked = settings?.includes(ItemConfigurationSettings.HasTooltips);
  const hasColorPicker = settings?.includes(ItemConfigurationSettings.HasColorPalette);
  const scoreString = score?.toString();
  const hasTooltip = tooltip !== undefined;
  const hasColor = color !== undefined;
  const isColorSet = color?.hex !== '';
  const actionsRef = useRef(null);

  const handleOptionToggle = () => setOpen((prevState) => !prevState);

  const handlePopoverClose = () => setAnchorEl(null);

  const actions = {
    optionHide: () => onUpdateOption(index, { ...option, isVisible: !isVisible }),
    paletteClick: () => actionsRef.current && setAnchorEl(actionsRef.current),
    optionRemove: () => onRemoveOption(index),
  };

  const commonInputProps = {
    control,
    fullWidth: true,
  };

  const imageComponent = (
    <StyledFlexTopCenter sx={{ mr: theme.spacing(1) }}>
      <Uploader
        uiType={UploaderUiType.Secondary}
        width={5.6}
        height={5.6}
        setValue={(val: string) => setValue(`options.${index}.image`, val)}
        getValue={() => watch(`options.${index}.image`) || ''}
      />
    </StyledFlexTopCenter>
  );

  const setOptionFieldValue = (
    checkedCondition: boolean,
    elementCondition: boolean,
    fieldName: string,
    defaultValue: string | number | ColorResult,
  ) =>
    checkedCondition
      ? !elementCondition && onUpdateOption(index, { ...option, [fieldName]: defaultValue })
      : elementCondition && onUpdateOption(index, { ...option, [fieldName]: undefined });

  useEffect(() => {
    setOptionFieldValue(hasScoresChecked, !!scoreString, 'score', DEFAULT_SCORE_VALUE);
  }, [hasScoresChecked, scoreString]);

  useEffect(() => {
    setOptionFieldValue(hasTooltipsChecked, hasTooltip, 'tooltip', '');
  }, [hasTooltipsChecked, hasTooltip]);

  useEffect(() => {
    setOptionFieldValue(hasColorPicker, hasColor, 'color', { hex: '' } as ColorResult);
  }, [hasColorPicker, hasColor]);

  return (
    <>
      <StyledItemOption leftBorderColor={color?.hex}>
        <StyledFlexTopCenter sx={{ justifyContent: 'space-between' }}>
          <StyledFlexTopCenter sx={{ mr: theme.spacing(1) }}>
            <StyledClearedButton onClick={handleOptionToggle}>
              <Svg id={open ? 'navigate-up' : 'navigate-down'} />
            </StyledClearedButton>
            <StyledLabelBoldLarge sx={{ ml: theme.spacing(2) }}>{`${t('option')} ${
              index + 1
            }`}</StyledLabelBoldLarge>
            {!open && (
              <StyledCollapsedWrapper>
                <StyledFlexTopCenter sx={{ m: theme.spacing(0, 2, 0, 6) }}>
                  <Svg id="radio-button-outline" />
                </StyledFlexTopCenter>
                {imageComponent}
                {text && <StyledBodyLarge>{text}</StyledBodyLarge>}
              </StyledCollapsedWrapper>
            )}
          </StyledFlexTopCenter>
          <StyledFlexTopCenter ref={actionsRef}>
            <Actions
              items={getActions({ actions, isVisible, hasColorPicker, isColorSet })}
              context={option}
              visibleByDefault={open}
            />
          </StyledFlexTopCenter>
        </StyledFlexTopCenter>
        {open && (
          <StyledFlexColumn>
            <StyledFlexTopCenter sx={{ m: theme.spacing(1.5, 0, hasTooltipsChecked ? 4 : 2.4) }}>
              <StyledFlexTopCenter sx={{ mr: theme.spacing(2) }}>
                <Svg id="radio-button-outline" />
              </StyledFlexTopCenter>
              {imageComponent}
              <StyledTextInputWrapper hasScores={!!scoreString}>
                <InputController
                  {...commonInputProps}
                  name={`options.${index}.text`}
                  label={t('optionText')}
                  maxLength={OPTION_TEXT_MAX_LENGTH}
                  inputProps={{ maxLength: OPTION_TEXT_MAX_LENGTH }}
                />
              </StyledTextInputWrapper>
              {scoreString && (
                <StyledScoreWrapper>
                  <InputController
                    {...commonInputProps}
                    name={`options.${index}.score`}
                    type="number"
                    label={t('score')}
                    minNumberValue={0}
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
          handlePopoverClose={handlePopoverClose}
          name={`options.${index}.color`}
        />
      )}
    </>
  );
};
