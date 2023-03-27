import { useState, ChangeEvent } from 'react';
import { useFormContext, FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { UploaderUiType, Uploader, Table, UiType } from 'shared/components';
import { InputController } from 'shared/components/FormComponents';
import { theme, StyledFlexTopCenter } from 'shared/styles';
import {
  SLIDER_LABEL_MAX_LENGTH,
  DEFAULT_SLIDER_MIN_NUMBER,
  SLIDER_VALUE_LABEL_MAX_LENGTH,
  DEFAULT_SLIDER_MAX_VALUE,
} from '../../../ItemConfiguration.const';

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
import { ItemConfigurationSettings } from '../../../ItemConfiguration.types';

const commonUploaderProps = {
  width: 5.6,
  height: 5.6,
  uiType: UploaderUiType.Secondary,
};

export const SliderPanel = <T extends FieldValues>({
  name,
  label,
  isMultiple,
  onRemove,
}: SliderPanelProps<T>) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const { t } = useTranslation('app');

  const { control, watch, setValue, getValues } = useFormContext();

  const { id, min, max, scores } = watch(name);
  const settings = watch('settings');

  const hasTickMarks = settings?.includes(ItemConfigurationSettings.HasTickMarks);
  const hasTickMarksLabels = settings?.includes(ItemConfigurationSettings.HasTickMarksLabels);
  const hasScores = settings?.includes(ItemConfigurationSettings.HasScores);

  watch((data, { name: attributeName }: { name?: string }) => {
    const option = getValues(name);

    if (!option) return;

    const { min, max, scores } = option;

    const scoresQuantity = max - min + 1;

    if (attributeName === `${name}.min`) {
      if (scores?.length < scoresQuantity) {
        setValue(`${name as string}.scores`, [Math.min(...scores) - 1].concat(scores));
      }

      if (scores?.length > scoresQuantity) {
        setValue(`${name}.scores`, scores?.slice(1));
      }
    }

    if (attributeName === `${name}.max`) {
      if (scores?.length < scoresQuantity) {
        setValue(`${name}.scores`, scores.concat(Math.max(...scores) + 1));
      }

      if (scores?.length > scoresQuantity) {
        setValue(`${name}.scores`, scores?.slice(0, scoresQuantity));
      }
    }
  });

  const handleCollapse = () => setIsExpanded((prevExpanded) => !prevExpanded);

  const handleChangeMinScore = (event: ChangeEvent<HTMLInputElement>) => {
    const minScoreName = `${name}.min`;
    const value = event.target.value;

    if (value === '') return setValue(minScoreName, DEFAULT_SLIDER_MIN_NUMBER);

    if (+value > max - 1) return setValue(minScoreName, max - 1);

    if (+value < DEFAULT_SLIDER_MIN_NUMBER)
      return setValue(minScoreName, DEFAULT_SLIDER_MIN_NUMBER);

    setValue(minScoreName, +value);
  };

  const handleChangeMaxScore = (event: ChangeEvent<HTMLInputElement>) => {
    const maxScoreName = `${name}.max`;
    const value = event.target.value;

    if (value === '') return setValue(maxScoreName, min);

    if (+value > DEFAULT_SLIDER_MAX_VALUE) return setValue(maxScoreName, DEFAULT_SLIDER_MAX_VALUE);

    if (+value < min + 1) return setValue(maxScoreName, min + 1);

    setValue(maxScoreName, +value);
  };

  const commonInputProps = {
    control,
    type: 'number',
  };

  const marks = hasTickMarks && getMarks(min, max, hasTickMarksLabels);

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
        isExpanded={isExpanded}
        onArrowClick={handleCollapse}
        onTrashClick={onRemove}
        isMultiple={isMultiple}
      />
      {isMultiple && (
        <StyledInputContainer sx={{ mb: theme.spacing(2.4) }}>
          <InputController
            control={control}
            name={`${name}.label`}
            label={t('sliderLabel')}
            maxLength={SLIDER_LABEL_MAX_LENGTH}
          />
        </StyledInputContainer>
      )}
      <StyledInputContainer>
        <InputController
          control={control}
          name={`${name}.minLabel`}
          label={t('minLabel')}
          maxLength={SLIDER_VALUE_LABEL_MAX_LENGTH}
        />
        <InputController
          control={control}
          name={`${name}.maxLabel`}
          label={t('maxLabel')}
          maxLength={SLIDER_VALUE_LABEL_MAX_LENGTH}
        />
      </StyledInputContainer>
      <StyledFlexTopCenter sx={{ p: theme.spacing(2.4, 0.8) }}>
        <StyledSlider min={min} max={max} value={min} marks={marks} disabled />
      </StyledFlexTopCenter>
      <StyledInputContainer>
        <StyledFlexTopCenter sx={{ flexGrow: 1, gap: '1.2rem' }}>
          <Uploader
            {...commonUploaderProps}
            setValue={(val: string) => setValue(`${name as string}.minImage`, val)}
            getValue={() => watch(`${name}.minImage`) || ''}
          />
          <InputController
            {...commonInputProps}
            name={`${name}.min`}
            label={t('minValue')}
            maxNumberValue={max - 1}
            onChange={handleChangeMinScore}
            minNumberValue={DEFAULT_SLIDER_MIN_NUMBER}
          />
        </StyledFlexTopCenter>
        <StyledFlexTopCenter sx={{ flexGrow: 1, gap: '1.2rem' }}>
          <Uploader
            {...commonUploaderProps}
            setValue={(val: string) => setValue(`${name as string}.maxImage`, val)}
            getValue={() => watch(`${name}.maxImage`) || ''}
          />
          <InputController
            {...commonInputProps}
            name={`${name}.max`}
            label={t('maxValue')}
            onChange={handleChangeMaxScore}
            maxNumberValue={DEFAULT_SLIDER_MAX_VALUE}
            minNumberValue={min + 1}
          />
        </StyledFlexTopCenter>
      </StyledInputContainer>
      {hasScores && (
        <StyledScoresContainer>
          <Table
            columns={getStaticHeadRow()}
            rows={getStaticBodyRow()}
            orderBy="0"
            uiType={UiType.Secondary}
          />
          <Table
            columns={getHeadCells(min, max)}
            rows={getTableRows(scores, name)}
            orderBy="0"
            uiType={UiType.Secondary}
          />
        </StyledScoresContainer>
      )}
    </StyledSliderPanelContainer>
  );
};
