import { ChangeEvent, useEffect, useState } from 'react';
import { FieldError, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import get from 'lodash.get';

import { Table, UiType, Uploader, UploaderUiType } from 'shared/components';
import { InputController } from 'shared/components/FormComponents';
import { StyledBodyMedium, StyledFlexTopCenter, theme, variables } from 'shared/styles';
import {
  DEFAULT_SLIDER_MIN_NUMBER,
  DEFAULT_SLIDER_ROWS_MIN_NUMBER,
  SLIDER_LABEL_MAX_LENGTH,
  SLIDER_VALUE_LABEL_MAX_LENGTH,
} from 'modules/Builder/features/ActivityItems/ItemConfiguration/ItemConfiguration.const';
import { ItemConfigurationSettings } from 'modules/Builder/features/ActivityItems/ItemConfiguration/ItemConfiguration.types';
import { concatIf } from 'shared/utils';

import { Header } from './Header';
import { SliderInputType, SliderPanelProps } from './SliderPanel.types';
import {
  StyledInputContainer,
  StyledScoresContainer,
  StyledSlider,
  StyledSliderPanelContainer,
} from './SliderPanel.styles';
import {
  getHeadCells,
  getMarks,
  getStaticBodyRow,
  getStaticHeadRow,
  getTableRows,
  getMaxValue,
  getMinValue,
  setScoresAndAlertsChange,
} from './SliderPanel.utils';

const commonUploaderProps = {
  width: 5.6,
  height: 5.6,
  uiType: UploaderUiType.Secondary,
};

export const SliderPanel = ({
  name,
  label,
  index,
  isMultiple = false,
  onRemove,
}: SliderPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [error, setError] = useState<FieldError | undefined>();

  const sliderName = `${name}.responseValues${isMultiple ? `.rows.${index}` : ''}`;
  const alertsName = `${name}.alerts`;
  const minValueName = `${sliderName}.minValue`;
  const maxValueName = `${sliderName}.maxValue`;
  const scoresName = `${sliderName}.scores`;

  const { t } = useTranslation('app');

  const { control, watch, setValue, getFieldState, formState } = useFormContext();

  const scoresError = getFieldState(`${sliderName}.scores`, formState);

  const { id, minValue, maxValue, scores } = watch(sliderName) || {};
  const settings = watch(`${name}.config`);
  const alerts = watch(alertsName);

  const hasTickMarks = get(settings, ItemConfigurationSettings.HasTickMarks);
  const hasTickMarksLabels = get(settings, ItemConfigurationSettings.HasTickMarksLabels);
  const hasScores = get(settings, ItemConfigurationSettings.HasScores);
  const hasAlerts = get(settings, ItemConfigurationSettings.HasAlerts);
  const defaultMinNumberValue = isMultiple
    ? DEFAULT_SLIDER_ROWS_MIN_NUMBER
    : DEFAULT_SLIDER_MIN_NUMBER;

  const handleCollapse = () => setIsExpanded((prevExpanded) => !prevExpanded);

  const commonInputProps = {
    control,
    type: 'number',
  };
  const commonSetScoresProps = {
    scores,
    alerts,
    setValue,
    scoresName,
    alertsName,
    hasAlerts,
  };
  const commonSetScoresMinProps = {
    maxValue,
    type: SliderInputType.MinValue,
  };
  const commonSetScoresMaxProps = {
    minValue,
    type: SliderInputType.MaxValue,
  };

  const handleMinValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value === '' ? DEFAULT_SLIDER_MIN_NUMBER : +event.target.value;
    value = getMinValue(value, maxValue, defaultMinNumberValue);
    setValue(minValueName, value);
    setScoresAndAlertsChange({
      minValue: value,
      ...commonSetScoresMinProps,
      ...commonSetScoresProps,
    });
  };

  const handleMinValueArrowPress = (value: number) => {
    const newValue = getMinValue(value, maxValue, defaultMinNumberValue);
    setValue(minValueName, newValue);
    setScoresAndAlertsChange({
      minValue: newValue,
      ...commonSetScoresMinProps,
      ...commonSetScoresProps,
    });
  };

  const handleMaxValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value === '' ? minValue : +event.target.value;
    value = getMaxValue(value, minValue);
    setValue(maxValueName, value);
    setScoresAndAlertsChange({
      maxValue: value,
      ...commonSetScoresMaxProps,
      ...commonSetScoresProps,
    });
  };

  const handleMaxValueArrowPress = (value: number) => {
    const newValue = getMaxValue(value, minValue);
    setValue(maxValueName, newValue);
    setScoresAndAlertsChange({
      maxValue: newValue,
      ...commonSetScoresMaxProps,
      ...commonSetScoresProps,
    });
  };

  const marks = hasTickMarks && getMarks(minValue, maxValue, hasTickMarksLabels);
  const dataTestid = concatIf(
    'builder-activity-items-item-configuration-slider',
    `-rows-${index}`,
    isMultiple,
  );

  useEffect(() => {
    const errors = scoresError.error as unknown as FieldError[] | undefined;
    setError(errors?.filter((error) => error)?.[0]);
  }, [scoresError]);

  return (
    <StyledSliderPanelContainer
      in={isExpanded}
      key={`slider-container-${id}`}
      collapsedSize="12.8rem"
      timeout={0}
    >
      <Header
        name={name}
        label={label}
        index={index}
        isExpanded={isExpanded}
        onArrowClick={handleCollapse}
        onTrashClick={onRemove}
        isMultiple={isMultiple}
      />
      {isExpanded && (
        <>
          {isMultiple && (
            <StyledInputContainer sx={{ mb: theme.spacing(2.4) }}>
              <InputController
                control={control}
                name={`${sliderName}.label`}
                label={t('sliderLabel')}
                maxLength={SLIDER_LABEL_MAX_LENGTH}
                data-testid={`${dataTestid}-label`}
              />
            </StyledInputContainer>
          )}
          <StyledInputContainer>
            <InputController
              control={control}
              name={`${sliderName}.minLabel`}
              label={t('minLabel')}
              maxLength={SLIDER_VALUE_LABEL_MAX_LENGTH}
              data-testid={`${dataTestid}-min-label`}
            />
            <InputController
              control={control}
              name={`${sliderName}.maxLabel`}
              label={t('maxLabel')}
              maxLength={SLIDER_VALUE_LABEL_MAX_LENGTH}
              data-testid={`${dataTestid}-max-label`}
            />
          </StyledInputContainer>
          <StyledFlexTopCenter sx={{ p: theme.spacing(2.4, 0.8) }}>
            <StyledSlider
              min={minValue}
              max={maxValue}
              value={minValue}
              marks={marks}
              disabled
              data-testid={`${dataTestid}-slider`}
            />
          </StyledFlexTopCenter>
          <StyledInputContainer>
            <StyledFlexTopCenter sx={{ flexGrow: 1, gap: '1.2rem' }}>
              <Uploader
                {...commonUploaderProps}
                setValue={(val: string) => setValue(`${sliderName}.minImage`, val || undefined)}
                getValue={() => watch(`${sliderName}.minImage`) || ''}
                data-testid={`${dataTestid}-min-image`}
              />
              <InputController
                {...commonInputProps}
                name={`${sliderName}.minValue`}
                label={t('minValue')}
                onChange={handleMinValueChange}
                onArrowPress={handleMinValueArrowPress}
                withDebounce
                data-testid={`${dataTestid}-min-value`}
              />
            </StyledFlexTopCenter>
            <StyledFlexTopCenter sx={{ flexGrow: 1, gap: '1.2rem' }}>
              <Uploader
                {...commonUploaderProps}
                setValue={(val: string) => setValue(`${sliderName}.maxImage`, val || undefined)}
                getValue={() => watch(`${sliderName}.maxImage`) || ''}
                data-testid={`${dataTestid}-max-image`}
              />
              <InputController
                {...commonInputProps}
                name={`${sliderName}.maxValue`}
                label={t('maxValue')}
                onChange={handleMaxValueChange}
                onArrowPress={handleMaxValueArrowPress}
                withDebounce
                data-testid={`${dataTestid}-max-value`}
              />
            </StyledFlexTopCenter>
          </StyledInputContainer>
          {hasScores && (
            <>
              <StyledScoresContainer>
                <Table
                  columns={getStaticHeadRow()}
                  rows={getStaticBodyRow()}
                  orderBy="0"
                  uiType={UiType.Secondary}
                />
                <Table
                  columns={getHeadCells(minValue, maxValue)}
                  rows={getTableRows(scores, sliderName, `${dataTestid}-scores-table`)}
                  orderBy="0"
                  uiType={UiType.Secondary}
                  data-testid={`${dataTestid}-scores-table`}
                />
              </StyledScoresContainer>
              {error && (
                <StyledBodyMedium color={variables.palette.semantic.error}>
                  {error.message}
                </StyledBodyMedium>
              )}
            </>
          )}
        </>
      )}
    </StyledSliderPanelContainer>
  );
};
