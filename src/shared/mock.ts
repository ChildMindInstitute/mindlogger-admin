import { Applet } from 'api';

import { Roles } from './consts';

export const mockedEmail = 'test@gmail.com';
export const mockedPassword = '123456!Qwe';
export const mockedAppletId = '2e46fa32-ea7c-4a76-b49b-1c97d795bb9a';

export const mockedUserData = {
  email: mockedEmail,
  firstName: 'Jane',
  lastName: 'Doe',
  id: 'c48b275d-db4b-4f79-8469-9198b45985d3',
};

export const mockedEncryption = {
  accountId: 'c48b275d-db4b-4f79-8469-9198b45985d3',
  base: '[2]',
  prime:
    '[148,187,155,90,57,66,144,3,154,113,206,8,135,246,49,190,183,47,52,148,8,73,234,204,210,211,80,234,245,125,69,247,156,15,20,218,136,226,167,14,47,135,101,213,192,25,237,113,187,103,7,28,249,119,213,91,251,132,152,74,168,226,116,182,197,242,230,164,138,2,10,165,175,236,34,124,33,126,240,207,161,211,50,136,184,165,168,33,187,35,184,198,52,251,14,217,188,249,68,18,96,37,102,82,219,233,0,147,37,202,223,200,15,209,242,17,196,110,125,146,117,131,247,37,73,232,101,115]',
  publicKey:
    '[83,248,225,174,70,254,108,108,37,118,166,218,27,202,220,168,194,240,73,14,253,17,178,13,68,121,236,123,118,204,223,231,175,24,5,70,180,151,151,193,22,125,223,14,62,25,251,202,214,54,55,223,193,238,21,159,229,17,212,222,200,132,224,129,200,203,67,25,100,41,36,236,34,9,27,163,107,98,185,172,87,119,157,91,100,68,156,26,102,235,234,88,194,19,86,103,69,24,156,185,10,201,251,45,20,86,194,166,1,150,229,47,164,164,115,168,114,125,134,76,172,33,103,17,227,210,125,159]',
};

export const mockedApplet = {
  id: mockedAppletId,
  displayName: 'displayName',
  encryption: mockedEncryption,
} as Applet;

export const mockedIdentifiers = [
  {
    identifier: '09a0bbf7994d5cf408292d7fb35dce18:e8051724b3f422950c1b0eb9c7013c72',
    userPublicKey:
      '[99,83,75,86,39,55,67,5,130,80,210,6,175,190,123,206,33,96,133,63,143,229,120,62,139,255,211,52,58,74,103,27,152,40,181,254,157,116,86,107,213,130,86,71,39,177,8,217,203,137,20,114,144,212,8,251,124,133,155,0,1,245,158,121,202,195,121,33,193,103,119,200,86,126,28,219,195,180,20,140,146,115,52,174,44,67,26,37,232,165,216,221,165,82,156,48,230,59,250,232,6,90,159,102,170,229,165,91,86,147,129,120,34,169,229,188,47,76,20,111,189,186,100,118,226,56,149,200]',
  },
  {
    identifier: 'd0aa7af502fd96704585bee074786497:7f619511aaefa1bad1f5af6b3ef22d9b',
    userPublicKey:
      '[99,83,75,86,39,55,67,5,130,80,210,6,175,190,123,206,33,96,133,63,143,229,120,62,139,255,211,52,58,74,103,27,152,40,181,254,157,116,86,107,213,130,86,71,39,177,8,217,203,137,20,114,144,212,8,251,124,133,155,0,1,245,158,121,202,195,121,33,193,103,119,200,86,126,28,219,195,180,20,140,146,115,52,174,44,67,26,37,232,165,216,221,165,82,156,48,230,59,250,232,6,90,159,102,170,229,165,91,86,147,129,120,34,169,229,188,47,76,20,111,189,186,100,118,226,56,149,200]',
  },
];

export const mockedPrivateKey = [
  88, 239, 191, 189, 15, 91, 94, 58, 113, 28, 239, 191, 189, 2, 16, 194, 139, 239, 191, 189, 239,
  191, 189, 239, 191, 189, 14, 63, 28, 239, 191, 189, 239, 191, 189, 239, 191, 189, 116, 239, 191,
  189, 239, 191, 189, 75, 239, 191, 189, 239, 191, 189, 119, 101, 239, 191, 189, 102, 239, 191, 189,
  42, 239, 191, 189, 50, 113, 88, 102, 239, 191, 189, 88, 239, 191, 189, 25, 210, 143, 239, 191,
  189, 239, 191, 189, 239, 191, 189, 99, 239, 191, 189, 4, 239, 191, 189, 208, 188, 18, 80, 91, 239,
  191, 189, 222, 181, 239, 191, 189, 202, 142, 65, 239, 191, 189, 50, 239, 191, 189, 239, 191, 189,
  80, 239, 191, 189, 55, 67, 239, 191, 189, 64, 239, 191, 189, 34, 239, 191, 189, 239, 191, 189,
  239, 191, 189, 44, 4, 239, 191, 189, 53, 14, 16, 28, 14, 239, 191, 189, 118, 85, 30, 32, 239, 191,
  189, 239, 191, 189, 5, 239, 191, 189, 50, 87, 239, 191, 189, 31, 239, 191, 189, 4, 100, 99, 49,
  239, 191, 189, 25, 239, 191, 189, 57, 239, 191, 189, 27, 30, 94, 239, 191, 189, 11, 239, 191, 189,
  109, 92, 15, 90, 239, 191, 189, 239, 191, 189, 239, 191, 189, 239, 191, 189, 239, 191, 189, 67,
  239, 191, 189, 63,
];

export const mockedOwnerId = '123123';
export const mockedCurrentWorkspace = {
  data: {
    ownerId: mockedOwnerId,
    workspaceName: 'name',
  },
};
export const mockedRespondentId = 'b60a142d-2b7f-4328-841c-dbhjhj4afcf1c7';
export const mockedRespondent = {
  id: mockedRespondentId,
  nicknames: ['Mocked Respondent'],
  secretIds: ['mockedSecretId'],
  isAnonymousRespondent: false,
  lastSeen: new Date().toDateString(),
  isPinned: false,
  accessId: 'aebf08ab-c781-4229-a625-271838ebdff4',
  role: Roles.Respondent,
  details: [
    {
      appletId: mockedAppletId,
      appletDisplayName: 'Mocked Applet',
      appletImage: '',
      accessId: 'aebf08ab-c781-4229-a625-271838ebdff4',
      respondentNickname: 'Mocked Respondent',
      respondentSecretId: '3921968c-3903-4872-8f30-a6e6a10cef36',
      hasIndividualSchedule: false,
      encryption: mockedEncryption,
    },
  ],
};
export const mockedRespondentId2 = 'b60a142d-2b7f-4328-841c-ddsdddj4afcf1c7';
export const mockedRespondent2 = {
  id: mockedRespondentId2,
  nicknames: ['Test Respondent'],
  secretIds: ['testSecretId'],
  isAnonymousRespondent: false,
  lastSeen: new Date().toDateString(),
  isPinned: false,
  accessId: 'aebf08ab-c781-4229-a625-271838ebdff4',
  role: Roles.Respondent,
  details: [
    {
      appletId: mockedAppletId,
      appletDisplayName: 'Mocked Applet',
      appletImage: '',
      accessId: 'aebf08ab-c781-4229-a625-271838ebdff4',
      respondentNickname: 'Test Respondent',
      respondentSecretId: '39ff968c-3903-4872-8f30-a6e6a10cef36',
      hasIndividualSchedule: false,
      encryption: mockedEncryption,
    },
  ],
};

export const mockedAppletData = {
  displayName: 'dataviz',
  description: {
    en: '',
  },
  about: {
    en: '',
  },
  image: '',
  watermark: '',
  themeId: '9b023afd-e5f9-403c-b154-fc8f35fcf3ab',
  link: null,
  requireLogin: true,
  pinnedAt: null,
  retentionPeriod: null,
  retentionType: null,
  streamEnabled: false,
  reportServerIp: '',
  reportPublicKey: '',
  reportRecipients: [],
  reportIncludeUserId: false,
  reportIncludeCaseId: false,
  reportEmailBody: '',
  encryption: mockedEncryption,
  id: mockedAppletId,
  version: '1.1.3',
  createdAt: '2023-09-26T12:11:46.162083',
  updatedAt: '2023-10-19T08:29:43.167613',
  isPublished: false,
  activities: [
    {
      name: 'New Activity',
      description: {
        en: '',
      },
      splashScreen: '',
      image: '',
      showAllAtOnce: false,
      isSkippable: false,
      isReviewable: false,
      responseIsEditable: true,
      isHidden: false,
      scoresAndReports: {
        generateReport: false,
        showScoreSummary: false,
        reports: [],
      },
      subscaleSetting: null,
      reportIncludedItemName: null,
      id: '56a4ebe4-3d7f-485c-8293-093cabf29fa3',
      items: [
        {
          question: {
            en: 'ss',
          },
          responseType: 'singleSelect',
          responseValues: {
            paletteName: null,
            options: [
              {
                id: '0d764084-f3bb-4a91-b74d-3fae4a0beb1f',
                text: 's1',
                image: null,
                score: 2,
                tooltip: null,
                isHidden: false,
                color: null,
                alert: null,
                value: 0,
              },
              {
                id: 'e3ca9405-71e9-4627-8311-d405f383246e',
                text: 's23333333',
                image: null,
                score: 4,
                tooltip: null,
                isHidden: false,
                color: null,
                alert: null,
                value: 1,
              },
            ],
          },
          config: {
            removeBackButton: false,
            skippableItem: false,
            randomizeOptions: false,
            timer: 0,
            addScores: true,
            setAlerts: false,
            addTooltip: false,
            setPalette: false,
            addTokens: null,
            additionalResponseOption: {
              textInputOption: false,
              textInputRequired: false,
            },
          },
          name: 'Item1',
          isHidden: false,
          conditionalLogic: null,
          allowEdit: true,
          id: 'c17b7b59-8074-4c69-b787-88ea9ea3df5d',
          order: 1,
        },
        {
          question: {
            en: 'ms',
          },
          responseType: 'multiSelect',
          responseValues: {
            paletteName: null,
            options: [
              {
                id: '7a71bf32-8d25-4040-88a0-8ae3f1c4f8bc',
                text: 'm1',
                image: null,
                score: 1,
                tooltip: null,
                isHidden: false,
                color: null,
                alert: null,
                value: 0,
              },
              {
                id: '188fc535-1e45-444d-88ec-91cb29737b03',
                text: 'm2',
                image: null,
                score: 1,
                tooltip: null,
                isHidden: false,
                color: null,
                alert: null,
                value: 1,
              },
              {
                id: 'cea898cc-d4be-4320-be11-b6bc6e72a9d1',
                text: 'm3',
                image: null,
                score: 1,
                tooltip: null,
                isHidden: false,
                color: null,
                alert: null,
                value: 2,
              },
            ],
          },
          config: {
            removeBackButton: false,
            skippableItem: false,
            randomizeOptions: false,
            timer: 0,
            addScores: true,
            setAlerts: false,
            addTooltip: false,
            setPalette: false,
            addTokens: null,
            additionalResponseOption: {
              textInputOption: false,
              textInputRequired: false,
            },
          },
          name: 'Item2',
          isHidden: false,
          conditionalLogic: {
            match: 'any',
            conditions: [
              {
                itemName: 'Item1',
                type: 'EQUAL_TO_OPTION',
                payload: {
                  optionValue: '0',
                },
              },
            ],
          },
          allowEdit: true,
          id: 'dad4e249-6a19-4c71-9806-e87b1c9e751b',
          order: 2,
        },
        {
          question: {
            en: 'slider',
          },
          responseType: 'slider',
          responseValues: {
            minLabel: 'min',
            maxLabel: 'max',
            minValue: 1,
            maxValue: 4,
            minImage: null,
            maxImage: null,
            scores: null,
            alerts: null,
          },
          config: {
            removeBackButton: false,
            skippableItem: false,
            addScores: false,
            setAlerts: false,
            additionalResponseOption: {
              textInputOption: false,
              textInputRequired: false,
            },
            showTickMarks: false,
            showTickLabels: false,
            continuousSlider: false,
            timer: 0,
          },
          name: 'Item3',
          isHidden: false,
          conditionalLogic: {
            match: 'any',
            conditions: [
              {
                itemName: 'Item2',
                type: 'NOT_INCLUDES_OPTION',
                payload: {
                  optionValue: '0',
                },
              },
            ],
          },
          allowEdit: true,
          id: '97c34ed6-4d18-4cb6-a0c8-b1cb2efaa24c',
          order: 3,
        },
        {
          question: {
            en: 'time',
          },
          responseType: 'time',
          responseValues: null,
          config: {
            removeBackButton: false,
            skippableItem: false,
            additionalResponseOption: {
              textInputOption: false,
              textInputRequired: false,
            },
            timer: 0,
          },
          name: 'Item4',
          isHidden: false,
          conditionalLogic: null,
          allowEdit: true,
          id: '4b334484-947b-4287-941c-ed4cbf0dc955',
          order: 4,
        },
        {
          question: {
            en: 'text',
          },
          responseType: 'text',
          responseValues: null,
          config: {
            removeBackButton: false,
            skippableItem: false,
            maxResponseLength: 300,
            correctAnswerRequired: false,
            correctAnswer: '',
            numericalResponseRequired: false,
            responseDataIdentifier: false,
            responseRequired: false,
            isIdentifier: null,
          },
          name: 'Item5',
          isHidden: false,
          conditionalLogic: null,
          allowEdit: true,
          id: '8fa4788f-54a5-40c4-82c5-2c297a94b959',
          order: 5,
        },
      ],
      createdAt: '2023-10-19T08:29:43.180317',
      isPerformanceTask: false,
      performanceTaskType: null,
    },
  ],
  activityFlows: [
    {
      name: 'af1',
      description: {
        en: 'afd',
      },
      isSingleReport: false,
      hideBadge: false,
      reportIncludedActivityName: null,
      reportIncludedItemName: null,
      isHidden: false,
      id: 'c109d25c-7ecc-4dae-b8c9-7334bc427c34',
      items: [
        {
          activityId: '56a4ebe4-3d7f-485c-8293-093cabf29fa3',
          id: 'e9194ba5-d997-4580-b989-144e8b4a2692',
          order: 1,
        },
      ],
      order: 1,
      createdAt: '2023-10-27T13:34:22.037875',
    },
  ],
};

export const mockedManagerId = '097f4161-a7e4-4ea9-8836-79149dsda74ff';
export const mockedManager = {
  id: mockedManagerId,
  firstName: 'TestFirstName',
  lastName: 'TestLastName',
  email: mockedEmail,
  roles: [Roles.Reviewer],
  lastSeen: '2023-08-15T13:39:24.058402',
  isPinned: false,
  applets: [
    {
      id: mockedAppletId,
      displayName: 'displayName',
      image: '',
      roles: [
        {
          accessId: '17ba7d95-f766-42ae-9ce6-2f8fcc3l24a',
          role: Roles.Reviewer,
          reviewerRespondents: [mockedRespondentId],
        },
      ],
      encryption: mockedEncryption,
    },
  ],
};

export const mockedAppletFormData = {
  displayName: 'dataviz',
  description: '',
  about: '',
  id: '2e46fa32-ea7c-4a76-b49b-1c97d795bb9a',
  activities: [
    {
      name: 'New Activity',
      id: '56a4ebe4-3d7f-485c-8293-093cabf29fa3',
      items: [
        {
          id: 'c17b7b59-8074-4c69-b787-88ea9ea3df5d',
          name: 'Item1',
          responseType: 'singleSelect',
          responseValues: {
            options: [
              {
                id: '0d764084-f3bb-4a91-b74d-3fae4a0beb1f',
                text: 's1',
                score: 2,
                value: 0,
              },
              {
                id: 'e3ca9405-71e9-4627-8311-d405f383246e',
                text: 's23333333',
                score: 4,
                value: 1,
              },
            ],
          },
          order: 1,
        },
        {
          id: 'dad4e249-6a19-4c71-9806-e87b1c9e751b',
          name: 'Item2',
          responseType: 'multiSelect',
          responseValues: {
            options: [
              {
                id: '7a71bf32-8d25-4040-88a0-8ae3f1c4f8bc',
                text: 'm1',
                score: 1,
                value: 0,
              },
              {
                id: '188fc535-1e45-444d-88ec-91cb29737b03',
                text: 'm2',
                score: 1,
                value: 1,
              },
              {
                id: 'cea898cc-d4be-4320-be11-b6bc6e72a9d1',
                text: 'm3',
                score: 1,
                value: 2,
              },
            ],
          },
          order: 2,
        },
        {
          id: '97c34ed6-4d18-4cb6-a0c8-b1cb2efaa24c',
          name: 'Item3',
          responseType: 'slider',
          responseValues: {
            minLabel: 'min',
            maxLabel: 'max',
            minValue: 1,
            maxValue: 4,
          },
          order: 3,
        },
        {
          id: '4b334484-947b-4287-941c-ed4cbf0dc955',
          name: 'Item4',
          responseType: 'time',
          responseValues: null,
          order: 4,
        },
        {
          id: '8fa4788f-54a5-40c4-82c5-2c297a94b959',
          name: 'Item5',
          responseType: 'text',
          responseValues: null,
          order: 5,
        },
      ],
      createdAt: '2023-10-19T08:29:43.180317',
      isPerformanceTask: false,
      performanceTaskType: null,
      conditionalLogic: [
        {
          key: '597ffffb-9bce-4c73-9627-cc1bab064b7e',
          itemKey: 'dad4e249-6a19-4c71-9806-e87b1c9e751b',
          match: 'any',
          conditions: [
            {
              key: '25616abd-799b-4aff-90d5-74c3cd956d54',
              type: 'EQUAL_TO_OPTION',
              payload: {
                optionValue: '0d764084-f3bb-4a91-b74d-3fae4a0beb1f',
              },
              itemName: 'c17b7b59-8074-4c69-b787-88ea9ea3df5d',
            },
          ],
        },
        {
          key: 'a420fd93-5576-4d99-9394-403cd4a00390',
          itemKey: '97c34ed6-4d18-4cb6-a0c8-b1cb2efaa24c',
          match: 'any',
          conditions: [
            {
              key: '296f9140-f283-4040-b9e7-5c43221d5a5e',
              type: 'NOT_INCLUDES_OPTION',
              payload: {
                optionValue: '7a71bf32-8d25-4040-88a0-8ae3f1c4f8bc',
              },
              itemName: 'dad4e249-6a19-4c71-9806-e87b1c9e751b',
            },
          ],
        },
      ],
    },
  ],
  activityFlows: [
    {
      name: 'af1',
      description: 'afd',
      isSingleReport: false,
      hideBadge: false,
      reportIncludedActivityName: null,
      reportIncludedItemName: null,
      isHidden: false,
      id: 'c109d25c-7ecc-4dae-b8c9-7334bc427c34',
      items: [
        {
          id: 'e9194ba5-d997-4580-b989-144e8b4a2692',
          activityKey: '56a4ebe4-3d7f-485c-8293-093cabf29fa3',
        },
      ],
      createdAt: '2023-10-27T13:34:22.037875',
    },
  ],
};
