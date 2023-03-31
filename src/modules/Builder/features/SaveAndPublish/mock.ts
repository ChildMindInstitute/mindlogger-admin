export const appletPasswordMocked = '12345678';

export const activityItemsMocked = [
  {
    headerImage: 'string',
    question: {
      en: 'english',
      fr: 'french',
      additionalProp3: 'string',
    },
    responseType: 'text',
    answers: ['string'],
    config: {
      maxResponseLength: -1,
      correctAnswerRequired: false,
      correctAnswer: '',
      numericalResponseRequired: false,
      responseDataIdentifier: '',
      responseRequired: false,
    },
    skippableItem: false,
    removeAvailabilityToGoBack: false,
  },
];

export const appletActivitiesMocked = [
  {
    key: '3fa85f64-5717-4562-b3fc-2c963f66afa6', // TODO: how the `key` is generated?
    name: 'Test activity name 1',
    description: {
      en: 'english',
      fr: 'french',
      additionalProp3: 'string',
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
      additionalProp3: 'string',
    },
    isSingleReport: false,
    hideBadge: false,
    items: [
      {
        activityKey: '3fa85f64-5717-4562-b3fc-2c963f66afa6', // TODO: how the `key` is generated?
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
    additionalProp3: 'string',
  },
  about: {
    en: 'english',
    fr: 'french',
    additionalProp3: 'string',
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
  password: appletPasswordMocked,
  activities: appletActivitiesMocked,
  activityFlows: appletActivityFlowsMocked,
  ...appletInfoMocked,
};
