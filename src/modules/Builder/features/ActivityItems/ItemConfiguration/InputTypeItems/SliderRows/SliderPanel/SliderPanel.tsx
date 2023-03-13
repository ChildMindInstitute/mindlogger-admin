import { useState, useEffect } from 'react';
import { useFormContext, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Slider } from '@mui/material';

import { UploaderUiType, Uploader, Table, UiType } from 'shared/components';
import { InputController } from 'shared/components/FormComponents';
import { theme, StyledFlexTopCenter } from 'shared/styles';

import { Header } from './Header';
import { SliderPanelProps } from './SliderPanel.types';
import {
  StyledSliderPanelContainer,
  StyledInputContainer,
  StyledScoresContainer,
} from './SliderPanel.styles';
import { getHeadCells, getTableRows } from './SliderPanel.utils';
import { SLIDER_VALUE_HEAD_ROWS, SLIDER_LABEL_ROWS } from './SliderPanel.const';
import {
  DEFAULT_SLIDER_MIN_NUMBER,
  SLIDER_LABEL_MAX_LENGTH,
} from '../../../ItemConfiguration.const';

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

  useEffect(() => {
    const { max, scores } = getValues(name);

    const scoresQuantity = max - min + 1;

    if (scores?.length > scoresQuantity) setValue(`${name}.scores`, scores?.slice(1));

    if (scores?.length < scoresQuantity)
      setValue(`${name as string}.scores`, [Math.min(...scores) - 1].concat(scores));
  }, [min, name, getValues, setValue]);

  useEffect(() => {
    const { min, scores } = getValues(name);

    const scoresQuantity = max - min + 1;

    if (scores?.length < scoresQuantity)
      setValue(`${name}.scores`, scores.concat(Math.max(...scores) + 1));

    if (scores?.length > scoresQuantity)
      setValue(`${name}.scores`, scores?.slice(0, scoresQuantity));
  }, [max, name, getValues, setValue]);

  const handleCollapse = () => setIsExpanded(!isExpanded);

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
      <StyledInputContainer>
        <InputController
          control={control}
          name={`${name}.minLabel`}
          placeholder={t('minLabel')}
          maxLength={SLIDER_LABEL_MAX_LENGTH}
        />
        <InputController
          control={control}
          name={`${name}.maxLabel`}
          placeholder={t('maxLabel')}
          maxLength={SLIDER_LABEL_MAX_LENGTH}
        />
      </StyledInputContainer>
      <StyledFlexTopCenter sx={{ p: theme.spacing(2.4, 0.8) }}>
        <Slider min={min} max={max} />
      </StyledFlexTopCenter>
      <StyledInputContainer>
        <StyledFlexTopCenter sx={{ flexGrow: 1, gap: '1.2rem' }}>
          <Uploader
            uiType={UploaderUiType.Secondary}
            width={5.6}
            height={5.6}
            setValue={(val: string) => setValue(`${name as string}.minImage`, val)}
            getValue={() => watch(`${name}.minImage`) || ''}
          />
          <InputController
            type="number"
            control={control}
            name={`${name}.min`}
            label={t('minValue')}
            defaultNumberValue={DEFAULT_SLIDER_MIN_NUMBER}
          />
        </StyledFlexTopCenter>
        <StyledFlexTopCenter sx={{ flexGrow: 1, gap: '1.2rem' }}>
          <Uploader
            uiType={UploaderUiType.Secondary}
            width={5.6}
            height={5.6}
            setValue={(val: string) => setValue(`${name as string}.maxImage`, val)}
            getValue={() => watch(`${name}.maxImage`) || ''}
          />
          <InputController
            type="number"
            control={control}
            name={`${name}.max`}
            label={t('maxValue')}
          />
        </StyledFlexTopCenter>
      </StyledInputContainer>
      <StyledScoresContainer>
        <Table
          columns={SLIDER_VALUE_HEAD_ROWS}
          rows={SLIDER_LABEL_ROWS}
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
    </StyledSliderPanelContainer>
  );
};
