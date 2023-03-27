import uniqueId from 'lodash.uniqueid';

export const mockedNotes = [
  {
    id: uniqueId(),
    author: 'Maks',
    content: 'Your participation is voluntary; you do not have to take part.',
  },
  {
    id: uniqueId(),
    author: 'Veronica',
    content: 'Once you have started the questionnaire you can stop at any time',
  },
  {
    id: uniqueId(),
    author: 'Maks',
    content: 'One note.',
  },
];
