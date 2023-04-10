import { ItemResponseType } from 'shared/consts';

/* eslint-disable camelcase */
export const activityItemsMocked = [
  {
    name: 'textField',
    question: {
      en: 'string',
      fr: 'string',
    },
    responseType: ItemResponseType.Text,
    responseValues: null,
    config: {
      removeBackButton: true,
      skippableItem: true,
      maxResponseLength: 300,
      correctAnswerRequired: true,
      correctAnswer: 'string',
      numericalResponseRequired: true,
      responseDataIdentifier: true,
      responseRequired: true,
    },
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
