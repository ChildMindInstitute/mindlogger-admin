import { ItemFormValues } from 'modules/Builder/pages/BuilderApplet';

export const getItemKey = (entity: ItemFormValues) => entity.id ?? entity.key ?? '';
