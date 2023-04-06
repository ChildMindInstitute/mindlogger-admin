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
