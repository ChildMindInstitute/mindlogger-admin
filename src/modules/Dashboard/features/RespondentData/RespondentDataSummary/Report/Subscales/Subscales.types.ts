import { SubscalesTypes } from './Subscales.const';

export type Subscale = {
  id: string;
  type?: SubscalesTypes;
  name?: string;
  items?: Subscale[];
};
