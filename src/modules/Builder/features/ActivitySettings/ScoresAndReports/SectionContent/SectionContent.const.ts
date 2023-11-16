import { v4 as uuidv4 } from 'uuid';

export const defaultConditionalValue = {
  id: uuidv4(),
  name: 'section-condition',
  conditions: [],
  match: '',
};
