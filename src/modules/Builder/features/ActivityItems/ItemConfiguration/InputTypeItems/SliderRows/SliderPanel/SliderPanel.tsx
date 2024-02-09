import { ChangeEvent, useState } from 'react';

import get from 'lodash.get';
import { useTranslation } from 'react-i18next';

import {
  DEFAULT_SLIDER_MIN_NUMBER,
  DEFAULT_SLIDER_ROWS_MIN_NUMBER,
  DEFAULT_SLIDER_MAX_VALUE,
  DEFAULT_SLIDER_MAX_NUMBER,
} from 'modules/Builder/consts';
import { ItemConfigurationSettings } from 'modules/Builder/features/ActivityItems/ItemConfiguration/ItemConfiguration.types';
import { useCustomFormContext } from 'modules/Builder/hooks';
import { useFieldLengthError } from 'modules/Builder/hooks/useFieldLengthError';
import { getDefaultSliderScores } from 'modules/Builder/utils/getDefaultSliderScores';
import { Table, UiType, Uploader, UploaderUiType } from 'shared/components';
import { InputController } from 'shared/components/FormComponents';
import { StyledBodySmall, StyledFlexTopCenter, theme, variables } from 'shared/styles';
import { concatIf } from 'shared/utils';

import { Header } from './Header';
import { SLIDER_LABEL_MAX_LENGTH, SLIDER_VALUE_LABEL_MAX_LENGTH } from './SliderPanel.const';
import {
  StyledInputContainer,
  StyledScoresContainer,
  StyledSlider,
  StyledSliderPanelContainer,
  StyledTable,
} from './SliderPanel.styles';
import { SliderInputType, SliderPanelProps } from './SliderPanel.types';
import {
  getHeadCells,
  getMarks,
  getStaticBodyRow,
  getStaticHeadRow,
  getTableRows,
  setScoresAndAlertsChange,
} from './SliderPanel.utils';

const commonUploaderProps = {
  width: 5.6,
  height: 5.6,
  uiType: UploaderUiType.Secondary,
};

export const SliderPanel = ({ name, label, index, isMultiple = false, onRemove }: SliderPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const sliderName = `${name}.responseValues${isMultiple ? `.rows.${index}` : ''}`;
  const alertsName = `${name}.alerts`;
  const minValueName = `${sliderName}.minValue`;
  const maxValueName = `${sliderName}.maxValue`;
  const scoresName = `${sliderName}.scores`;
  const sliderLabelName = `${sliderName}.label`;
  const sliderMinLabelName = `${sliderName}.minLabel`;
  const sliderMaxLabelName = `${sliderName}.maxLabel`;

  const { t } = useTranslation('app');

  const {
    control,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useCustomFormContext();

  const { id, minValue, maxValue, scores } = watch(sliderName) || {};
  const settings = watch(`${name}.config`);
  const alerts = watch(alertsName);

  const hasTickMarks = get(settings, ItemConfigurationSettings.HasTickMarks);
  const hasTickMarksLabels = get(settings, ItemConfigurationSettings.HasTickMarksLabels);
  const hasScores = get(settings, ItemConfigurationSettings.HasScores);
  const hasAlerts = get(settings, ItemConfigurationSettings.HasAlerts);
  const defaultMinNumberValue = isMultiple ? DEFAULT_SLIDER_ROWS_MIN_NUMBER : DEFAULT_SLIDER_MIN_NUMBER;

  const handleCollapse = () => setIsExpanded((prevExpanded) => !prevExpanded);
  const validationCheck =
    minValue !== '' &&
    maxValue !== '' &&
    minValue < maxValue &&
    minValue >= defaultMinNumberValue &&
    maxValue <= DEFAULT_SLIDER_MAX_NUMBER;

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

  const tableColumns = validationCheck
    ? getHeadCells(minValue, maxValue)
    : getHeadCells(defaultMinNumberValue, DEFAULT_SLIDER_MAX_VALUE);

  const setDefaultScoresAndAlerts = () => {
    hasScores &&
      setValue(
        scoresName,
        getDefaultSliderScores({
          minValue: defaultMinNumberValue,
          maxValue: DEFAULT_SLIDER_MAX_VALUE,
        }),
      );
    hasAlerts && setValue(`${alertsName}.${index}.value`, '');
  };

  const handleMinValueChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value === '' ? '' : +event.target.value;
    await setValue(minValueName, value);
    clearErrors([minValueName, maxValueName]);
    if (value !== '' && value < maxValue && value >= defaultMinNumberValue && maxValue <= DEFAULT_SLIDER_MAX_NUMBER) {
      setScoresAndAlertsChange({
        minValue: value,
        ...commonSetScoresMinProps,
        ...commonSetScoresProps,
      });

      return;
    }

    setDefaultScoresAndAlerts();
  };

  const handleMinValueArrowPress = (value: number) => {
    setValue(minValueName, value);
    clearErrors([minValueName, maxValueName]);
    if (value < maxValue && value >= defaultMinNumberValue && maxValue <= DEFAULT_SLIDER_MAX_NUMBER) {
      setScoresAndAlertsChange({
        minValue: value,
        ...commonSetScoresMinProps,
        ...commonSetScoresProps,
      });

      return;
    }

    setDefaultScoresAndAlerts();
  };

  const handleMaxValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value === '' ? '' : +event.target.value;
    clearErrors([minValueName, maxValueName]);
    setValue(maxValueName, value);
    if (value !== '' && value > minValue && value <= DEFAULT_SLIDER_MAX_NUMBER && minValue >= defaultMinNumberValue) {
      setScoresAndAlertsChange({
        maxValue: value,
        ...commonSetScoresMaxProps,
        ...commonSetScoresProps,
      });

      return;
    }

    setDefaultScoresAndAlerts();
  };

  const handleMaxValueArrowPress = (value: number) => {
    setValue(maxValueName, value);
    clearErrors([minValueName, maxValueName]);
    if (value > minValue && value <= DEFAULT_SLIDER_MAX_NUMBER && minValue >= defaultMinNumberValue) {
      setScoresAndAlertsChange({
        maxValue: value,
        ...commonSetScoresMaxProps,
        ...commonSetScoresProps,
      });

      return;
    }

    setDefaultScoresAndAlerts();
  };

  const marks =
    hasTickMarks &&
    getMarks(
      validationCheck ? minValue : defaultMinNumberValue,
      validationCheck ? maxValue : DEFAULT_SLIDER_MAX_VALUE,
      hasTickMarksLabels,
    );
  const dataTestid = concatIf('builder-activity-items-item-configuration-slider', `-rows-${index}`, isMultiple);

  const handleLabelChange = useFieldLengthError();

  const fromToHintText = t('fromToHint', {
    min: defaultMinNumberValue,
    max: DEFAULT_SLIDER_MAX_NUMBER,
  });

  const scoresError = get(errors, `${sliderName}.scores`);

  return (
    <StyledSliderPanelContainer
      in={isExpanded}
      key={`slider-container-${id}`}
      collapsedSize="12.8rem"
      timeout={0}
      data-testid={`${dataTestid}-panel`}>
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
                name={sliderLabelName}
                label={t('sliderLabel')}
                onChange={(event) =>
                  handleLabelChange({
                    event,
                    fieldName: sliderLabelName,
                    maxLength: SLIDER_LABEL_MAX_LENGTH,
                  })
                }
                maxLength={SLIDER_LABEL_MAX_LENGTH}
                data-testid={`${dataTestid}-label`}
              />
            </StyledInputContainer>
          )}
          <StyledInputContainer>
            <InputController
              control={control}
              name={sliderMinLabelName}
              label={t('minLabel')}
              onChange={(event) =>
                handleLabelChange({
                  event,
                  fieldName: sliderMinLabelName,
                  maxLength: SLIDER_VALUE_LABEL_MAX_LENGTH,
                })
              }
              maxLength={SLIDER_VALUE_LABEL_MAX_LENGTH}
              data-testid={`${dataTestid}-min-label`}
            />
            <InputController
              control={control}
              name={sliderMaxLabelName}
              label={t('maxLabel')}
              onChange={(event) =>
                handleLabelChange({
                  event,
                  fieldName: sliderMaxLabelName,
                  maxLength: SLIDER_VALUE_LABEL_MAX_LENGTH,
                })
              }
              maxLength={SLIDER_VALUE_LABEL_MAX_LENGTH}
              data-testid={`${dataTestid}-max-label`}
            />
          </StyledInputContainer>
          <StyledFlexTopCenter sx={{ p: theme.spacing(2.4, 0.8) }}>
            <StyledSlider
              min={validationCheck ? minValue : defaultMinNumberValue}
              max={validationCheck ? maxValue : DEFAULT_SLIDER_MAX_VALUE}
              value={validationCheck ? minValue : defaultMinNumberValue}
              marks={marks}
              disabled
              data-testid={`${dataTestid}-slider`}
            />
          </StyledFlexTopCenter>
          <StyledInputContainer sx={{ mb: theme.spacing(3) }}>
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
                hintText={fromToHintText}
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
                hintText={fromToHintText}
                data-testid={`${dataTestid}-max-value`}
              />
            </StyledFlexTopCenter>
          </StyledInputContainer>
          {hasScores && (
            <>
              <StyledScoresContainer>
                <Table columns={getStaticHeadRow()} rows={getStaticBodyRow()} orderBy="0" uiType={UiType.Secondary} />
                <StyledTable
                  columns={tableColumns}
                  rows={getTableRows(scores, sliderName, `${dataTestid}-scores-table`)}
                  orderBy="0"
                  uiType={UiType.Secondary}
                  data-testid={`${dataTestid}-scores-table`}
                />
              </StyledScoresContainer>
              {scoresError && (
                <StyledBodySmall sx={{ p: theme.spacing(0.5, 0, 0, 0) }} color={variables.palette.semantic.error}>
                  {t('numberValueIsRequired')}
                </StyledBodySmall>
              )}
            </>
          )}
        </>
      )}
    </StyledSliderPanelContainer>
  );
};
