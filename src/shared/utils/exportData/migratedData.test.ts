import { mockedExportContextItemData, mockedSingleActivityItem } from 'shared/mock';

import { checkIfHasMigratedAnswers, getIdBeforeMigration } from './migratedData';

const singleItem = {
  activityItem: mockedSingleActivityItem,
  answer: {
    value: 2,
    text: 'Extra info',
  },
  items: [],
  ...mockedExportContextItemData,
};
const decryptedAnswers = [singleItem];
const migratedDecryptedAnswers = [
  {
    ...singleItem,
    migratedDate: '2023-10-31T13:03:24.979Z',
  },
];
describe('migratedData', () => {
  describe('checkIfHasMigratedAnswers', () => {
    test.each`
      answers                     | expected | description
      ${decryptedAnswers}         | ${false} | ${'should return false when answers was not migrated'}
      ${migratedDecryptedAnswers} | ${true}  | ${'should return true when answers was migrated'}
      ${[]}                       | ${false} | ${'should return false when answer list is empty'}
    `('$description', ({ answers, expected }) => {
      expect(checkIfHasMigratedAnswers(answers)).toBe(expected);
    });
  });
  describe('getIdBeforeMigration', () => {
    test.each`
      id                                        | expected                      | description
      ${'64c23b53-8819-c178-d236-685e00000000'} | ${'64c23b538819c178d236685e'} | ${'should return transformed id'}
    `('$description', ({ id, expected }) => {
      expect(getIdBeforeMigration(id)).toBe(expected);
    });
  });
});
