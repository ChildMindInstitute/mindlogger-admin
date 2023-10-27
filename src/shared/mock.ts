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
