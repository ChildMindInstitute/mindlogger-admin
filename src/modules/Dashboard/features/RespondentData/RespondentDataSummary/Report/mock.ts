import { ItemResponseType } from 'shared/consts';

import { ActivityReport, Version, Response, ResponseOption } from './Report.types';

const commonConfig = {
  removeBackButton: false,
  skippableItem: false,
  randomizeOptions: false,
  addScores: false,
  setAlerts: false,
  addTooltip: false,
  setPalette: false,
  timer: 0,
  additionalResponseOption: {
    textInputOption: false,
    textInputRequired: false,
  },
};

export const versions: Version[] = [
  {
    date: new Date(2023, 4, 4),
    version: '1.0.1',
  },
  {
    date: new Date(2023, 4, 11),
    version: '1.0.2',
  },
  {
    date: new Date(2023, 4, 15),
    version: '1.1.0',
  },
];

export const responses: Response[] = [
  {
    date: new Date(2023, 4, 5),
    answerId: 'b286c432-f3f1-11ed-a05b-0242ac120003',
  },
  {
    date: new Date(2023, 4, 8),
    answerId: 'c4a2a320-f3f1-11ed-a05b-0242ac120003',
  },
  {
    date: new Date(2023, 4, 10),
    answerId: '3df91fe2-f447-11ed-a05b-0242ac120003',
  },
  {
    date: new Date(2023, 4, 12),
    answerId: '476b01c6-f447-11ed-a05b-0242ac120003',
  },
  {
    date: new Date(2023, 4, 14),
    answerId: 'b97558b2-f3f1-11ed-a05b-0242ac120003',
  },
];

export const responseOptions: ResponseOption[] = [
  {
    activityItem: {
      id: '29c8b0fa-f3f2-11ed-a05b-0242ac120003',
      name: 'Single selection Item Task',
      question: { en: '<p>Do you like how the respondent passed the review?<p>' },
      allowEdit: true,
      config: commonConfig,
      responseType: ItemResponseType.SingleSelection,
      responseValues: {
        options: [
          {
            id: '6ecf759e-f3f2-11ed-a05b-0242ac120003',
            text: 'Never',
          },
          {
            id: '75833eb6-f3f2-11ed-a05b-0242ac120003',
            text: 'Sometimes',
          },
          {
            id: '794519ca-f3f2-11ed-a05b-0242ac120003',
            text: 'Often',
          },
          {
            id: '7de2d738-f3f2-11ed-a05b-0242ac120003',
            text: 'None',
          },
        ],
      },
    },
    answers: [
      {
        value: '75833eb6-f3f2-11ed-a05b-0242ac120003',
        date: new Date(2023, 4, 5),
      },
      {
        value: '794519ca-f3f2-11ed-a05b-0242ac120003',
        date: new Date(2023, 4, 8),
      },
      {
        value: '7de2d738-f3f2-11ed-a05b-0242ac120003',
        date: new Date(2023, 4, 10),
      },
      {
        value: '7de2d738-f3f2-11ed-a05b-0242ac120003',
        date: new Date(2023, 4, 14),
      },
    ],
  },
  {
    activityItem: {
      id: '69c62722-f3f3-11ed-a05b-0242ac120003',
      name: 'Multiple selection Item Task',
      question: { en: '<p>Do you like how the respondent passed the review?<p>' },
      allowEdit: true,
      config: commonConfig,
      responseType: ItemResponseType.MultipleSelection,
      responseValues: {
        options: [
          {
            id: '740ec220-f3f3-11ed-a05b-0242ac120003',
            text: 'Latino / Latina / Latinx or Hispanic',
          },
          {
            id: '78caf8f6-f3f3-11ed-a05b-0242ac120003',
            text: 'East Asian or Pacific Islander',
          },
          {
            id: '7e1464fa-f3f3-11ed-a05b-0242ac120003',
            text: 'Middle Eastern or North African',
          },
          {
            id: '92b4a848-f3f3-11ed-a05b-0242ac120003',
            text: 'South or Southeast Asian',
          },
        ],
      },
    },
    answers: [
      {
        value: ['7e1464fa-f3f3-11ed-a05b-0242ac120003', '740ec220-f3f3-11ed-a05b-0242ac120003'],
        date: new Date(2023, 4, 8),
      },
      {
        value: ['78caf8f6-f3f3-11ed-a05b-0242ac120003', '92b4a848-f3f3-11ed-a05b-0242ac120003'],
        date: new Date(2023, 4, 10),
      },
      {
        value: ['78caf8f6-f3f3-11ed-a05b-0242ac120003'],
        date: new Date(2023, 4, 12),
      },
      {
        value: ['740ec220-f3f3-11ed-a05b-0242ac120003'],
        date: new Date(2023, 4, 14),
      },
    ],
  },
  {
    activityItem: {
      id: '200748a6-f582-11ed-b67e-0242ac120002',
      name: '200748a6-f582-11ed-b67e-0242ac120002',
      question: { en: '<p>Do you like how the respondent passed the review?<p>' },
      responseType: ItemResponseType.Slider,
      allowEdit: true,
      config: {
        ...commonConfig,
        continuousSlider: false,
      },
      responseValues: {
        minValue: 2,
        maxValue: 8,
      },
    },
    answers: [
      {
        value: 6,
        date: new Date(2023, 4, 5),
      },
      {
        value: 3,
        date: new Date(2023, 4, 8),
      },
      {
        value: 7.5,
        date: new Date(2023, 4, 12),
      },
      {
        value: 5,
        date: new Date(2023, 4, 14),
      },
    ],
  },
  {
    activityItem: {
      id: '6f861d58-f492-11ed-a05b-0242ac120003',
      name: 'Text Item Task',
      question: { en: '<p>Do you like how the respondent passed the review?<p>' },
      allowEdit: true,
      config: commonConfig,
      responseType: ItemResponseType.Text,
      responseValues: null,
    },
    answers: [
      {
        value: 'Your child’s physician may use this information to improve',
        date: new Date(2023, 4, 8, 11, 34),
      },
      {
        value: 'If you believe your child has a psychiatric or learning disorder',
        date: new Date(2023, 4, 10, 16, 19),
      },
      {
        value: 'Once you have started the questionnaire you can stop at any time',
        date: new Date(2023, 4, 12, 14, 49),
      },
    ],
  },
  {
    activityItem: {
      id: '238cf0ce-f40c-11ed-a05b-0242ac120003',
      name: 'Date Item Task',
      question: { en: '<p>Do you like how the respondent passed the review?<p>' },
      allowEdit: true,
      config: commonConfig,
      responseType: ItemResponseType.Date,
      responseValues: null,
    },
  },
  {
    activityItem: {
      id: 'd9858750-f40d-11ed-a05b-0242ac120003',
      name: 'Number Selection Item Task',
      question: { en: '<p>Do you like how the respondent passed the review?<p>' },
      allowEdit: true,
      config: commonConfig,
      responseType: ItemResponseType.NumberSelection,
      responseValues: null,
    },
  },
  {
    activityItem: {
      id: '64de9a30-f40e-11ed-a05b-0242ac120003',
      name: 'Time Range Item Task',
      question: { en: '<p>Do you like how the respondent passed the review?<p>' },
      allowEdit: true,
      config: commonConfig,
      responseType: ItemResponseType.TimeRange,
      responseValues: null,
    },
  },
  {
    activityItem: {
      id: '60a0637c-f40e-11ed-a05b-0242ac120003',
      name: 'Single Selection per Row Item Task',
      question: { en: '<p>Do you like how the respondent passed the review?<p>' },
      allowEdit: true,
      config: commonConfig,
      responseType: ItemResponseType.SingleSelectionPerRow,
      responseValues: null,
    },
  },
  {
    activityItem: {
      id: '99f69c40-f40e-11ed-a05b-0242ac120003',
      name: 'Multiple Selection per Row Item Task',
      question: { en: '<p>Do you like how the respondent passed the review?<p>' },
      allowEdit: true,
      config: commonConfig,
      responseType: ItemResponseType.MultipleSelectionPerRow,
      responseValues: null,
    },
  },
  {
    activityItem: {
      id: '95300e30-f40e-11ed-a05b-0242ac120003',
      name: 'Slider Rows Item Task',
      question: { en: '<p>Do you like how the respondent passed the review?<p>' },
      allowEdit: true,
      config: commonConfig,
      responseType: ItemResponseType.SliderRows,
      responseValues: null,
    },
  },
  {
    activityItem: {
      id: '90563eac-f40e-11ed-a05b-0242ac120003',
      name: 'Drawing Item Task',
      question: { en: '<p>Do you like how the respondent passed the review?<p>' },
      allowEdit: true,
      config: commonConfig,
      responseType: ItemResponseType.Drawing,
      responseValues: null,
    },
  },
  {
    activityItem: {
      id: '8b3652fe-f40e-11ed-a05b-0242ac120003',
      name: 'Photo Item Task',
      question: { en: '<p>Do you like how the respondent passed the review?<p>' },
      allowEdit: true,
      config: commonConfig,
      responseType: ItemResponseType.Photo,
      responseValues: null,
    },
  },
  {
    activityItem: {
      id: '03c265c8-f40f-11ed-a05b-0242ac120003',
      name: 'Video Item Task',
      question: { en: '<p>Do you like how the respondent passed the review?<p>' },
      allowEdit: true,
      config: commonConfig,
      responseType: ItemResponseType.Video,
      responseValues: null,
    },
  },
  {
    activityItem: {
      id: '0a8162c4-f40f-11ed-a05b-0242ac120003',
      name: 'Geolocation Item Task',
      question: { en: '<p>Do you like how the respondent passed the review?<p>' },
      allowEdit: true,
      config: commonConfig,
      responseType: ItemResponseType.Geolocation,
      responseValues: null,
    },
  },
  {
    activityItem: {
      id: 'fe8a148e-f40e-11ed-a05b-0242ac120003',
      name: 'Audio Item Task',
      question: { en: '<p>Do you like how the respondent passed the review?<p>' },
      allowEdit: true,
      config: commonConfig,
      responseType: ItemResponseType.Audio,
      responseValues: null,
    },
  },
  {
    activityItem: {
      id: 'fa3ee490-f40e-11ed-a05b-0242ac120003',
      name: 'Audio Player Item Task',
      question: { en: '<p>Do you like how the respondent passed the review?<p>' },
      allowEdit: true,
      config: commonConfig,
      responseType: ItemResponseType.AudioPlayer,
      responseValues: null,
    },
  },
];

export const activityReport: ActivityReport = {
  responses,
  versions,
  responseOptions,
};
