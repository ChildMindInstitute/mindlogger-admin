import i18n from 'i18n';
import { SubscaleTotalScore } from 'shared/consts';

const { t } = i18n;

export const options = [
  {
    value: SubscaleTotalScore.Sum,
    label: t('sumOfScores'),
  },
  {
    value: SubscaleTotalScore.Average,
    label: t('averageOfScores'),
  },
];
