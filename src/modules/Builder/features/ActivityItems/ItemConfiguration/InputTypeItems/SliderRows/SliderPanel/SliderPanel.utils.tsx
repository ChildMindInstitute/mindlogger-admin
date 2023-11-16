import i18n from 'i18n';
import { HeadCell } from 'shared/types/table';
import { createArray } from 'shared/utils';
import { ItemAlert } from 'shared/state';

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
  const emptyNumber = '' as unknown as number;

  if (type === SliderInputType.MinValue) {
    if (lessThanScoresQuantity) {
      const newScores = createArray(scoresQuantity - scoresLength, () => emptyNumber).reverse();
      setValue(scoresName, newScores.concat(scores));
    }

    if (moreThanScoresQuantity) {
      setValue(scoresName, scores.slice(scoresLength - scoresQuantity, scoresLength));
    }

    if (alertsCondition) {
      alerts.forEach((alert: ItemAlert, index: number) => {
        if (Number(alert.value!) < minValue) setValue(`${alertsName}.${index}.value`, minValue);
      });
    }
  }

  if (type === SliderInputType.MaxValue) {
    if (lessThanScoresQuantity) {
      const newScores = createArray(scoresQuantity - scoresLength, () => emptyNumber);
      setValue(scoresName, scores.concat(newScores));
    }

    if (moreThanScoresQuantity) {
      setValue(scoresName, scores.slice(0, scoresQuantity));
    }

    if (alertsCondition) {
      alerts.forEach((alert: ItemAlert, index: number) => {
        if (Number(alert.value!) > maxValue) setValue(`${alertsName}.${index}.value`, maxValue);
      });
    }
  }
};
