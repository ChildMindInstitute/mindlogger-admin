import { useState, ChangeEvent, useEffect } from 'react';
import { useFormContext, FieldError } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import get from 'lodash.get';

import { UploaderUiType, Uploader, Table, UiType } from 'shared/components';
import { InputController } from 'shared/components/FormComponents';
import { theme, StyledFlexTopCenter, StyledBodyMedium, variables } from 'shared/styles';
import {
  SLIDER_LABEL_MAX_LENGTH,
  DEFAULT_SLIDER_MIN_NUMBER,
  SLIDER_VALUE_LABEL_MAX_LENGTH,
  DEFAULT_SLIDER_MAX_VALUE,
  DEFAULT_SLIDER_MAX_NUMBER,
  DEFAULT_SLIDER_ROWS_MIN_NUMBER,
} from 'modules/Builder/features/ActivityItems/ItemConfiguration/ItemConfiguration.const';
import { ItemConfigurationSettings } from 'modules/Builder/features/ActivityItems/ItemConfiguration/ItemConfiguration.types';
import { ItemAlert } from 'shared/state';
import { concatIf } from 'shared/utils';

import { Header } from './Header';
import { SliderPanelProps } from './SliderPanel.types';
import {
  StyledSliderPanelContainer,
  StyledInputContainer,
  StyledScoresContainer,
  StyledSlider,
} from './SliderPanel.styles';
import {
  getHeadCells,
  getTableRows,
  getStaticHeadRow,
  getStaticBodyRow,
  getMarks,
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

  const { t } = useTranslation('app');

  const { control, watch, setValue, getValues, getFieldState, formState } = useFormContext();

  const scoresError = getFieldState(`${sliderName}.scores`, formState);

  const { id, minValue, maxValue, scores } = watch(sliderName) || {};
  const settings = watch(`${name}.config`);

  const hasTickMarks = get(settings, ItemConfigurationSettings.HasTickMarks);
  const hasTickMarksLabels = get(settings, ItemConfigurationSettings.HasTickMarksLabels);
  const hasScores = get(settings, ItemConfigurationSettings.HasScores);
  const hasAlerts = get(settings, ItemConfigurationSettings.HasAlerts);

  useEffect(() => {
    const subscription = watch((data, { name: attributeName }: { name?: string }) => {
      const option = getValues(sliderName);

      if (!option) return;

      const { minValue, maxValue, scores } = option;

      const scoresQuantity = maxValue - minValue + 1;

      if (attributeName === `${sliderName}.minValue`) {
        if (scores?.length < scoresQuantity) {
          setValue(`${sliderName}.scores`, [Math.min(...scores) - 1].concat(scores));
        }

        if (scores?.length > scoresQuantity) {
          setValue(`${sliderName}.scores`, scores?.slice(1));
        }

        if (hasAlerts) {
          const alerts = getValues(`${name}.alerts`);

          alerts?.forEach((alert: ItemAlert, index: number) => {
            if (alert.value! < minValue) setValue(`${name}.alerts.${index}.value`, minValue);
          });
        }
      }

      if (attributeName === `${sliderName}.maxValue`) {
        if (scores?.length < scoresQuantity) {
          setValue(`${sliderName}.scores`, scores.concat(Math.max(...scores) + 1));
        }

        if (scores?.length > scoresQuantity) {
          setValue(`${sliderName}.scores`, scores?.slice(0, scoresQuantity));
        }

        if (hasAlerts) {
          const alerts = getValues(`${name}.alerts`);

          alerts?.forEach((alert: ItemAlert, index: number) => {
            if (alert.value! > maxValue) setValue(`${name}.alerts.${index}.value`, maxValue);
          });
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleCollapse = () => setIsExpanded((prevExpanded) => !prevExpanded);

  const handleChangeMinScore = (event: ChangeEvent<HTMLInputElement>) => {
    const minScoreName = `${sliderName}.minValue`;
    const value = event.target.value;

    if (value === '') return setValue(minScoreName, DEFAULT_SLIDER_MIN_NUMBER);

    if (+value > maxValue - 1) return setValue(minScoreName, maxValue - 1);

    if (+value < DEFAULT_SLIDER_MIN_NUMBER)
      return setValue(minScoreName, DEFAULT_SLIDER_MIN_NUMBER);

    setValue(minScoreName, +value);
  };

  const handleChangeMaxScore = (event: ChangeEvent<HTMLInputElement>) => {
    const maxScoreName = `${sliderName}.maxValue`;
    const value = event.target.value;

    if (value === '') return setValue(maxScoreName, minValue);

    if (+value > DEFAULT_SLIDER_MAX_VALUE) return setValue(maxScoreName, DEFAULT_SLIDER_MAX_VALUE);

    if (+value < minValue + 1) return setValue(maxScoreName, minValue + 1);

    setValue(maxScoreName, +value);
  };

  const commonInputProps = {
    control,
    type: 'number',
  };

  const marks = hasTickMarks && getMarks(minValue, maxValue, hasTickMarksLabels);

  useEffect(() => {
    const errors = scoresError.error as unknown as FieldError[] | undefined;
    setError(errors?.filter((error) => error)?.[0]);
  }, [scoresError]);

  const dataTestid = concatIf(
    'builder-activity-items-item-configuration-slider',
    `-rows-${index}`,
    isMultiple,
  );

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
                maxNumberValue={maxValue - 1}
                onChange={handleChangeMinScore}
                minNumberValue={
                  isMultiple ? DEFAULT_SLIDER_ROWS_MIN_NUMBER : DEFAULT_SLIDER_MIN_NUMBER
                }
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
                onChange={handleChangeMaxScore}
                maxNumberValue={DEFAULT_SLIDER_MAX_NUMBER}
                minNumberValue={minValue + 1}
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
