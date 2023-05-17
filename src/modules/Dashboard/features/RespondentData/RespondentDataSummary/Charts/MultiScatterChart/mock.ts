const responseOptions = [
  {
    id: '7c2172b2-f0d0-11ed-a05b-0242ac120003',
    option: 'Prefer Not to Answer',
  },
  {
    id: '780b6976-f0d0-11ed-a05b-0242ac120003',
    option: 'A Race, Ethnicity, or Origin Not Listed',
  },
  {
    id: '730419aa-f0d0-11ed-a05b-0242ac120003',
    option: 'Caribbean',
  },
  {
    id: '6eb2c996-f0d0-11ed-a05b-0242ac120003',
    option: 'Middle Eastern or North African',
  },
  {
    id: '69f3a3ee-f0d0-11ed-a05b-0242ac120003',
    option: 'South or Southeast Asian',
  },
  {
    id: '6541c646-f0d0-11ed-a05b-0242ac120003',
    option: 'East Asian or Pacific Islander',
  },
  {
    id: '60db1ada-f0d0-11ed-a05b-0242ac120003',
    option: 'Latino / Latina / Latinx or Hispanic',
  },
  {
    id: '5c533aec-f0d0-11ed-a05b-0242ac120003',
    option: 'White',
  },
];

const responses = [
  {
    id: '5c533aec-f0d0-11ed-a05b-0242ac120003',
    dates: [new Date(2023, 4, 1), new Date(2023, 4, 8)],
  },
  {
    id: '60db1ada-f0d0-11ed-a05b-0242ac120003',
    dates: [new Date(2023, 4, 3)],
  },
  {
    id: '69f3a3ee-f0d0-11ed-a05b-0242ac120003',
    dates: [new Date(2023, 4, 11)],
  },
  {
    id: '7c2172b2-f0d0-11ed-a05b-0242ac120003',
    dates: [new Date(2023, 4, 5), new Date(2023, 4, 11)],
  },
  {
    id: '780b6976-f0d0-11ed-a05b-0242ac120003',
    dates: [new Date(2023, 4, 16), new Date(2023, 4, 18)],
  },
];

const versions = [
  {
    date: new Date(2023, 4, 3),
    version: '1.0.1',
  },
  {
    date: new Date(2023, 4, 15),
    version: '1.1.0',
  },
];

export const mocks = {
  responseOptions,
  responses,
  versions,
};
