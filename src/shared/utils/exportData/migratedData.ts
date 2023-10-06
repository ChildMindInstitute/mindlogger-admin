import { DecryptedAnswerData } from 'shared/types';

const END_OF_LINE_OF_MIGRATED_ID = '00000000';
const END_OF_LINE_OF_MIGRATED_ID_SIZE = END_OF_LINE_OF_MIGRATED_ID.length;
const checkIfIdWasMigrated = (id: string) => id.endsWith(END_OF_LINE_OF_MIGRATED_ID);

export const checkIfHasMigratedAnswers = (decryptedAnswers: DecryptedAnswerData[]) => {
  if (!decryptedAnswers.length) return false;

  return checkIfIdWasMigrated(decryptedAnswers[0]?.id);
};

// Transform example: 64c23b53-8819-c178-d236-685e00000000 => 64c23b538819c178d236685e
export const getIdBeforeMigration = (id = '') =>
  id.slice(0, -END_OF_LINE_OF_MIGRATED_ID_SIZE).replace(/-/g, '');
