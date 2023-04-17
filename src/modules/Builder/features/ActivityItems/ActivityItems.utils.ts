import { ItemFormValues } from 'modules/Builder/pages/BuilderApplet';

export const getEntityKey = (entity: ItemFormValues) => entity.id ?? entity.key;
