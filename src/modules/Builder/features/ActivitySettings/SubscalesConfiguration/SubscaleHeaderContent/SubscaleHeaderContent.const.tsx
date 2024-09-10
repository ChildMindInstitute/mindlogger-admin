import i18n from 'i18n';

const { t } = i18n;

export const subscaleColumnData = [
  {
    key: 'score',
    label: t('subscaleLookupTable.column.score'),
    styles: {
      width: '10%',
    },
  },
  {
    key: 'rawScore',
    label: t('subscaleLookupTable.column.rawScore'),
    styles: {
      width: '20%',
    },
  },
  {
    key: 'age',
    label: t('subscaleLookupTable.column.age'),
    styles: {
      width: '10%',
    },
  },
  {
    key: 'sex',
    label: t('subscaleLookupTable.column.sex'),
    styles: {
      width: '10%',
    },
  },
  {
    key: 'optionalText',
    label: t('subscaleLookupTable.column.text'),
  },
];

export const subscaleTableTemplate = [
  {
    score: '10',
    rawScore: '1',
    age: 15,
    sex: 'M',
    optionalText:
      'https://gist.githubusercontent.com/benbalter/3914310/raw/f757a33411082da23f0ad4a124b45fcdacc1b43f/Example--text.txt',
    severity: 'Minimal',
  },
  {
    score: '20',
    rawScore: '2',
    age: 15,
    sex: 'M',
    optionalText:
      'https://gist.githubusercontent.com/benbalter/3914310/raw/f757a33411082da23f0ad4a124b45fcdacc1b43f/Example--text.txt',
    severity: 'Mild',
  },
  {
    score: '30',
    rawScore: '3',
    age: 15,
    sex: 'M',
    optionalText: 'Markdown Text Here',
    severity: 'Moderate',
  },
  {
    score: '40',
    rawScore: '4',
    age: 15,
    sex: 'F',
    optionalText: 'Good',
    severity: 'Severe',
  },
  {
    score: '50',
    rawScore: '5',
    age: 15,
  },
];
