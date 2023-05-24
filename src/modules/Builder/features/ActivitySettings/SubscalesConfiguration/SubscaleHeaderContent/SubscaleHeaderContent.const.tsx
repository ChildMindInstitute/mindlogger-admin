import i18n from 'i18n';

const { t } = i18n;

export const subscaleColumnData = [
  {
    key: 'Score',
    label: t('subscaleLookupTable.column.score'),
  },
  {
    key: 'Raw Score',
    label: t('subscaleLookupTable.column.rawScore'),
  },
  {
    key: 'Age',
    label: t('subscaleLookupTable.column.age'),
  },
  {
    key: 'Sex',
    label: t('subscaleLookupTable.column.sex'),
  },
  {
    key: 'Text',
    label: t('subscaleLookupTable.column.text'),
  },
];

export const subscaleTableTemplate = [
  {
    Score: 10,
    'Raw Score': 1,
    Age: 15,
    Sex: 'M',
    Text: 'https://gist.githubusercontent.com/benbalter/3914310/raw/f757a33411082da23f0ad4a124b45fcdacc1b43f/Example--text.txt',
  },
  {
    Score: 20,
    'Raw Score': 2,
    Age: 15,
    Sex: 'M',
    Text: 'https://gist.githubusercontent.com/benbalter/3914310/raw/f757a33411082da23f0ad4a124b45fcdacc1b43f/Example--text.txt',
  },
  {
    Score: 30,
    'Raw Score': 3,
    Age: 15,
    Sex: 'M',
    Text: 'Markdown Text Here',
  },
  {
    Score: 40,
    'Raw Score': 4,
    Age: 15,
    Sex: 'F',
    Text: 'Good',
  },
  {
    Score: 50,
    'Raw Score': 5,
    Age: 15,
  },
];
