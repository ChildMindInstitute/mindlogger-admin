import { v4 as uuidv4 } from 'uuid';

import i18n from 'i18n';
import { SubscaleTotalScore, ItemResponseType } from 'shared/consts';
import { SingleAndMultipleSelectItemResponseValues, TextItemResponseValues } from 'shared/state';
import { getNewActivityItem } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.utils';
import {
  defaultSingleAndMultiSelectionConfig,
  defaultTextConfig,
} from 'modules/Builder/features/ActivityItems/ItemConfiguration/OptionalItemsAndSettings/OptionalItemsAndSettings.const';

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

export const genderItem = getNewActivityItem({
  isSubscaleSystemItem: true,
  name: 'gender_screen',
  question: t('genderQuestion'),
  config: defaultSingleAndMultiSelectionConfig,
  responseType: ItemResponseType.SingleSelection,
  responseValues: {
    options: [
      {
        id: uuidv4(),
        text: t('male'),
        isHidden: false,
      },
      {
        id: uuidv4(),
        text: t('female'),
        isHidden: false,
      },
    ],
  } as SingleAndMultipleSelectItemResponseValues,
});

export const ageItem = getNewActivityItem({
  isSubscaleSystemItem: true,
  name: 'age_screen',
  question: t('ageQuestion'),
  config: defaultTextConfig,
  responseType: ItemResponseType.Text,
  responseValues: null as TextItemResponseValues,
});
