/* eslint-disable camelcase */
export const activityItemsMocked = [
  {
    name: 'textField',
    question: {
      en: 'string',
      fr: 'string',
    },
    responseType: 'text',
    responseValues: null,
    config: {
      remove_back_button: true,
      skippable_item: true,
      max_response_length: 300,
      correct_answer_required: true,
      correct_answer: 'string',
      numerical_response_required: true,
      response_data_identifier: true,
      response_required: true,
    },
  },
];

export const appletActivitiesMocked = [
  {
    key: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    name: 'Test activity name 1',
    description: {
      en: 'english',
      fr: 'french',
    },
    splashScreen: '',
    image: '',
    showAllAtOnce: false,
    isSkippable: false,
    isReviewable: false,
    responseIsEditable: false,
    items: activityItemsMocked,
    isHidden: false,
  },
];

export const appletActivityFlowsMocked = [
  {
    name: 'string',
    description: {
      en: 'english',
      fr: 'french',
    },
    isSingleReport: false,
    hideBadge: false,
    items: [
      {
        activityKey: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      },
    ],
    isHidden: false,
  },
];

export const appletInfoMocked = {
  displayName: 'Applet 6',
  description: {
    en: 'english',
    fr: 'french',
  },
  about: {
    en: 'english',
    fr: 'french',
  },
  image: '',
  watermark: '',
  themeId: null,
  reportServerIp: '',
  reportPublicKey: '',
  reportRecipients: ['string'],
  reportIncludeUserId: false,
  reportIncludeCaseId: false,
  reportEmailBody: '',
};

export const appletDataMocked = {
  activities: appletActivitiesMocked,
  activityFlows: appletActivityFlowsMocked,
  ...appletInfoMocked,
};
