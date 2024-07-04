import { EventFormWarnings } from '../EventForm.types';

export type AvailabilityTabProps = {
  hasAlwaysAvailableOption?: boolean;
  'data-testid'?: string;
  removeWarnings?: EventFormWarnings;
};
