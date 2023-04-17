import { ActivityFormValues } from 'modules/Builder/pages/BuilderApplet';

export const getActivityKey = (entity: ActivityFormValues): string => entity.key ?? entity.id ?? '';
