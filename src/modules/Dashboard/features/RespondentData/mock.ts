import uniqueId from 'lodash.uniqueid';

import { Activity } from 'redux/modules';

export const mockedActivities = [
  {
    id: uniqueId(),
    name: 'PMHSA',
    items: [],
  },
  {
    id: uniqueId(),
    name: 'Alabama Parenting Questionnaire (APQ) - Self Report',
    items: [],
  },
  {
    id: uniqueId(),
    name: 'Youth Alcohol Measures',
    items: [],
  },
  {
    id: uniqueId(),
    name: 'Pediatric Mental Health Screening Assessment (PMHSA) - Child',
    items: [],
  },
] as unknown as Activity[];
