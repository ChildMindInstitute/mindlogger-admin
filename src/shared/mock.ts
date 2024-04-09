// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { generatePath } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { Applet } from 'api';
import { page } from 'resources';
import { ItemFormValuesCommonType } from 'modules/Builder/types';
import { RespondentStatus } from 'modules/Dashboard/types';

import {
  CalculationType,
  ConditionalLogicMatch,
  ItemResponseType,
  Roles,
  ScoreReportType,
  SubscaleTotalScore,
} from './consts';
import { MultiSelectItem, SingleSelectItem } from './state';

export const mockedEmail = 'test@gmail.com';
export const mockedPassword = '123456!Qwe';
export const mockedAppletId = '2e46fa32-ea7c-4a76-b49b-1c97d795bb9a';
export const mockedActivityId = '56a4ebe4-3d7f-485c-8293-093cabf29fa3';

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
export const mockedPrivateKey2 = [
  88, 239, 191, 189, 15, 91, 94, 58, 113, 28, 239, 191, 189, 2, 16, 194, 139, 239, 191, 189, 239,
  191, 189, 14, 63, 28, 239, 191, 189, 239, 191, 189, 239, 191, 189, 116, 239, 191, 189, 239, 191,
  189, 75, 239, 191, 189, 239, 191, 189, 119, 101, 239, 191, 189, 102, 239, 191, 189, 42, 239, 191,
  189, 50, 113, 88, 102, 239, 191, 189, 88, 239, 191, 189, 25, 210, 143, 239, 191, 189, 239, 191,
  189, 99, 239, 191, 189, 4, 239, 191, 189, 208, 188, 18, 80, 91, 239, 191, 189, 222, 181, 239, 191,
  189, 202, 142, 65, 239, 191, 189, 50, 239, 191, 189, 80, 239, 191, 189, 55, 67, 239, 191, 189, 64,
  239, 191, 189, 34, 239, 191, 189, 239, 191, 189, 239, 191, 189, 44, 4, 239, 191, 189, 53, 14, 16,
  28, 14, 239, 191, 189, 118, 85, 30, 32, 239, 191, 189, 239, 191, 189, 5, 239, 191, 189, 50, 87,
  239, 191, 189, 31, 239, 191, 189, 4, 100, 99, 49, 239, 191, 189, 25, 239, 191, 189, 57, 239, 191,
  189, 27, 30, 94, 239, 191, 189, 11, 239, 191, 189, 109, 92, 15, 90, 239, 191, 189, 239, 191, 189,
  239, 191, 189, 239, 191, 189, 239, 191, 189, 67, 239, 191, 189, 63,
];

export const mockedOwnerId = '123123';
export const mockedCurrentWorkspace = {
  data: {
    ownerId: mockedOwnerId,
    workspaceName: 'name',
  },
};
export const mockedRespondentId = 'b60a142d-2b7f-4328-841c-dbhjhj4afcf1c7';
export const mockedSubjectId1 = 'subject-id-987';
export const mockedRespondentDetails = {
  appletId: mockedAppletId,
  appletDisplayName: 'Mocked Applet',
  appletImage: '',
  accessId: 'aebf08ab-c781-4229-a625-271838ebdff4',
  respondentNickname: 'Mocked Respondent',
  respondentSecretId: '3921968c-3903-4872-8f30-a6e6a10cef36',
  hasIndividualSchedule: false,
  encryption: mockedEncryption,
  subjectId: mockedSubjectId1,
};
export const mockedRespondent = {
  id: mockedRespondentId,
  nicknames: ['Mocked Respondent'],
  secretIds: ['mockedSecretId'],
  isAnonymousRespondent: false,
  lastSeen: new Date().toDateString(),
  isPinned: false,
  accessId: 'aebf08ab-c781-4229-a625-271838ebdff4',
  role: Roles.Respondent,
  details: [mockedRespondentDetails],
  status: RespondentStatus.Invited,
  email: 'resp1@mail.com',
};
export const mockedRespondentId2 = 'b60a142d-2b7f-4328-841c-ddsdddj4afcf1c7';
export const mockedSubjectId2 = 'subject-id-123';
export const mockedRespondent2 = {
  id: mockedRespondentId2,
  nicknames: ['Test Respondent'],
  secretIds: ['testSecretId'],
  isAnonymousRespondent: false,
  lastSeen: new Date().toDateString(),
  isPinned: false,
  accessId: 'aebf08ab-c781-4229-a625-271838ebdff4',
  role: Roles.Respondent,
  status: RespondentStatus.Invited,
  email: 'resp2@mail.com',
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
      subjectId: mockedSubjectId2,
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
  reportEmailBody: 'Please see the report attached to this email.',
  encryption: mockedEncryption,
  id: mockedAppletId,
  version: '1.1.3',
  createdAt: '2023-09-26T12:11:46.162083',
  updatedAt: '2023-10-19T08:29:43.167613',
  isPublished: false,
  activities: [
    {
      name: 'Existing Activity',
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
          config: {},
          name: 'Item1',
          id: 'c17b7b59-8074-4c69-b787-88ea9ea3df5d',
          order: 1,
        },
        {
          question: {
            en: 'ms',
          },
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
          config: {},
          name: 'Item2',
          conditionalLogic: {
            match: ConditionalLogicMatch.Any,
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
          },
          config: {},
          name: 'Item3',
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
          id: '97c34ed6-4d18-4cb6-a0c8-b1cb2efaa24c',
          order: 3,
        },
        {
          question: {
            en: 'time',
          },
          responseType: 'time',
          responseValues: null,
          config: {},
          name: 'Item4',
          id: '4b334484-947b-4287-941c-ed4cbf0dc955',
          order: 4,
        },
        {
          question: {
            en: 'text',
          },
          responseType: 'text',
          responseValues: null,
          config: {},
          name: 'Item5',
          id: '8fa4788f-54a5-40c4-82c5-2c297a94b959',
          order: 5,
        },
      ],
      createdAt: '2023-10-19T08:29:43.180317',
      isPerformanceTask: false,
      performanceTaskType: null,
    },
    {
      name: 'Newly added activity',
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
      key: uuidv4(),
      items: [],
      createdAt: '2023-10-19T08:29:43.180317',
      isPerformanceTask: false,
      performanceTaskType: null,
    },
  ],
  activityFlows: [
    {
      name: 'Existing Activity Flow',
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
    {
      name: 'Newly Added Activity Flow',
      description: {
        en: 'afd',
      },
      isSingleReport: false,
      hideBadge: false,
      reportIncludedActivityName: null,
      reportIncludedItemName: null,
      isHidden: false,
      key: uuidv4(),
      items: [
        {
          activityId: '56a4ebe4-3d7f-485c-8293-093cabf29fa3',
          id: 'e9194ba5-d997-4580-b989-144e8b4a2692',
          order: 1,
        },
      ],
      order: 2,
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
          reviewerSubjects: [mockedSubjectId1],
        },
      ],
      encryption: mockedEncryption,
    },
  ],
};

export const mockedSingleSelectFormValues = {
  id: 'c17b7b59-8074-4c69-b787-88ea9ea3df5d',
  name: 'Item1',
  responseType: 'singleSelect',
  responseValues: {
    options: [
      {
        id: '0d764084-f3bb-4a91-b74d-3fae4a0beb1f',
        text: 's1',
        score: 1,
        value: 0,
      },
      {
        id: 'e3ca9405-71e9-4627-8311-d405f383246e',
        text: 's23333333',
        score: 2,
        value: 1,
      },
    ],
  },
  order: 1,
  question: '',
  config: {
    addScores: true,
    addTooltip: false,
    setAlerts: false,
    additionalResponseOption: {
      textInputOption: false,
      textInputRequired: false,
    },
    setPalette: false,
    timer: 0,
    skippableItem: false,
    removeBackButton: false,
    randomizeOptions: false,
    autoAdvance: false,
  },
};

export const mockedMultiSelectFormValues = {
  id: 'dad4e249-6a19-4c71-9806-e87b1c9e751b',
  name: 'Item2',
  responseType: 'multiSelect',
  responseValues: {
    options: [
      {
        id: '7a71bf32-8d25-4040-88a0-8ae3f1c4f8bc',
        text: 'm1',
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
        value: 2,
      },
    ],
  },
  order: 2,
  config: {
    addScores: false,
  },
};

export const mockedSliderFormValues = {
  id: '97c34ed6-4d18-4cb6-a0c8-b1cb2efaa24c',
  name: 'Item3',
  responseType: 'slider',
  responseValues: {
    minLabel: 'min',
    maxLabel: 'max',
    minValue: 1,
    maxValue: 4,
    scores: [1, 2, 3, 4],
  },
  order: 3,
  question: '',
  config: {
    addScores: true,
    showTickMarks: false,
    showTickLabels: false,
    continuousSlider: false,
  },
};

export const mockedTimeFormValues = {
  id: '4b334484-947b-4287-941c-ed4cbf0dc955',
  name: 'Item4',
  responseType: 'time',
  responseValues: null,
  order: 4,
};

export const mockedTextFormValues = {
  id: '8fa4788f-54a5-40c4-82c5-2c297a94b959',
  name: 'Item5',
  responseType: 'text',
  responseValues: null,
  order: 5,
  config: {
    responseDataIdentifier: false,
    correctAnswerRequired: false,
    numericalResponseRequired: false,
    responseRequired: false,
    skippableItem: true,
  },
};

export const mockedAudioPlayerFormValues = {
  id: 'ec6aea37-4ca2-4360-b7ca-15a3c6f78513',
  name: 'audioplayer',
  responseType: 'audioPlayer',
  responseValues: {
    file: 'file.mp3',
  },
  order: 6,
  config: {
    playOnce: false,
  },
};

export const mockedDrawingFormValues = {
  id: '4a176a2c-86c0-4f63-94ba-37fe016d9009',
  name: 'drawing',
  responseType: 'drawing',
  responseValues: {
    drawingExample: null,
    drawingBackground: null,
    proportion: {
      enabled: null,
    },
  },
  config: {
    removeUndoButton: false,
    navigationToTop: false,
  },
  order: 7,
};

export const mockedSingleSelectPerRowFormValues = {
  id: '1b6e9916-e0f6-4bbe-b30f-11cf53722804',
  name: 'sspr',
  responseType: 'singleSelectRows',
  responseValues: {
    rows: [
      {
        id: '97aaab63-ccc2-44c6-bd39-4aea6e521726',
        rowName: 'r1',
      },
      {
        id: '063814d7-f16b-4568-a5c3-ab22230bc00d',
        rowName: 'r2',
      },
    ],
    options: [
      {
        id: '1879ab0a-d12c-4d8e-bef2-2f430c1ff826',
        text: 'o1',
      },
      {
        id: '3efa00c2-71f9-4f2e-a9ad-7da3a087e294',
        text: 'o2',
      },
    ],
  },
  order: 9,
};

export const mockedSliderRowsFormValues = {
  id: '209618c3-7d3b-4b51-89b1-14af64c212ec',
  name: 'sliderrows',
  responseType: 'sliderRows',
  responseValues: {
    rows: [
      {
        minLabel: 'min',
        maxLabel: 'max',
        minValue: 1,
        maxValue: 5,
        id: '54fb94f8-6932-420e-b068-b20ab32337c5',
        label: 'slider1',
      },
      {
        minLabel: 'min',
        maxLabel: 'max',
        minValue: 1,
        maxValue: 6,
        id: '83ca156f-3802-4912-9242-47ae9be3c5d9',
        label: 'slider2',
      },
    ],
    options: [],
  },
  config: {},
  order: 8,
};

export const mockedInvitation = {
  result: [
    {
      email: mockedEmail,
      appletId: mockedAppletId,
      appletName: 'Mocked Applet',
      role: Roles.Editor,
      key: 'e6fdab42-412d-312c-a1e6-a6ee3a72a777',
      status: 'pending',
      firstName: 'Jane',
      lastName: 'Doe',
      createdAt: '2023-11-02T08:37:13.652256',
      secretUserId: null,
      nickname: null,
      meta: {},
    },
  ],
  count: 1,
};

export const mockedScoreReport = {
  type: ScoreReportType.Score,
  name: 'firstScore',
  id: 'sumScore_firstscore',
  key: '5bad6e4a-7035-4ddd-9c54-375604025a',
  calculationType: CalculationType.Sum,
  itemsScore: ['Item1', 'Item3'],
  showMessage: true,
  message: 'message [[sumScore_firstscore]]',
  printItems: true,
  itemsPrint: ['Item1', 'Item3'],
  conditionalLogic: [
    {
      name: 'cnsdsd',
      id: 'sumScore_firstscore_cnsdsd',
      flagScore: false,
      showMessage: true,
      message: 'message',
      printItems: false,
      itemsPrint: [],
      match: 'all',
      conditions: [
        {
          itemName: 'sumScore_firstscore',
          type: 'EQUAL',
          payload: {
            value: 0,
          },
        },
        {
          itemName: 'sumScore_firstscore',
          type: 'LESS_THAN',
          payload: {
            value: 2,
          },
        },
      ],
    },
  ],
};

export const mockedSectionReport = {
  type: ScoreReportType.Section,
  name: 'firstSection',
  showMessage: true,
  message: 'section message',
  printItems: true,
  itemsPrint: ['Item1', 'Item3'],
  conditionalLogic: {
    match: ConditionalLogicMatch.Any,
    conditions: [
      {
        itemName: 'Item1',
        type: 'GREATER_THAN',
        payload: {
          value: 1,
        },
      },
      {
        itemName: 'sumScore_firstscore_cnsdsd',
        type: 'EQUAL_TO_SCORE',
        payload: {
          value: false,
        },
      },
    ],
  },
};

export const mockedSimpleAppletFormData = {
  displayName: 'Test',
  description: 'Test',
  themeId: '',
  about: 'Test',
  image: '',
  watermark: '',
  activities: [
    {
      name: 'New Activity',
      description: 'Test',
      showAllAtOnce: false,
      isSkippable: false,
      responseIsEditable: true,
      isHidden: false,
      isReviewable: false,
      items: [
        {
          responseType: 'text',
          name: 'Item',
          question: 'Test',
          config: {
            removeBackButton: false,
            skippableItem: false,
            maxResponseLength: 300,
            correctAnswerRequired: false,
            correctAnswer: '',
            numericalResponseRequired: false,
            responseDataIdentifier: false,
            responseRequired: false,
          },
          isHidden: false,
          allowEdit: true,
          key: '03b655eb-6478-45f4-8625-5ef6bf5877db',
          alerts: [],
          responseValues: {},
        },
      ],
      scoresAndReports: {
        generateReport: false,
        reports: [],
        showScoreSummary: false,
      },
      conditionalLogic: [],
      key: 'c913d560-b69d-47ec-828c-eec12c47ca24',
    },
  ],
  activityFlows: [],
  reportEmailBody: 'Please see the report attached to this email.',
};

export const mockedAppletFormData = {
  displayName: 'dataviz',
  description: '',
  about: '',
  id: '2e46fa32-ea7c-4a76-b49b-1c97d795bb9a',
  activities: [
    {
      name: 'New Activity',
      id: mockedActivityId,
      items: [
        mockedSingleSelectFormValues,
        mockedMultiSelectFormValues,
        mockedSliderFormValues,
        mockedTimeFormValues,
        mockedTextFormValues,
        mockedAudioPlayerFormValues,
        mockedDrawingFormValues,
        mockedSliderRowsFormValues,
        mockedSingleSelectPerRowFormValues,
      ],
      createdAt: '2023-10-19T08:29:43.180317',
      isPerformanceTask: false,
      performanceTaskType: null,
      scoresAndReports: {
        generateReport: false,
        showScoreSummary: false,
        reports: [mockedScoreReport, mockedSectionReport],
      },
      conditionalLogic: [
        {
          key: '597ffffb-9bce-4c73-9627-cc1bab064b7e',
          itemKey: 'dad4e249-6a19-4c71-9806-e87b1c9e751b',
          match: ConditionalLogicMatch.Any,
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
          match: ConditionalLogicMatch.Any,
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

export const mockedSingleActivityItem: SingleSelectItem<ItemFormValuesCommonType> = {
  question: 'single [[text_last]]',
  responseType: ItemResponseType.SingleSelection,
  responseValues: {
    paletteName: undefined,
    options: [
      {
        id: 'b9a71359-467a-4bb8-84a5-6a8fe61da246',
        text: 'opt1',
        image: undefined,
        score: 4,
        tooltip: undefined,
        isHidden: false,
        color: undefined,
        alert: undefined,
        value: 1,
      },
      {
        id: '000394a5-2963-4f12-8b5f-e9340051512a',
        text: 'opt2',
        image: undefined,
        score: 2,
        tooltip: undefined,
        isHidden: false,
        color: undefined,
        alert: undefined,
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
      textInputOption: true,
      textInputRequired: false,
    },
    autoAdvance: false,
  },
  name: 'single_text_score',
  isHidden: false,
  conditionalLogic: undefined,
  allowEdit: true,
  id: 'ea07cf9f-4fd3-42e7-b4a1-f88fb00ef629',
};

export const mockedMultiActivityItem: MultiSelectItem<ItemFormValuesCommonType> = {
  question: 'multi [[single_text_score]]',
  responseType: ItemResponseType.MultipleSelection,
  responseValues: {
    paletteName: undefined,
    options: [
      {
        id: '19c1af9b-c9d1-4b33-819a-9eff33b6d300',
        text: 'opt1',
        image: undefined,
        score: 2,
        tooltip: undefined,
        isHidden: false,
        color: undefined,
        alert: undefined,
        value: 1,
      },
      {
        id: 'abf02196-916c-4b0c-84ae-0381d4a98cb9',
        text: 'opt2',
        image: undefined,
        score: 1,
        tooltip: undefined,
        isHidden: false,
        color: undefined,
        alert: undefined,
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
      textInputOption: undefined,
      textInputRequired: false,
    },
  },
  name: 'multi_text_score',
  isHidden: false,
  conditionalLogic: undefined,
  allowEdit: true,
  id: '63b765ff-73aa-453f-8d0d-fc7bca72fd1f',
};

export const mockedSliderActivityItem = {
  question: 'slider [[multi_text_score]]',
  responseType: 'slider',
  responseValues: {
    minLabel: 'min',
    maxLabel: 'max',
    minValue: 0,
    maxValue: 5,
    minImage: null,
    maxImage: null,
    scores: [1, 2, 3, 4, 5, 6],
    alerts: null,
  },
  config: {
    removeBackButton: false,
    skippableItem: false,
    addScores: true,
    setAlerts: false,
    additionalResponseOption: {
      textInputOption: true,
      textInputRequired: false,
    },
    showTickMarks: false,
    showTickLabels: false,
    continuousSlider: false,
    timer: 0,
  },
  name: 'slider_text_score',
  isHidden: false,
  conditionalLogic: null,
  allowEdit: true,
  id: '29788e14-4118-47d5-b29e-f22263259e0f',
};

export const mockedDateActivityItem = {
  question: 'date [[slider_text_score]]',
  responseType: 'date',
  responseValues: null,
  config: {
    removeBackButton: false,
    skippableItem: false,
    additionalResponseOption: {
      textInputOption: true,
      textInputRequired: false,
    },
    timer: 0,
  },
  name: 'date_text',
  isHidden: false,
  conditionalLogic: null,
  allowEdit: true,
  id: '4b2c282b-4597-44d9-aefb-d8ccc927c50b',
};

export const mockedNumberSelectActivityItem = {
  question: 'number_selection_text \n[[date_text]]',
  responseType: 'numberSelect',
  responseValues: {
    minValue: 0,
    maxValue: 7,
  },
  config: {
    removeBackButton: false,
    skippableItem: false,
    additionalResponseOption: {
      textInputOption: true,
      textInputRequired: false,
    },
  },
  name: 'number_selection_text',
  isHidden: false,
  conditionalLogic: null,
  allowEdit: true,
  id: '1b50376d-d4c7-4bd5-8dfc-bab04e2e1ab5',
};

export const mockedTimeActivityItem = {
  question: 'time_text [[number_selection_text]]',
  responseType: 'time',
  responseValues: null,
  config: {
    removeBackButton: false,
    skippableItem: false,
    additionalResponseOption: {
      textInputOption: true,
      textInputRequired: false,
    },
    timer: 0,
  },
  name: 'time_text',
  isHidden: false,
  conditionalLogic: null,
  allowEdit: true,
  id: '396c7e8d-6599-4258-8c3e-3ef91205292b',
};

export const mockedTimeRangeActivityItem = {
  question: 'time_range_text',
  responseType: 'timeRange',
  responseValues: null,
  config: {
    removeBackButton: false,
    skippableItem: false,
    additionalResponseOption: {
      textInputOption: true,
      textInputRequired: false,
    },
    timer: 0,
  },
  name: 'time_range_text',
  isHidden: false,
  conditionalLogic: null,
  allowEdit: true,
  id: 'c551530e-c718-43ea-a045-287211bee95e',
};

export const mockedSingleSelectRowsActivityItem = {
  question: 'single_row_score [[time_range_text]]',
  responseType: 'singleSelectRows',
  responseValues: {
    rows: [
      {
        id: '52c21500-99db-4a65-a257-c2e54e7370d3',
        rowName: 'row1',
        rowImage: null,
        tooltip: null,
      },
    ],
    options: [
      {
        id: '8747ed38-f4b3-4fde-855e-20471ca0aa8e',
        text: 'opt1',
        image: null,
        tooltip: null,
      },
      {
        id: 'd79a44c2-78b6-4fdd-b6fa-8bf41d0b3760',
        text: 'opt1',
        image: null,
        tooltip: null,
      },
    ],
    dataMatrix: [
      {
        rowId: '52c21500-99db-4a65-a257-c2e54e7370d3',
        options: [
          {
            optionId: '8747ed38-f4b3-4fde-855e-20471ca0aa8e',
            score: 2,
            alert: null,
            value: 1,
          },
          {
            optionId: 'd79a44c2-78b6-4fdd-b6fa-8bf41d0b3760',
            score: 4,
            alert: null,
            value: 2,
          },
        ],
      },
    ],
  },
  config: {
    removeBackButton: false,
    skippableItem: false,
    timer: 0,
    addScores: true,
    setAlerts: false,
    addTooltip: false,
    addTokens: null,
  },
  name: 'single_row_score',
  isHidden: false,
  conditionalLogic: null,
  allowEdit: true,
  id: '7daf4dce-d323-4c64-9e13-e843283fa280',
};

export const mockedMultiSelectRowsActivityItem = {
  question: 'multi_row_score',
  responseType: 'multiSelectRows',
  responseValues: {
    rows: [
      {
        id: '1248a537-218e-4285-99ca-d435a79fea39',
        rowName: 'row1',
        rowImage: null,
        tooltip: null,
      },
    ],
    options: [
      {
        id: '95fdad7a-a94b-46ca-907c-5ef858df8535',
        text: 'opt1',
        image: null,
        tooltip: null,
      },
      {
        id: '6c1aa535-34f3-424f-bde4-40d937b0013b',
        text: 'opt1',
        image: null,
        tooltip: null,
      },
    ],
    dataMatrix: [
      {
        rowId: '1248a537-218e-4285-99ca-d435a79fea39',
        options: [
          {
            optionId: '95fdad7a-a94b-46ca-907c-5ef858df8535',
            score: 3,
            alert: null,
            value: 1,
          },
          {
            optionId: '6c1aa535-34f3-424f-bde4-40d937b0013b',
            score: 5,
            alert: null,
            value: 2,
          },
        ],
      },
    ],
  },
  config: {
    removeBackButton: false,
    skippableItem: false,
    timer: 0,
    addScores: true,
    setAlerts: false,
    addTooltip: false,
    addTokens: null,
  },
  name: 'multi_row_score',
  isHidden: false,
  conditionalLogic: null,
  allowEdit: true,
  id: 'f81599a0-bd06-4453-8ea7-2c2a51aa510e',
};

export const mockedSliderRowsActivityItem = {
  question: 'slider_row_score',
  responseType: 'sliderRows',
  responseValues: {
    rows: [
      {
        minLabel: 'min',
        maxLabel: 'max',
        minValue: 1,
        maxValue: 5,
        minImage: null,
        maxImage: null,
        scores: [1, 2, 3, 4, 5],
        alerts: null,
        id: '87ff7de0-3552-4a14-b748-d6bcb12f4d87',
        label: 'slider',
      },
    ],
  },
  config: {
    removeBackButton: false,
    skippableItem: false,
    addScores: true,
    setAlerts: false,
    timer: 0,
  },
  name: 'slider_row_score',
  isHidden: false,
  conditionalLogic: null,
  allowEdit: true,
  id: '9361e8b1-2fd8-42b3-8f28-a3d7150334bb',
};

export const mockedTextActivityItem = {
  question: 'text',
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
  name: 'text',
  isHidden: false,
  conditionalLogic: null,
  allowEdit: true,
  id: '5bad6e4a-7035-4ddd-9c54-375604025a1f',
};

export const mockedDrawingActivityItem = {
  question: 'drawing_text [[text]]',
  responseType: 'drawing',
  responseValues: {
    drawingExample:
      'https://media-dev.cmiml.net/mindlogger/391962851007982489/91c9d624-3ab1-45ca-8f68-4cfc94cdd195/Transfer Ownership - 1.png',
    drawingBackground:
      'https://media-dev.cmiml.net/mindlogger/391962851007982489/3374a78e-0a46-4add-b89e-d5bff79e9678/Transfer Ownership - 1.png',
  },
  config: {
    removeBackButton: false,
    skippableItem: false,
    additionalResponseOption: {
      textInputOption: true,
      textInputRequired: false,
    },
    timer: 0,
    removeUndoButton: false,
    navigationToTop: false,
  },
  name: 'drawing_text',
  isHidden: false,
  conditionalLogic: null,
  allowEdit: true,
  id: 'ebc231b0-4a1c-4717-99de-0504b04d0e25',
};

export const mockedPhotoActivityItem = {
  question: 'photo_text',
  responseType: 'photo',
  responseValues: null,
  config: {
    removeBackButton: false,
    skippableItem: false,
    additionalResponseOption: {
      textInputOption: true,
      textInputRequired: false,
    },
    timer: 0,
  },
  name: 'photo_text',
  isHidden: false,
  conditionalLogic: null,
  allowEdit: true,
  id: '129a20df-5330-494c-8c4c-eb3c7847fe95',
};

export const mockedVideoActivityItem = {
  question: 'video_text',
  responseType: 'video',
  responseValues: null,
  config: {
    removeBackButton: false,
    skippableItem: false,
    additionalResponseOption: {
      textInputOption: true,
      textInputRequired: false,
    },
    timer: 0,
  },
  name: 'video_text',
  isHidden: false,
  conditionalLogic: null,
  allowEdit: true,
  id: 'b66763bc-2890-46db-9e55-8dc43829c9c6',
};

export const mockedAudioActivityItem = {
  question: 'audio_text',
  responseType: 'audio',
  responseValues: {
    maxDuration: 300,
  },
  config: {
    removeBackButton: false,
    skippableItem: true,
    additionalResponseOption: {
      textInputOption: true,
      textInputRequired: false,
    },
    timer: 0,
  },
  name: 'audio_text',
  isHidden: false,
  conditionalLogic: null,
  allowEdit: true,
  id: '2a56ef07-18ed-4102-8a5d-be69edf12968',
};

export const mockedMessageActivityItem = {
  question: 'message ',
  responseType: 'message',
  responseValues: null,
  config: {
    removeBackButton: false,
    timer: 0,
  },
  name: 'message',
  isHidden: false,
  conditionalLogic: null,
  allowEdit: true,
  id: '2f317638-d0a7-42ed-961f-e701d340aa03',
};

export const mockedAudioPlayerActivityItem = {
  question: 'audio_player_text',
  responseType: 'audioPlayer',
  responseValues: {
    file: 'https://media-dev.cmiml.net/mindlogger/391962851007982489/b6d8573c-8174-41cb-b0fa-ad9fb0d237ff/t-rex-roar.mp3',
  },
  config: {
    removeBackButton: false,
    skippableItem: true,
    additionalResponseOption: {
      textInputOption: true,
      textInputRequired: false,
    },
    playOnce: false,
  },
  name: 'audio_player_text',
  isHidden: false,
  conditionalLogic: null,
  allowEdit: true,
  id: 'e171deee-b161-4140-9dae-77c70765c031',
};

export const mockedExportContextItemData = {
  id: '949f248c-1a4b-4a35-a5a2-898dfef72050',
  submitId: 'becbb3e7-3e29-4b27-a224-85ee4db54c86',
  version: '2.0.0',
  respondentId: '835e5277-5949-4dff-817a-d85c17a3604f',
  respondentSecretId: 'respondentSecretId',
  legacyProfileId: null,
  scheduledDatetime: null,
  startDatetime: 1689755822,
  endDatetime: 1689756087,
  migratedDate: null,
  appletHistoryId: '7aa07032-93f5-41aa-a4e1-b24d92405bc0_2.0.0',
  activityHistoryId: '62e7e2c2-9fdb-4f2f-8460-78375a657f57_2.0.0',
  flowHistoryId: null,
  flowName: null,
  reviewedAnswerId: null,
  createdAt: '2023-07-19T08:41:37.130943',
  appletId: '7aa07032-93f5-41aa-a4e1-b24d92405bc0',
  activityId: '62e7e2c2-9fdb-4f2f-8460-78375a657f57',
  flowId: null,
  activityName: 'New Activity#1',
  subscaleSetting: null,
};

export const mockedItemsOfParsedAnswers = [
  {
    question: 'single',
    responseType: 'singleSelect',
    responseValues: {
      paletteName: null,
      options: [
        {
          id: 'fbb48a19-3ea6-4999-ac1c-5852a75c1d8a',
          text: 'opt1',
          image: null,
          score: null,
          tooltip: null,
          isHidden: false,
          color: null,
          alert: null,
          value: 0,
        },
        {
          id: '3ffd3440-1438-44a0-9965-b6c70978d5c3',
          text: 'opt2',
          image: null,
          score: null,
          tooltip: null,
          isHidden: false,
          color: null,
          alert: null,
          value: 1,
        },
        {
          id: '081fc595-dfc7-41b9-ad72-c4242305d7cb',
          text: 'opt3',
          image: null,
          score: null,
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
      addScores: false,
      setAlerts: false,
      addTooltip: false,
      setPalette: false,
      addTokens: null,
      additionalResponseOption: {
        textInputOption: false,
        textInputRequired: false,
      },
      autoAdvance: false,
    },
    name: 'single',
    isHidden: false,
    conditionalLogic: null,
    allowEdit: true,
    id: '5470cf91-76bf-48b4-b3da-4a615313c257',
  },
  {
    question: 'multi',
    responseType: 'multiSelect',
    responseValues: {
      paletteName: null,
      options: [
        {
          id: '0f4776b3-5dd2-4c72-92af-474ca9b956f2',
          text: 'opt1',
          image: null,
          score: null,
          tooltip: null,
          isHidden: false,
          color: null,
          alert: null,
          value: 0,
        },
        {
          id: '4c03f3a4-d239-4707-a962-08d49a4f145b',
          text: 'opt2',
          image: null,
          score: null,
          tooltip: null,
          isHidden: false,
          color: null,
          alert: null,
          value: 1,
        },
        {
          id: 'ad8ba486-9b4d-4133-8d78-cbffd070e5d6',
          text: 'opt3',
          image: null,
          score: null,
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
      addScores: false,
      setAlerts: false,
      addTooltip: false,
      setPalette: false,
      addTokens: null,
      additionalResponseOption: {
        textInputOption: false,
        textInputRequired: false,
      },
    },
    name: 'multi',
    isHidden: false,
    conditionalLogic: null,
    allowEdit: true,
    id: 'dd9c96ad-b57c-4440-b284-27c7f1351fd0',
  },
  {
    question: 'slider',
    responseType: 'slider',
    responseValues: {
      minLabel: 'min',
      maxLabel: 'max',
      minValue: 0,
      maxValue: 5,
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
    name: 'slider',
    isHidden: false,
    conditionalLogic: null,
    allowEdit: true,
    id: 'ab47ab74-1ae5-475b-b1cb-bc868ead793f',
  },
];

export const mockedParsedAnswers = [
  {
    decryptedAnswers: [
      {
        activityItem: {
          question: 'single',
          responseType: 'singleSelect',
          responseValues: {
            paletteName: null,
            options: [
              {
                id: 'fbb48a19-3ea6-4999-ac1c-5852a75c1d8a',
                text: 'opt1',
                image: null,
                score: null,
                tooltip: null,
                isHidden: false,
                color: null,
                alert: null,
                value: 0,
              },
              {
                id: '3ffd3440-1438-44a0-9965-b6c70978d5c3',
                text: 'opt2',
                image: null,
                score: null,
                tooltip: null,
                isHidden: false,
                color: null,
                alert: null,
                value: 1,
              },
              {
                id: '081fc595-dfc7-41b9-ad72-c4242305d7cb',
                text: 'opt3',
                image: null,
                score: null,
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
            addScores: false,
            setAlerts: false,
            addTooltip: false,
            setPalette: false,
            addTokens: null,
            additionalResponseOption: {
              textInputOption: false,
              textInputRequired: false,
            },
            autoAdvance: false,
          },
          name: 'single',
          isHidden: false,
          conditionalLogic: null,
          allowEdit: true,
          id: '5470cf91-76bf-48b4-b3da-4a615313c257',
        },
        answer: {
          value: '0',
          text: null,
        },
        id: '09b0cac4-303a-4ce9-94bd-dff922c24947',
        submitId: '9a3a04b9-a5e9-420b-9daf-17156523658d',
        version: '2.1.0',
        respondentId: '0e6d026f-b382-4022-9208-74a54768ea81',
        respondentSecretId: '[admin account] (ml_test1_account@gmail.com)',
        legacyProfileId: null,
        scheduledDatetime: 1689764371.123,
        startDatetime: 1689764605.250957,
        endDatetime: 1689764605.250957,
        migratedDate: null,
        appletHistoryId: 'f7283dca-97c0-4953-92c1-e6df8190f9ad_2.1.0',
        activityHistoryId: '39cc3d0f-8a82-462c-946f-61dcee6cbe1a_2.1.0',
        flowHistoryId: null,
        flowName: null,
        reviewedAnswerId: 'c482d1fd-5b0f-4cae-b10d-77cbb4151386',
        createdAt: '2023-07-19T11:03:25.250957',
        appletId: 'f7283dca-97c0-4953-92c1-e6df8190f9ad',
        activityId: '39cc3d0f-8a82-462c-946f-61dcee6cbe1a',
        flowId: null,
        items: mockedItemsOfParsedAnswers,
        activityName: 'New Activity#Single_Multi_Slider - Assessment',
        subscaleSetting: null,
      },
      {
        activityItem: {
          question: 'multi',
          responseType: 'multiSelect',
          responseValues: {
            paletteName: null,
            options: [
              {
                id: '0f4776b3-5dd2-4c72-92af-474ca9b956f2',
                text: 'opt1',
                image: null,
                score: null,
                tooltip: null,
                isHidden: false,
                color: null,
                alert: null,
                value: 0,
              },
              {
                id: '4c03f3a4-d239-4707-a962-08d49a4f145b',
                text: 'opt2',
                image: null,
                score: null,
                tooltip: null,
                isHidden: false,
                color: null,
                alert: null,
                value: 1,
              },
              {
                id: 'ad8ba486-9b4d-4133-8d78-cbffd070e5d6',
                text: 'opt3',
                image: null,
                score: null,
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
            addScores: false,
            setAlerts: false,
            addTooltip: false,
            setPalette: false,
            addTokens: null,
            additionalResponseOption: {
              textInputOption: false,
              textInputRequired: false,
            },
          },
          name: 'multi',
          isHidden: false,
          conditionalLogic: null,
          allowEdit: true,
          id: 'dd9c96ad-b57c-4440-b284-27c7f1351fd0',
        },
        answer: {
          value: ['0'],
          text: null,
        },
        id: '09b0cac4-303a-4ce9-94bd-dff922c24947',
        submitId: '9a3a04b9-a5e9-420b-9daf-17156523658d',
        version: '2.1.0',
        respondentId: '0e6d026f-b382-4022-9208-74a54768ea81',
        respondentSecretId: '[admin account] (ml_test1_account@gmail.com)',
        legacyProfileId: null,
        scheduledDatetime: 1689764371.123,
        startDatetime: 1689764605.250957,
        endDatetime: 1689764605.250957,
        migratedDate: null,
        appletHistoryId: 'f7283dca-97c0-4953-92c1-e6df8190f9ad_2.1.0',
        activityHistoryId: '39cc3d0f-8a82-462c-946f-61dcee6cbe1a_2.1.0',
        flowHistoryId: null,
        flowName: null,
        reviewedAnswerId: 'c482d1fd-5b0f-4cae-b10d-77cbb4151386',
        createdAt: '2023-07-19T11:03:25.250957',
        appletId: 'f7283dca-97c0-4953-92c1-e6df8190f9ad',
        activityId: '39cc3d0f-8a82-462c-946f-61dcee6cbe1a',
        flowId: null,
        items: mockedItemsOfParsedAnswers,
        activityName: 'New Activity#Single_Multi_Slider - Assessment',
        subscaleSetting: null,
      },
      {
        activityItem: {
          question: 'slider',
          responseType: 'slider',
          responseValues: {
            minLabel: 'min',
            maxLabel: 'max',
            minValue: 0,
            maxValue: 5,
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
          name: 'slider',
          isHidden: false,
          conditionalLogic: null,
          allowEdit: true,
          id: 'ab47ab74-1ae5-475b-b1cb-bc868ead793f',
        },
        answer: {
          value: 5,
          text: null,
        },
        id: '09b0cac4-303a-4ce9-94bd-dff922c24947',
        submitId: '9a3a04b9-a5e9-420b-9daf-17156523658d',
        version: '2.1.0',
        respondentId: '0e6d026f-b382-4022-9208-74a54768ea81',
        respondentSecretId: '[admin account] (ml_test1_account@gmail.com)',
        legacyProfileId: null,
        scheduledDatetime: 1689764371.123,
        startDatetime: 1689764605.250957,
        endDatetime: 1689764605.250957,
        migratedDate: null,
        appletHistoryId: 'f7283dca-97c0-4953-92c1-e6df8190f9ad_2.1.0',
        activityHistoryId: '39cc3d0f-8a82-462c-946f-61dcee6cbe1a_2.1.0',
        flowHistoryId: null,
        flowName: null,
        reviewedAnswerId: 'c482d1fd-5b0f-4cae-b10d-77cbb4151386',
        createdAt: '2023-07-19T11:03:25.250957',
        appletId: 'f7283dca-97c0-4953-92c1-e6df8190f9ad',
        activityId: '39cc3d0f-8a82-462c-946f-61dcee6cbe1a',
        flowId: null,
        items: mockedItemsOfParsedAnswers,
        activityName: 'New Activity#Single_Multi_Slider - Assessment',
        subscaleSetting: null,
      },
    ],
    decryptedEvents: [],
  },
];

export const mockedParams = {
  appletId: mockedAppletFormData.id,
  activityId: mockedAppletFormData.activities[0].id,
};
export const mockedActivityRoute = generatePath(page.builderAppletActivity, mockedParams);
export const mockedRenderAppletFormDataActivityOptions = {
  route: mockedActivityRoute,
  routePath: page.builderAppletActivity,
};

export const mockedTotalScoresTableData = [
  {
    rawScore: '0 ~ 4',
    optionalText: 'Description #1 for range 0~4',
  },
  {
    rawScore: '4 ~ 20',
    optionalText: 'Description #2 for range 4~20',
  },
  {
    rawScore: '-10 ~ 0',
    optionalText: 'Description #3 for range -10~0',
  },
];
export const mockedSubscale1 = {
  name: 'ss-1',
  scoring: SubscaleTotalScore.Sum,
  items: [
    {
      name: 'single',
      type: 'item',
    },
    {
      name: 'multi',
      type: 'item',
    },
    {
      name: 'slider',
      type: 'item',
    },
  ],
  subscaleTableData: [
    {
      score: '2',
      rawScore: '1',
      age: 15,
      sex: 'M',
      optionalText: 'Description 1',
    },
    {
      score: '4',
      rawScore: '2',
      age: 15,
      sex: 'M',
      optionalText: 'Description 2',
    },
    {
      score: '6',
      rawScore: '3',
      age: 15,
      sex: 'M',
      optionalText: 'Markdown Text Here',
    },
    {
      score: '8',
      rawScore: '4',
      age: 15,
      sex: 'F',
      optionalText: 'Good',
    },
    {
      score: '10',
      rawScore: '5',
      age: 15,
      sex: null,
      optionalText: 'Awesome text',
    },
  ],
};
export const mockedSubscale2 = {
  name: 'ss-2',
  scoring: 'sum',
  items: [
    {
      name: 'ss-1',
      type: 'subscale',
    },
    {
      name: 'single',
      type: 'item',
    },
  ],
  subscaleTableData: [
    {
      score: '2',
      rawScore: '1',
      age: 15,
      sex: 'M',
      optionalText: 'Description 1',
    },
    {
      score: '4',
      rawScore: '2',
      age: 15,
      sex: 'M',
      optionalText: 'Description 2',
    },
    {
      score: '6',
      rawScore: '3',
      age: 15,
      sex: 'M',
      optionalText: 'Markdown Text Here',
    },
    {
      score: '8',
      rawScore: '4',
      age: 15,
      sex: 'F',
      optionalText: 'Good',
    },
    {
      score: '10',
      rawScore: '5',
      age: 15,
      sex: null,
      optionalText: 'Awesome text',
    },
  ],
};
export const mockedSubscaleSetting = {
  calculateTotalScore: SubscaleTotalScore.Sum,
  subscales: [mockedSubscale1, mockedSubscale2],
  totalScoresTableData: mockedTotalScoresTableData,
};
export const mockedItemsSettingsForSubscale = [
  {
    question: 'single',
    responseType: 'singleSelect',
    responseValues: {
      paletteName: null,
      options: [
        {
          id: '4bae594b-4385-402c-aa96-0f6438e7e642',
          text: 'opt1',
          image: null,
          score: 3,
          tooltip: null,
          isHidden: false,
          color: null,
          alert: null,
          value: 0,
        },
        {
          id: 'b8b0a211-7f30-48af-bee5-54cbf53889bd',
          text: 'opt2',
          image: null,
          score: 5,
          tooltip: null,
          isHidden: false,
          color: null,
          alert: null,
          value: 1,
        },
        {
          id: '3c75fa7f-3ae9-4b4f-ab29-81664418c430',
          text: 'opt3',
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
      autoAdvance: false,
    },
    name: 'single',
    isHidden: false,
    conditionalLogic: null,
    allowEdit: true,
    id: 'e3d95ec0-32cd-4dff-8f81-6a0debfe7099',
  },
  {
    question: 'multi',
    responseType: 'multiSelect',
    responseValues: {
      paletteName: null,
      options: [
        {
          id: 'e6f6b1c1-3ec2-45b2-8c34-6d0970b86d64',
          text: 'opt1',
          image: null,
          score: 1,
          tooltip: null,
          isHidden: false,
          color: null,
          alert: null,
          value: 0,
        },
        {
          id: 'a64abb45-1ba3-4113-88b1-5e28459755dc',
          text: 'opt2',
          image: null,
          score: 3,
          tooltip: null,
          isHidden: false,
          color: null,
          alert: null,
          value: 1,
        },
        {
          id: '1ce9e52d-28b3-4768-846c-83e378db59ef',
          text: 'opt3',
          image: null,
          score: 0,
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
    name: 'multi',
    isHidden: false,
    conditionalLogic: null,
    allowEdit: true,
    id: '16a50393-7952-4fcb-8e3b-5f042ab05ed9',
  },
  {
    question: 'slider',
    responseType: 'slider',
    responseValues: {
      minLabel: 'min',
      maxLabel: 'max',
      minValue: 0,
      maxValue: 5,
      minImage: null,
      maxImage: null,
      scores: [1, 2, 3, 4, 5, 6],
      alerts: null,
    },
    config: {
      removeBackButton: false,
      skippableItem: false,
      addScores: true,
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
    name: 'slider',
    isHidden: false,
    conditionalLogic: null,
    allowEdit: true,
    id: '42231d03-316b-42e3-8c9b-cd117c916e6d',
  },
  {
    question: 'How do you describe yourself?',
    responseType: 'singleSelect',
    responseValues: {
      paletteName: null,
      options: [
        {
          id: '4a80acc2-d2cb-4dc5-b518-4fee6e4d7c0d',
          text: 'Male',
          image: null,
          score: null,
          tooltip: null,
          isHidden: false,
          color: null,
          alert: null,
          value: 0,
        },
        {
          id: '60fff102-0e8d-458f-984a-65d737230e55',
          text: 'Female',
          image: null,
          score: null,
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
      addScores: false,
      setAlerts: false,
      addTooltip: false,
      setPalette: false,
      addTokens: null,
      additionalResponseOption: {
        textInputOption: false,
        textInputRequired: false,
      },
      autoAdvance: false,
    },
    name: 'gender_screen',
    isHidden: false,
    conditionalLogic: null,
    allowEdit: false,
    id: 'ac8643f5-3c98-4ce7-b94c-8735a8bd2943',
  },
  {
    question: 'How old are you?',
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
    name: 'age_screen',
    isHidden: false,
    conditionalLogic: null,
    allowEdit: false,
    id: '028d9ee5-68cc-4c6f-9e13-60e7aa52a412',
  },
];
export const mockedDecryptedAnswersWithSubscales = [
  {
    activityItem: {
      question: 'single',
      responseType: 'singleSelect',
      responseValues: {
        paletteName: null,
        options: [
          {
            id: '4bae594b-4385-402c-aa96-0f6438e7e642',
            text: 'opt1',
            image: null,
            score: 3,
            tooltip: null,
            isHidden: false,
            color: null,
            alert: null,
            value: 0,
          },
          {
            id: 'b8b0a211-7f30-48af-bee5-54cbf53889bd',
            text: 'opt2',
            image: null,
            score: 5,
            tooltip: null,
            isHidden: false,
            color: null,
            alert: null,
            value: 1,
          },
          {
            id: '3c75fa7f-3ae9-4b4f-ab29-81664418c430',
            text: 'opt3',
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
        autoAdvance: false,
      },
      name: 'single',
      isHidden: false,
      conditionalLogic: null,
      allowEdit: true,
      id: 'e3d95ec0-32cd-4dff-8f81-6a0debfe7099',
    },
    answer: {
      value: 2,
      text: null,
    },
    id: '8daa8ec9-7c54-4a51-a87f-f5a14b1294d3',
    submitId: '710aad0b-40c9-4145-8d0d-06f4e4fdf77e',
    version: '1.2.0',
    respondentId: '835e5277-5949-4dff-817a-d85c17a3604f',
    respondentSecretId: 'respondentSecretId',
    legacyProfileId: null,
    scheduledDatetime: null,
    startDatetime: 1698673918.439,
    endDatetime: 1698673935.278,
    migratedDate: null,
    appletHistoryId: 'fd913b3f-704c-4425-96d5-5386cefaf5cc_1.2.0',
    activityHistoryId: 'eb521f27-5ccb-4286-97ce-704793294015_1.2.0',
    flowHistoryId: null,
    flowName: null,
    reviewedAnswerId: null,
    createdAt: '2023-10-30T13:52:16.448210',
    appletId: 'fd913b3f-704c-4425-96d5-5386cefaf5cc',
    activityId: 'eb521f27-5ccb-4286-97ce-704793294015',
    flowId: null,
    items: mockedItemsSettingsForSubscale,
    activityName: 'New Activity#SimpleItems-3 (No skippable)',
    subscaleSetting: mockedSubscaleSetting,
  },
  {
    activityItem: {
      question: 'multi',
      responseType: 'multiSelect',
      responseValues: {
        paletteName: null,
        options: [
          {
            id: 'e6f6b1c1-3ec2-45b2-8c34-6d0970b86d64',
            text: 'opt1',
            image: null,
            score: 1,
            tooltip: null,
            isHidden: false,
            color: null,
            alert: null,
            value: 0,
          },
          {
            id: 'a64abb45-1ba3-4113-88b1-5e28459755dc',
            text: 'opt2',
            image: null,
            score: 3,
            tooltip: null,
            isHidden: false,
            color: null,
            alert: null,
            value: 1,
          },
          {
            id: '1ce9e52d-28b3-4768-846c-83e378db59ef',
            text: 'opt3',
            image: null,
            score: 0,
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
      name: 'multi',
      isHidden: false,
      conditionalLogic: null,
      allowEdit: true,
      id: '16a50393-7952-4fcb-8e3b-5f042ab05ed9',
    },
    answer: {
      value: [0],
      text: null,
    },
    id: '8daa8ec9-7c54-4a51-a87f-f5a14b1294d3',
    submitId: '710aad0b-40c9-4145-8d0d-06f4e4fdf77e',
    version: '1.2.0',
    respondentId: '835e5277-5949-4dff-817a-d85c17a3604f',
    respondentSecretId: 'respondentSecretId',
    legacyProfileId: null,
    scheduledDatetime: null,
    startDatetime: 1698673918.439,
    endDatetime: 1698673935.278,
    migratedDate: null,
    appletHistoryId: 'fd913b3f-704c-4425-96d5-5386cefaf5cc_1.2.0',
    activityHistoryId: 'eb521f27-5ccb-4286-97ce-704793294015_1.2.0',
    flowHistoryId: null,
    flowName: null,
    reviewedAnswerId: null,
    createdAt: '2023-10-30T13:52:16.448210',
    appletId: 'fd913b3f-704c-4425-96d5-5386cefaf5cc',
    activityId: 'eb521f27-5ccb-4286-97ce-704793294015',
    flowId: null,
    items: mockedItemsSettingsForSubscale,
    activityName: 'New Activity#SimpleItems-3 (No skippable)',
    subscaleSetting: mockedSubscaleSetting,
  },
  {
    activityItem: {
      question: 'slider',
      responseType: 'slider',
      responseValues: {
        minLabel: 'min',
        maxLabel: 'max',
        minValue: 0,
        maxValue: 5,
        minImage: null,
        maxImage: null,
        scores: [1, 2, 3, 4, 5, 6],
        alerts: null,
      },
      config: {
        removeBackButton: false,
        skippableItem: false,
        addScores: true,
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
      name: 'slider',
      isHidden: false,
      conditionalLogic: null,
      allowEdit: true,
      id: '42231d03-316b-42e3-8c9b-cd117c916e6d',
    },
    answer: {
      value: 2,
      text: null,
    },
    id: '8daa8ec9-7c54-4a51-a87f-f5a14b1294d3',
    submitId: '710aad0b-40c9-4145-8d0d-06f4e4fdf77e',
    version: '1.2.0',
    respondentId: '835e5277-5949-4dff-817a-d85c17a3604f',
    respondentSecretId: 'respondentSecretId',
    legacyProfileId: null,
    scheduledDatetime: null,
    startDatetime: 1698673918.439,
    endDatetime: 1698673935.278,
    migratedDate: null,
    appletHistoryId: 'fd913b3f-704c-4425-96d5-5386cefaf5cc_1.2.0',
    activityHistoryId: 'eb521f27-5ccb-4286-97ce-704793294015_1.2.0',
    flowHistoryId: null,
    flowName: null,
    reviewedAnswerId: null,
    createdAt: '2023-10-30T13:52:16.448210',
    appletId: 'fd913b3f-704c-4425-96d5-5386cefaf5cc',
    activityId: 'eb521f27-5ccb-4286-97ce-704793294015',
    flowId: null,
    items: mockedItemsSettingsForSubscale,
    activityName: 'New Activity#SimpleItems-3 (No skippable)',
    subscaleSetting: mockedSubscaleSetting,
  },
  {
    activityItem: {
      question: 'How do you describe yourself?',
      responseType: 'singleSelect',
      responseValues: {
        paletteName: null,
        options: [
          {
            id: '4a80acc2-d2cb-4dc5-b518-4fee6e4d7c0d',
            text: 'Male',
            image: null,
            score: null,
            tooltip: null,
            isHidden: false,
            color: null,
            alert: null,
            value: 0,
          },
          {
            id: '60fff102-0e8d-458f-984a-65d737230e55',
            text: 'Female',
            image: null,
            score: null,
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
        addScores: false,
        setAlerts: false,
        addTooltip: false,
        setPalette: false,
        addTokens: null,
        additionalResponseOption: {
          textInputOption: false,
          textInputRequired: false,
        },
        autoAdvance: false,
      },
      name: 'gender_screen',
      isHidden: false,
      conditionalLogic: null,
      allowEdit: false,
      id: 'ac8643f5-3c98-4ce7-b94c-8735a8bd2943',
    },
    answer: {
      value: 0,
      text: null,
    },
    id: '8daa8ec9-7c54-4a51-a87f-f5a14b1294d3',
    submitId: '710aad0b-40c9-4145-8d0d-06f4e4fdf77e',
    version: '1.2.0',
    respondentId: '835e5277-5949-4dff-817a-d85c17a3604f',
    respondentSecretId: 'respondentSecretId',
    legacyProfileId: null,
    scheduledDatetime: null,
    startDatetime: 1698673918.439,
    endDatetime: 1698673935.278,
    migratedDate: null,
    appletHistoryId: 'fd913b3f-704c-4425-96d5-5386cefaf5cc_1.2.0',
    activityHistoryId: 'eb521f27-5ccb-4286-97ce-704793294015_1.2.0',
    flowHistoryId: null,
    flowName: null,
    reviewedAnswerId: null,
    createdAt: '2023-10-30T13:52:16.448210',
    appletId: 'fd913b3f-704c-4425-96d5-5386cefaf5cc',
    activityId: 'eb521f27-5ccb-4286-97ce-704793294015',
    flowId: null,
    items: mockedItemsSettingsForSubscale,
    activityName: 'New Activity#SimpleItems-3 (No skippable)',
    subscaleSetting: mockedSubscaleSetting,
  },
  {
    activityItem: {
      question: 'How old are you?',
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
      name: 'age_screen',
      isHidden: false,
      conditionalLogic: null,
      allowEdit: false,
      id: '028d9ee5-68cc-4c6f-9e13-60e7aa52a412',
    },
    answer: '25',
    id: '8daa8ec9-7c54-4a51-a87f-f5a14b1294d3',
    submitId: '710aad0b-40c9-4145-8d0d-06f4e4fdf77e',
    version: '1.2.0',
    respondentId: '835e5277-5949-4dff-817a-d85c17a3604f',
    respondentSecretId: 'respondentSecretId',
    legacyProfileId: null,
    scheduledDatetime: null,
    startDatetime: 1698673918.439,
    endDatetime: 1698673935.278,
    migratedDate: null,
    appletHistoryId: 'fd913b3f-704c-4425-96d5-5386cefaf5cc_1.2.0',
    activityHistoryId: 'eb521f27-5ccb-4286-97ce-704793294015_1.2.0',
    flowHistoryId: null,
    flowName: null,
    reviewedAnswerId: null,
    createdAt: '2023-10-30T13:52:16.448210',
    appletId: 'fd913b3f-704c-4425-96d5-5386cefaf5cc',
    activityId: 'eb521f27-5ccb-4286-97ce-704793294015',
    flowId: null,
    items: mockedItemsSettingsForSubscale,
    activityName: 'New Activity#SimpleItems-3 (No skippable)',
    subscaleSetting: mockedSubscaleSetting,
  },
];

export const mockedDrawingSettings = {
  question: 'drawing\n',
  responseType: 'drawing',
  responseValues: {
    drawingExample:
      'https://media-dev.cmiml.net/mindlogger/391962851007982489/12cbda19-337f-47d5-bdb1-c6c78d324690/5.jpg',
    drawingBackground:
      'https://media-dev.cmiml.net/mindlogger/391962851007982489/07d189c3-3d5d-4013-8af8-25ebb6af5222/4.jpg',
  },
  config: {
    removeBackButton: false,
    skippableItem: false,
    additionalResponseOption: {
      textInputOption: false,
      textInputRequired: false,
    },
    timer: 0,
    removeUndoButton: false,
    navigationToTop: false,
  },
  name: 'drawing',
  isHidden: false,
  conditionalLogic: null,
  allowEdit: true,
  id: 'e2e611df-02d5-4316-8406-c5d685b94090',
};
export const mockedDecryptedAnswerForDrawing = {
  value: {
    svgString:
      '<svg height="100" width="100" preserveAspectRatio="xMidYMid meet">\n<polyline points="8.22055156707117,97.74436314505357 8.22055156707117,97.51686568525957 8.22055156707117,97.03883955430354 8.22055156707117,96.39974179527819 8.22055156707117,95.76580831425353 8.22055156707117,94.96266518413952 8.22055156707117,93.93541441652107 8.22055156707117,92.69013811131845 8.22055156707117,91.41995823803187 8.22055156707117,89.8238659199237 8.22055156707117,88.23768607854672 8.22055156707117,86.54912626144966 8.22055156707117,85.10141515366973 8.275825862473242,83.66808325596286 8.486710745523265,82.14690968174165 8.59712778185227,80.82388774113983 8.809436818580803,79.66209651774004 8.922305969138224,78.90239695848501 9.022556598004943,78.05998328783957 9.122807226871666,77.3338760108403 9.223057855738388,76.59991217820962 9.365301896831202,75.82200303207061 9.47422441313453,75.18689473898893 9.587238885495879,74.82379214998691 9.624060371205273,74.51255261825261 9.708562705635611,74.20121518551356 9.724311000071996,73.99065459954178 9.724311000071996,73.67907241429086 9.724311000071996,73.46810798667447 9.724311000071996,73.37009684329148 9.84277427522911,73.2650001146895 9.824561628938715,73.15915689092628 9.924812257805439,73.02351504884147 10.025062886672162,72.9128012500918 10.025062886672162,72.70115151544216 10.025062886672162,72.58561609220844 10.025062886672162,72.37835966514706 10.025062886672162,72.06669181651696 10.025062886672162,71.54142845076777 10.025062886672162,70.8864707289725 10.025062886672162,69.97468195883421 10.025062886672162,68.86680971380194 10.025062886672162,67.4327680338106 10.025062886672162,65.95673906040597 9.57384021517356,64.47763844297721 9.228212955519894,62.993471448552526 8.91308950736268,61.21166092442855 8.8220553402715,59.309028322814214 8.596023336142403,57.64036688493314 8.346005585848905,55.765109851772756 8.22055156707117,53.6677154388286" fill="none" stroke="black" stroke-width="0.6"></polyline>\n<polyline points="8.22055156707117,53.6677154388286 8.12030093820445,51.66242139610549 8.020050309337728,49.81275323806235 8.020050309337728,47.821728266781946 8.020050309337728,45.815124798120294 8.020050309337728,44.00437228946632 8.020050309337728,42.41344424935885 8.020050309337728,40.61961637690149 8.020050309337728,38.94253545261168 8.020050309337728,37.73162240007724 8.020050309337728,36.71840818901521 8.020050309337728,35.73057481343529 7.943276035470054,34.70385026371739 7.919799680471006,33.37872345151338 7.919799680471006,31.985420827124745 7.919799680471006,30.721469905265558 7.919799680471006,29.575416268379755 7.919799680471006,28.52158537797096 7.919799680471006,27.318357554309607 7.919799680471006,25.797306356344347 7.919799680471006,24.480501129544315 7.919799680471006,23.290012674126405 7.919799680471006,22.41574446405957 7.919799680471006,21.57274338738563 7.919799680471006,20.617914888032956 7.919799680471006,19.66050424967993 7.919799680471006,18.607419854432372 7.919799680471006,17.352328973503298 7.919799680471006,16.344964347475234 7.919799680471006,15.497129408691622 7.919799680471006,14.752800307182758 7.919799680471006,13.905638437806823 7.919799680471006,12.964822019759376 8.024461973364394,11.907766515006537 8.020050309337728,10.851677782675631 8.020050309337728,10.12153208923031 8.020050309337728,9.514007404237692 8.020050309337728,8.927953633349892 8.020050309337728,8.446109363208498 8.020050309337728,7.882340308527521 8.020050309337728,7.45953034425198 8.020050309337728,7.038072637604585 8.020050309337728,6.413672266917727 8.020050309337728,5.992355292964664 8.020050309337728,5.449867469191797 8.020050309337728,4.815933988167148 8.020050309337728,3.98000625908658 8.020050309337728,3.2503317142266304 8.020050309337728,2.616722530280226 8.020050309337728,1.9810819004852043 8.020050309337728,1.4343598582567836" fill="none" stroke="black" stroke-width="0.6"></polyline>\n<polyline points="8.020050309337728,1.4343598582567836 8.020050309337728,0.913661126854179 8.020050309337728,0.38635407763076995 8.020050309337728,-0.24850334412623074 8.020050309337728,-0.9876620488215943 8.020050309337728,-1.7019477794969857 8.020050309337728,-2.7611509875415847 8.020050309337728,-3.595096221275912 8.020050309337728,-4.326404489152672 8.186169193112997,-5.393445896390281 8.521303453671337,-6.716792134070348" fill="none" stroke="black" stroke-width="0.6"></polyline>\n<polyline points="3.609022639201978,2.205513835067875 4.00325086405094,2.205513835067875 5.03298357511019,2.205513835067875 6.088444364277798,2.205513835067875 7.660088201003796,2.205513835067875 9.249849077570232,2.205513835067875 11.188799892541411,2.205513835067875 12.994042410271645,2.205513835067875 14.574127914102759,2.205513835067875 15.894355086959536,2.205513835067875 17.35741217723444,2.205513835067875 18.621193302038513,2.205513835067875 19.795531151078634,2.205513835067875 20.854966874009524,2.205513835067875 21.79164697460617,2.205513835067875 22.642593329697075,2.327314922605775 23.38582104490247,2.406015092801318 23.992051600988514,2.5504007183730977 24.671701791826255,2.661665210274493 25.158107636907843,2.7067669794014835 25.7171682651415,2.7067669794014835 26.228621470407774,2.7067669794014835 26.764005352523274,2.7067669794014835 27.295344699379935,2.7067669794014835 27.827323462173883,2.7067669794014835 28.56074883927842,2.7067669794014835 29.296508543465027,2.7067669794014835 30.182402497846233,2.807017608268205 31.08585744495495,2.907268237134926 32.045030301393524,2.980437000561944 33.099105944314196,3.007518866001648 34.451960156708,3.007518866001648 36.13330283411094,3.007518866001648 38.0326006827509,3.007518866001648 39.698009971630356,3.007518866001648 41.53575562293847,3.007518866001648 43.48364296399973,3.055129348375425 45.59963856784689,3.2080201237350914 47.713737339726976,3.2080201237350914 50.17573956962122,3.2080201237350914 52.52026671262507,3.2080201237350914 54.74984583842371,3.2080201237350914 57.17216756732914,3.2080201237350914 59.27361875315774,3.2080201237350914 61.149065469514824,3.2080201237350914 63.160857691428376,3.2080201237350914 64.99949362999845,3.2080201237350914 66.40045088919621,3.2080201237350914 67.55878498336567,3.2080201237350914 68.52799269279137,3.2080201237350914 69.27236462598982,3.2080201237350914" fill="none" stroke="black" stroke-width="0.6"></polyline>\n<polyline points="69.27236462598982,3.2080201237350914 70.11753788120672,3.2080201237350914 70.74051256851187,3.2080201237350914 71.47572463895314,3.2080201237350914 72.06730369779667,3.4085213814685345 72.64452802181835,3.4085213814685345 73.28052354275559,3.4085213814685345 73.915368726887,3.4085213814685345 74.82568898195399,3.4085213814685345 75.98099426378892,3.4085213814685345 77.45582394988533,3.517674882954951 79.03174866101445,3.609022639201978 80.51362110064026,3.609022639201978 82.1782563597009,3.609022639201978 84.18244289730772,3.6615954787541547 86.02444418291618,3.809523896935421 87.71851705034338,3.809523896935421 89.59186501391108,3.895058781025259 91.39969884886087,4.106665683985331 92.76785927146646,4.110275783535585 93.92700104892513,4.110275783535585 94.88633911330923,4.110275783535585 95.94201176636992,4.110275783535585 97.04956583313674,4.110275783535585 97.8350378318929,4.110275783535585 98.56822457529836,4.110275783535585 99.49425794162816,4.020947235511582 100.46088351205353,3.9097745258021424 101.20092944460447,3.9097745258021424 101.37649042137716,3.9097745258021424" fill="none" stroke="black" stroke-width="0.6"></polyline>\n<polyline points="93.43358610378453,0.6015037732003296 93.43358610378453,0.8020050309337728 93.43358610378453,1.7248688522347018 93.43358610378453,2.8751444699504605 93.43358610378453,4.585187438777932 93.43358610378453,6.680819633636543 93.43358610378453,8.701025223146027 93.43358610378453,10.71296429656671 93.43358610378453,13.236784892149462 93.43358610378453,15.783551035721116 93.20279672270574,18.077518428583016 93.23308484605109,20.790049329639313 93.08018795187861,23.33602614636015 92.93233295945092,25.62282229062392 92.93233295945092,28.09206919486986 92.8471957981929,30.054543785639265 92.83208233058421,31.739836156702705 92.83208233058421,33.642113867174814 92.83208233058421,35.422284549469175 92.83208233058421,36.988088744232 92.73183170171748,38.18650718103488 92.63158107285076,39.29533396086347 92.63158107285076,40.68732715931355 92.63158107285076,42.268391673192184 92.63158107285076,43.70090364998427 92.63158107285076,45.16288382920689 92.63158107285076,46.794281697154 92.63158107285076,48.82177479270475 92.63158107285076,51.03772732240438 92.63158107285076,53.3784057321589 92.68416003121574,56.222405444972416 92.89637269664271,58.91687361065185 93.20774072344575,61.70034602727704 93.52017954248826,64.68462564227553 93.8292836085564,67.53445046487182 93.94326485333966,70.60254557756419 94.15466983547743,73.65404646995097 94.36603810473842,76.61326342773278 94.57848940386448,79.50323989990326 94.79113038618726,81.94637171113142 95.06744985328885,84.38963813624113 95.21420345941307,86.67838006297437 95.32554137706803,88.70679098044468 95.33834805225224,90.7091112801484 95.44780137556572,92.6141302187536 95.43859868111896,94.39594074287757 95.43859868111896,96.06682942861677 95.58084884102458,97.92188214192133 95.63909993885241,99.72482704544626 95.7036350574228,101.46867645497738 95.83960119658585,103.08379828088435" fill="none" stroke="black" stroke-width="0.6"></polyline>\n<polyline points="95.83960119658585,103.08379828088435 96.02675120479614,104.39441126913378 96.3354085975301,105.64782559535647 96.65651777430601,106.69649220776456 97.19842431086316,107.42399457408156 97.83066899955583,107.82696734726909 98.70259370432139,108.48809283236379" fill="none" stroke="black" stroke-width="0.6"></polyline>\n<polyline points="96.94235811411978,93.53383673265125 96.24149705872111,93.53383673265125 94.84529411706667,93.53383673265125 93.15479463631294,93.48590195319925 90.99134763922473,93.27536584247865 88.41397519404228,92.96263332042187 85.40823690256457,92.75153427892396 82.15885360432148,92.64119984656772 78.66709189356199,92.63158107285076 74.85996045243022,92.63158107285076 70.92971237900919,92.63158107285076 67.02363973494924,92.63158107285076 63.13817525238974,92.63158107285076 59.57955939300979,92.63158107285076 56.42525632681993,92.63158107285076 53.68380179767202,92.63158107285076 51.32998017802946,92.63158107285076 49.21695831720165,92.63158107285076 47.42485594995307,92.63158107285076 45.97924971377532,92.63158107285076 44.48084118256551,92.86507496918584 43.09273954905436,92.93233295945092 41.668536920040665,93.03258358831764 40.39988980935974,93.03258358831764 39.30646102193489,93.03258358831764 38.059942597734484,93.03258358831764 36.69180970978646,93.03258358831764 35.21624270674801,93.1431138226834 33.85742877068989,93.13283421718437 32.586089382378276,93.13283421718437 31.021487534330078,93.13283421718437 29.371142762556936,93.13283421718437 27.70443934477091,93.13283421718437 26.114903334574763,93.13283421718437 24.544754782726045,93.13283421718437 22.79344042158253,93.13283421718437 21.01769517064363,93.24998500699651 19.192721011346137,93.46201410803958 17.04387350159166,93.77430607557497 14.922811520748546,94.08667146886393 12.806624704001473,94.39853511950352 10.52393428312452,94.53634302131847 8.28011132598597,94.63659365018519 6.349342893427635,94.73684427905191 4.975326766975272,94.73684427905191 3.694688312915352,94.73684427905191 2.5224859295413964,94.73684427905191 1.3921867059047774,94.73684427905191 0.3341108891180333,94.83709490791864 -0.7242846356373562,95.00199691279889 -1.5059606759045596,95.21358545932058" fill="none" stroke="black" stroke-width="0.6"></polyline>\n<polyline points="-1.5059606759045596,95.21358545932058 -2.0621886762389834,95.42424394629711 -2.6993557586139674,95.6366279384824 -3.123831952099302,96.26469959684748 -3.328145421418202,97.14197826281045 -3.3082707526018127,97.74436314505357" fill="none" stroke="black" stroke-width="0.6"></polyline>\n</svg>',
    width: 362.7272644042969,
    fileName: 'e2e611df-02d5-4316-8406-c5d685b94090.svg',
    type: 'image/svg',
    uri: 'https://media-dev.cmiml.net/mindlogger/2048412251058983019/023cf7e7-6083-443a-b74a-f32b75a711cd/e2e611df-02d5-4316-8406-c5d685b94090.svg',
    lines: [
      {
        startTime: 1689770366939,
        points: [
          {
            time: 1689770366939,
            x: 8.22055156707117,
            y: 97.74436314505357,
          },
          {
            time: 1689770367141,
            x: 8.22055156707117,
            y: 97.51686568525957,
          },
        ],
      },
      {
        startTime: 1689770388034,
        points: [
          {
            time: 1689770388034,
            x: 3.609022639201978,
            y: 2.205513835067875,
          },
          {
            time: 1689770388128,
            x: 4.00325086405094,
            y: 2.205513835067875,
          },
        ],
      },
      {
        startTime: 1689770395493,
        points: [
          {
            time: 1689770395493,
            x: 93.43358610378453,
            y: 0.6015037732003296,
          },
          {
            time: 1689770395594,
            x: 93.43358610378453,
            y: 0.8020050309337728,
          },
        ],
      },
      {
        startTime: 1689770401736,
        points: [
          {
            time: 1689770401736,
            x: 96.94235811411978,
            y: 93.53383673265125,
          },
          {
            time: 1689770401838,
            x: 96.24149705872111,
            y: 93.53383673265125,
          },
        ],
      },
    ],
  },
};
export const mockedDecryptedObjectForDrawing = {
  activityItem: mockedDrawingSettings,
  answer: mockedDecryptedAnswerForDrawing,
  id: 'eabe2de0-9ea4-495b-a4d1-2966eece97f8',
  submitId: '6b0b8017-be4c-4dfe-836e-818c03ac562e',
  version: '1.1.1',
  respondentId: '835e5277-5949-4dff-817a-d85c17a3604f',
  respondentSecretId: 'respondentSecretId',
  legacyProfileId: null,
  scheduledDatetime: null,
  startDatetime: 1689770351,
  endDatetime: 1689770404,
  migratedDate: null,
  appletHistoryId: '61d7bb65-4d4a-4be6-ac88-06d22994d8f9_1.1.1',
  activityHistoryId: '16d2c8e5-8541-4b7f-b598-6a310caee5f5_1.1.1',
  flowHistoryId: null,
  flowName: null,
  reviewedAnswerId: null,
  createdAt: '2023-07-19T12:40:10.925397',
  appletId: '61d7bb65-4d4a-4be6-ac88-06d22994d8f9',
  activityId: '16d2c8e5-8541-4b7f-b598-6a310caee5f5',
  flowId: null,
  items: [mockedDrawingSettings],
  activityName: 'New Activity#Drawing-item2',
  subscaleSetting: null,
};
export const mockedDecryptedEventsForDrawing = [
  {
    type: 'SET_ANSWER',
    screen: '16d2c8e5-8541-4b7f-b598-6a310caee5f5/e2e611df-02d5-4316-8406-c5d685b94090',
    time: 1689770402756,
    response: mockedDecryptedAnswerForDrawing,
  },
  {
    type: 'DONE',
    screen: '16d2c8e5-8541-4b7f-b598-6a310caee5f5/e2e611df-02d5-4316-8406-c5d685b94090',
    time: 1689770404752,
  },
];

export const mockedPhotoSettings = {
  question: 'photo_text',
  responseType: 'photo',
  responseValues: null,
  config: {
    removeBackButton: false,
    skippableItem: false,
    additionalResponseOption: {
      textInputOption: true,
      textInputRequired: false,
    },
    timer: 0,
  },
  name: 'photo_text',
  isHidden: false,
  conditionalLogic: null,
  allowEdit: true,
  id: '129a20df-5330-494c-8c4c-eb3c7847fe95',
};
export const mockedDecryptedAnswerForPhoto = {
  value:
    'https://media-dev.cmiml.net/mindlogger/2048412251058983019/d595acfc-8322-4d45-8ba5-c2f793b5476e/rn_image_picker_lib_temp_46ecc18c-2c7d-4d72-8d27-636c37e2e6f3.jpg',
};
export const mockedDecryptedObjectForPhoto = {
  activityItem: mockedPhotoSettings,
  answer: mockedDecryptedAnswerForPhoto,
  id: '949f248c-1a4b-4a35-a5a2-898dfef72050',
  submitId: 'becbb3e7-3e29-4b27-a224-85ee4db54c86',
  version: '2.0.0',
  respondentId: '835e5277-5949-4dff-817a-d85c17a3604f',
  respondentSecretId: 'respondentSecretId',
  legacyProfileId: null,
  scheduledDatetime: null,
  startDatetime: 1689755822,
  endDatetime: 1689756087,
  migratedDate: null,
  appletHistoryId: '7aa07032-93f5-41aa-a4e1-b24d92405bc0_2.0.0',
  activityHistoryId: '62e7e2c2-9fdb-4f2f-8460-78375a657f57_2.0.0',
  flowHistoryId: null,
  flowName: null,
  reviewedAnswerId: null,
  createdAt: '2023-07-19T08:41:37.130943',
  appletId: '7aa07032-93f5-41aa-a4e1-b24d92405bc0',
  activityId: '62e7e2c2-9fdb-4f2f-8460-78375a657f57',
  flowId: null,
  items: [mockedPhotoSettings],
  activityName: 'New Activity#1',
  subscaleSetting: null,
};

export const mockedVideoSettings = {
  question: 'video_text',
  responseType: 'video',
  responseValues: null,
  config: {
    removeBackButton: false,
    skippableItem: false,
    additionalResponseOption: {
      textInputOption: true,
      textInputRequired: false,
    },
    timer: 0,
  },
  name: 'video_text',
  isHidden: false,
  conditionalLogic: null,
  allowEdit: true,
  id: 'b66763bc-2890-46db-9e55-8dc43829c9c6',
};
export const mockedDecryptedAnswerForVideo = {
  value:
    'https://media-dev.cmiml.net/mindlogger/2048412251058983019/4fc51edd-2dab-4048-836b-f1b9bf0270f6/rn_image_picker_lib_temp_9309b1eb-90b0-4908-a24d-be6fa06def10.mp4',
};
export const mockedDecryptedObjectForVideo = {
  activityItem: mockedVideoSettings,
  answer: mockedDecryptedAnswerForVideo,
  id: '949f248c-1a4b-4a35-a5a2-898dfef72050',
  submitId: 'becbb3e7-3e29-4b27-a224-85ee4db54c86',
  version: '2.0.0',
  respondentId: '835e5277-5949-4dff-817a-d85c17a3604f',
  respondentSecretId: 'respondentSecretId',
  legacyProfileId: null,
  scheduledDatetime: null,
  startDatetime: 1689755822,
  endDatetime: 1689756087,
  migratedDate: null,
  appletHistoryId: '7aa07032-93f5-41aa-a4e1-b24d92405bc0_2.0.0',
  activityHistoryId: '62e7e2c2-9fdb-4f2f-8460-78375a657f57_2.0.0',
  flowHistoryId: null,
  flowName: null,
  reviewedAnswerId: null,
  createdAt: '2023-07-19T08:41:37.130943',
  appletId: '7aa07032-93f5-41aa-a4e1-b24d92405bc0',
  activityId: '62e7e2c2-9fdb-4f2f-8460-78375a657f57',
  flowId: null,
  items: [mockedVideoSettings],
  activityName: 'New Activity#1',
  subscaleSetting: null,
};

export const mockedAudioSettings = {
  question: 'audio_text',
  responseType: 'audio',
  responseValues: {
    maxDuration: 300,
  },
  config: {
    removeBackButton: false,
    skippableItem: true,
    additionalResponseOption: {
      textInputOption: true,
      textInputRequired: false,
    },
    timer: 0,
  },
  name: 'audio_text',
  isHidden: false,
  conditionalLogic: null,
  allowEdit: true,
  id: '2a56ef07-18ed-4102-8a5d-be69edf12968',
};
export const mockedDecryptedAnswerForAudio = {
  value:
    'https://media-dev.cmiml.net/mindlogger/2048412251058983019/73ef3a61-8053-4558-814e-05baafbbdc90/f01c225c-62df-4867-b282-66f585a65109.m4a',
};
export const mockedDecryptedObjectForAudio = {
  activityItem: mockedAudioSettings,
  answer: mockedDecryptedAnswerForAudio,
  id: '949f248c-1a4b-4a35-a5a2-898dfef72050',
  submitId: 'becbb3e7-3e29-4b27-a224-85ee4db54c86',
  version: '2.0.0',
  respondentId: '835e5277-5949-4dff-817a-d85c17a3604f',
  respondentSecretId: 'respondentSecretId',
  legacyProfileId: null,
  scheduledDatetime: null,
  startDatetime: 1689755822,
  endDatetime: 1689756087,
  migratedDate: null,
  appletHistoryId: '7aa07032-93f5-41aa-a4e1-b24d92405bc0_2.0.0',
  activityHistoryId: '62e7e2c2-9fdb-4f2f-8460-78375a657f57_2.0.0',
  flowHistoryId: null,
  flowName: null,
  reviewedAnswerId: null,
  createdAt: '2023-07-19T08:41:37.130943',
  appletId: '7aa07032-93f5-41aa-a4e1-b24d92405bc0',
  activityId: '62e7e2c2-9fdb-4f2f-8460-78375a657f57',
  flowId: null,
  items: [mockedAudioSettings],
  activityName: 'New Activity#1',
  subscaleSetting: null,
};

export const mockedAlert = {
  id: 'dcc07d2a-617c-43af-8e5a-0dcb1564d5e0',
  isWatched: true,
  appletId: mockedAppletId,
  appletName: 'applet#With_alerts',
  version: '1.3.0',
  secretId: 'secretId',
  activityId: '516fc8ba-67e9-4b7a-8365-3664fde92f86',
  activityItemId: '043227ac-1b27-464f-ad3d-197c395451a0',
  message:
    'SingleItem was matched with Opt1 , very long description there and so on... very long description there and so on...  very long description there and so on...',
  createdAt: '2023-08-03T09:30:30.461952',
  answerId: '607c315a-8144-4119-92ce-b48b831b1103',
  encryption: mockedEncryption,
  image:
    'https://media-dev.cmiml.net/mindlogger/391962851007982489/4490a3c1-904b-441c-87a9-4683fe2983fa/1.jpg',
  workspace: 'Test ML',
  subjectId: mockedSubjectId1,
};

export const mockedAppletSummaryData = [
  {
    id: mockedAppletId,
    name: 'Existing Activity',
    isPerformanceTask: false,
    hasAnswer: false,
  },
  {
    id: '56a4ebe4-3d7f-485c-8293-093cabf29fa3',
    name: 'Newly added activity',
    isPerformanceTask: false,
    hasAnswer: false,
  },
];

export const mockIntersectionObserver = () => {
  global.IntersectionObserver = jest.fn((_, options = {}) => {
    const instance = {
      thresholds: Array.isArray(options.threshold) ? options.threshold : [options.threshold],
      root: options.root,
      rootMargin: options.rootMargin,
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    };

    return instance;
  });
};
