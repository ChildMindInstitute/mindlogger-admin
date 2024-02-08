import { v4 as uuidv4 } from 'uuid';

import i18n from 'i18n';
import {
  defaultSingleSelectionConfig,
  defaultTextConfig,
} from 'modules/Builder/features/ActivityItems/ItemConfiguration/OptionalItemsAndSettings/OptionalItemsAndSettings.const';
import { getNewActivityItem } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.utils';
import { SubscaleTotalScore, ItemResponseType, LookupTableItems } from 'shared/consts';

const { t } = i18n;

export const getOptions = () => [
  {
    value: SubscaleTotalScore.Sum,
    label: t('sumOfScores'),
  },
  {
    value: SubscaleTotalScore.Average,
    label: t('averageOfScores'),
  },
];

export const getTotalScoreTableColumnData = () => [
  {
    key: 'rawScore',
    label: t('subscaleLookupTable.column.rawScore'),
    styles: {
      width: '20%',
    },
  },

  {
    key: 'optionalText',
    label: t('subscaleLookupTable.column.text'),
  },
];

export const totalScoreTableTemplate = [
  {
    rawScore: '0 ~ 2',
    optionalText:
      'https://gist.githubusercontent.com/benbalter/3914310/raw/f757a33411082da23f0ad4a124b45fcdacc1b43f/Example--text.txt',
  },
  {
    rawScore: '4 ~ 20',
    optionalText:
      'https://gist.githubusercontent.com/rt2zz/e0a1d6ab2682d2c47746950b84c0b6ee/raw/83b8b4814c3417111b9b9bef86a552608506603e/markdown-sample.md',
  },
  {
    rawScore: ' -10 ~ 0',
    optionalText: 'abcd',
  },
];

export const genderItem = getNewActivityItem({
  allowEdit: false,
  name: LookupTableItems.Gender_screen,
  question: t('genderQuestion'),
  config: defaultSingleSelectionConfig,
  responseType: ItemResponseType.SingleSelection,
  responseValues: {
    options: [
      {
        id: uuidv4(),
        text: t('male'),
        isHidden: false,
        value: 0,
      },
      {
        id: uuidv4(),
        text: t('female'),
        isHidden: false,
        value: 1,
      },
    ],
  },
});

export const ageItem = getNewActivityItem({
  allowEdit: false,
  name: LookupTableItems.Age_screen,
  question: t('ageQuestion'),
  config: defaultTextConfig,
  responseType: ItemResponseType.Text,
  responseValues: null,
});
