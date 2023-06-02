import { v4 as uuidv4 } from 'uuid';

import { ConditionalLogicMatch } from 'shared/consts';

export const defaultConditionalValue = {
  name: '',
  id: uuidv4(),
  showMessage: false,
  message: undefined,
  printItems: false,
  itemsPrint: undefined,
  match: ConditionalLogicMatch.All,
  conditions: undefined,
};
