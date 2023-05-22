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

export const totalScoreTableColumnData = [
  {
    key: 'Raw Score',
    label: t('subscaleLookupTable.column.rawScore'),
  },

  {
    key: 'Text',
    label: t('subscaleLookupTable.column.text'),
  },
];

export const totalScoreTableTemplate = [
  {
    'Raw Score': '0 ~ 2',
    Text: 'https://gist.githubusercontent.com/benbalter/3914310/raw/f757a33411082da23f0ad4a124b45fcdacc1b43f/Example--text.txt',
  },
  {
    'Raw Score': '4 ~ 20',
    Text: 'https://gist.githubusercontent.com/rt2zz/e0a1d6ab2682d2c47746950b84c0b6ee/raw/83b8b4814c3417111b9b9bef86a552608506603e/markdown-sample.md',
  },
  {
    'Raw Score': ' -10 ~ 0',
    Text: 'abcd',
  },
];
