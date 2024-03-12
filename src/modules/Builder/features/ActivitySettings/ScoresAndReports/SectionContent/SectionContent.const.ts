import { v4 as uuidv4 } from 'uuid';

import { ConditionalLogicMatch } from 'shared/consts';

export const defaultConditionalValue = {
  id: uuidv4(),
  name: 'section-condition',
  conditions: [],
  match: ConditionalLogicMatch.All,
};
