import { v4 as uuidv4 } from 'uuid';

export const getSectionDefaults = () => ({
  name: '',
  id: uuidv4(),
  showMessage: false,
  printItems: false,
  message: '',
  items: [],
});
