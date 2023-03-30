import uniqueId from 'lodash.uniqueid';

import { Activity } from 'redux/modules';

export const mockedActivities = [
  {
    id: uniqueId(),
    name: 'PMHSA',
  },
  {
    id: uniqueId(),
    name: 'Alabama Parenting Questionnaire (APQ) - Self Report',
  },
  {
    id: uniqueId(),
    name: 'Youth Alcohol Measures',
  },
  {
    id: uniqueId(),
    name: 'Pediatric Mental Health Screening Assessment (PMHSA) - Child',
  },
] as unknown as Activity[];
