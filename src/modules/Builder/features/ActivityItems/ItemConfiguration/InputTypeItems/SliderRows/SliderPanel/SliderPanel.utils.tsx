import i18n from 'i18n';
import { HeadCell } from 'shared/types/table';
import { createArray } from 'shared/utils';
import { ItemAlert } from 'shared/state';
import { DEFAULT_SLIDER_MAX_NUMBER } from 'modules/Builder/features/ActivityItems/ItemConfiguration/ItemConfiguration.const';

import { ScoreCell } from './ScoreCell';
import { SetScoresAndAlertsChange, SliderInputType } from './SliderPanel.types';

const { t } = i18n;

export const getHeadCells = (min: number, max: number): HeadCell[] =>
  createArray(max - min + 1, (index: number) => ({
    id: `${min + index}`,
    label: `${min + index}`,
  }));

export const getTableRows = (scores: number[] = [], name: string, dataTestid: string) => [
  scores.reduce(
    (result, score, index) => ({
      ...result,
      [`${name}.scores[${index}]`]: {
        content: () => (
          <ScoreCell name={`${name}.scores[${index}]`} data-testid={`${dataTestid}-${index}`} />
        ),
        value: `${score}`,
      },
    }),
    {},
  ),
];

export const getStaticHeadRow = () => [{ id: 'placeholder', label: t('value') }];

export const getStaticBodyRow = () => [
  { placeholder: { content: () => t('score'), value: t('score') } },
];

export const getMarks = (min: number, max: number, hasLabels: boolean) =>
  createArray(max - min + 1, (index: number) => ({
    value: min + index,
    ...(hasLabels && { label: `${min + index}` }),
  }));

export const setScoresAndAlertsChange = ({
  minValue,
  maxValue,
  type,
  scores,
  alerts,
  setValue,
  scoresName,
  hasAlerts,
  alertsName,
}: SetScoresAndAlertsChange) => {
  const scoresQuantity = maxValue - minValue + 1;
  const scoresLength = scores && scores.length;
  const lessThanScoresQuantity = scoresLength && scoresLength < scoresQuantity;
  const moreThanScoresQuantity = scoresLength && scoresLength > scoresQuantity;
  const alertsCondition = alerts && hasAlerts;

  if (type === SliderInputType.MinValue) {
    if (lessThanScoresQuantity) {
      const firstScore = scores[0];
      const newScores = createArray(
        scoresQuantity - scores.length,
        (index) => firstScore - 1 - index,
      ).reverse();
      setValue(scoresName, newScores.concat(scores));
    }

    if (moreThanScoresQuantity) {
      setValue(scoresName, scores.slice(scores.length - scoresQuantity, scores.length));
    }

    if (alertsCondition) {
      alerts.forEach((alert: ItemAlert, index: number) => {
        if (alert.value! < minValue) setValue(`${alertsName}.${index}.value`, minValue);
      });
    }
  }

  if (type === SliderInputType.MaxValue) {
    if (lessThanScoresQuantity) {
      const lastScore = scores[scores.length - 1];
      const newScores = createArray(
        scoresQuantity - scores.length,
        (index) => lastScore + 1 + index,
      );
      setValue(scoresName, scores.concat(newScores));
    }

    if (moreThanScoresQuantity) {
      setValue(scoresName, scores.slice(0, scoresQuantity));
    }

    if (alertsCondition) {
      alerts.forEach((alert: ItemAlert, index: number) => {
        if (alert.value! > maxValue) setValue(`${alertsName}.${index}.value`, maxValue);
      });
    }
  }
};

export const getMinValue = (value: number, maxValue: number, defaultMinNumberValue: number) => {
  let newValue = value;
  if (newValue > maxValue - 1) {
    newValue = maxValue - 1;
  }
  if (newValue < defaultMinNumberValue) {
    newValue = defaultMinNumberValue;
  }

  return newValue;
};

export const getMaxValue = (value: number, minValue: number) => {
  let newValue = value;

  if (newValue > DEFAULT_SLIDER_MAX_NUMBER) {
    newValue = DEFAULT_SLIDER_MAX_NUMBER;
  }
  if (newValue < minValue + 1) {
    newValue = minValue + 1;
  }

  return newValue;
};
