import { PreloadedState } from '@reduxjs/toolkit';

import { RootState } from 'redux/store';
import { ParticipantTag, Roles } from 'shared/consts';
import {
  mockedActivityFlowId,
  mockedActivityId,
  mockedActivityId2,
  mockedApplet,
  mockedAppletId,
  mockedCurrentWorkspace,
  mockedFullParticipant1,
  mockedFullParticipant2,
  mockedFullSubjectId1,
} from 'shared/mock';
import { initialStateData } from 'shared/state';

export const preloadedState: PreloadedState<RootState> = {
  workspaces: {
    workspaces: initialStateData,
    currentWorkspace: {
      ...initialStateData,
      ...mockedCurrentWorkspace,
    },
    roles: {
      ...initialStateData,
      data: {
        [mockedAppletId]: [Roles.Manager],
      },
    },
    workspacesRoles: initialStateData,
  },
  applet: {
    applet: {
      ...initialStateData,
      data: { result: mockedApplet },
    },
  },
  users: {
    allRespondents: {
      ...initialStateData,
      data: {
        result: [mockedFullParticipant1, mockedFullParticipant2],
        count: 2,
      },
    },
    subjectDetails: {
      ...initialStateData,
      data: {
        result: {
          id: '1',
          nickname: 'Mocked Respondent',
          secretUserId: mockedFullSubjectId1,
          lastSeen: '2023-12-15T23:29:36.150182',
          tag: 'Child' as ParticipantTag,
          userId: mockedFullSubjectId1,
          firstName: 'John',
          lastName: 'Doe',
          roles: [Roles.Respondent],
          teamMemberCanViewData: true,
        },
      },
    },
    respondentDetails: initialStateData,
  },
};

const items = [
  {
    question: {
      en: 'Single Selected - Mocked Item',
    },
    responseType: 'singleSelect',
    responseValues: {
      paletteName: null,
      options: [
        {
          id: '484596cc-0b4e-42a9-ab9d-20d4dae97d58',
          text: '1',
          isHidden: false,
          value: 0,
        },
        {
          id: 'a6ee9b74-e1d3-47b2-8c7f-fa9a22313b19',
          text: '2',
          isHidden: false,
          value: 1,
        },
      ],
    },
    config: {
      removeBackButton: false,
      skippableItem: true,
      randomizeOptions: false,
      timer: 0,
      addScores: false,
      setAlerts: false,
      addTooltip: false,
      setPalette: false,
      additionalResponseOption: {
        textInputOption: false,
        textInputRequired: false,
      },
    },
    name: 'ss-1',
    isHidden: false,
    allowEdit: true,
    id: mockedActivityId,
    order: 1,
  },
];

export const mockedGetWithActivities1 = {
  data: {
    result: [
      {
        id: mockedActivityId,
        name: 'Activity 1',
        answerDates: [],
      },
    ],
  },
};

export const mockedGetWithFlows1 = {
  data: {
    result: [
      {
        id: mockedActivityFlowId,
        name: 'flow 1',
        answerDates: [],
      },
    ],
  },
};

export const mockedGetWithFlows2 = {
  data: {
    result: [
      {
        id: mockedActivityFlowId,
        name: 'flow 1',
        answerDates: [
          {
            createdAt: '2023-12-15T19:11:40.017524',
            answerId: 'answer-id-1-1',
          },
          {
            createdAt: '2023-12-15T21:01:42.250242',
            answerId: 'answer-id-1-2',
          },
        ],
      },
    ],
  },
};

const activity1 = {
  id: mockedActivityId,
  name: 'Activity 1',
  lastAnswerDate: '2023-12-15T11:22:34.150182',
  answerDates: [
    {
      createdAt: '2023-12-15T11:21:40.509095',
      answerId: 'answer-id-1-1',
    },
    {
      createdAt: '2023-12-15T11:22:34.150182',
      answerId: 'answer-id-1-2',
    },
  ],
};

export const mockedGetWithActivities2 = {
  data: {
    result: [activity1],
  },
};

export const mockedGetWithActivities3 = {
  data: {
    result: [
      activity1,
      {
        id: mockedActivityId2,
        name: 'Activity 2',
        lastAnswerDate: '2023-12-15T23:29:36.150182',
        answerDates: [
          {
            createdAt: '2023-12-15T21:20:30.150182',
            answerId: 'answer-id-2-1',
          },
          {
            createdAt: '2023-12-15T23:29:36.150182',
            answerId: 'answer-id-2-2',
          },
          {
            createdAt: '2023-12-15T22:20:30.150182',
            answerId: 'answer-id-2-3',
          },
        ],
      },
      {
        id: '9e6978dd-7f9e-4183-8e55-191c12e50caa',
        name: 'Activity 3',
        lastAnswerDate: '2023-12-15T05:10:10.111222',
        answerDates: [
          {
            createdAt: '2023-12-15T05:10:10.111222',
            answerId: 'answer-id-3-1',
          },
        ],
      },
    ],
  },
};

export const mockedGetWithActivities4 = {
  data: {
    result: [
      activity1,
      {
        id: mockedActivityId2,
        name: 'Activity 2',
        lastAnswerDate: '2023-12-15T06:23:56.489090',
        answerDates: [
          {
            createdAt: '2023-12-15T05:01:20.275869',
            answerId: 'answer-id-1-1',
          },
          {
            createdAt: '2023-12-15T05:10:38.940534',
            answerId: 'answer-id-1-2',
          },
          {
            createdAt: '2023-12-15T06:23:56.489090',
            answerId: 'answer-id-1-3',
          },
        ],
      },
    ],
  },
};

export const mockedGetWithDates = {
  data: {
    result: {
      dates: ['2023-12-11', '2023-12-15'],
    },
  },
};

export const mockedGetWithResponses = {
  data: {
    result: {
      activity: {
        items,
      },
      answer: { id: 'answer-id' },
      summary: {
        createdAt: '2024-03-14T14:33:48.750000',
        identifier: 'test-identifier',
        version: '10.10.12',
      },
    },
  },
};

export const mockDecryptedActivityData = {
  decryptedAnswers: [
    {
      activityItem: {
        question: {
          en: 'Single Selected - Mocked Item',
        },
        responseType: 'singleSelect',
        responseValues: {
          options: [
            {
              id: '484596cc-0b4e-42a9-ab9d-20d4dae97d58',
              text: '1',
              isHidden: false,
              value: 0,
            },
            {
              id: 'a6ee9b74-e1d3-47b2-8c7f-fa9a22313b19',
              text: '2',
              isHidden: false,
              value: 1,
            },
          ],
        },
        config: {
          removeBackButton: false,
          skippableItem: true,
          randomizeOptions: false,
          timer: 0,
          addScores: false,
          setAlerts: false,
          addTooltip: false,
          setPalette: false,
          additionalResponseOption: {
            textInputOption: false,
            textInputRequired: false,
          },
        },
        name: 'ss-1',
        isHidden: false,
        allowEdit: true,
        id: mockedActivityId,
        order: 1,
      },
      answer: {
        value: '0',
        edited: null,
      },
      items,
    },
  ],
};

export const mockAssessment = {
  data: {
    result: {
      answer: null,
      itemIds: [],
      items: [],
      itemsLast: null,
      reviewerPublicKey: null,
      versions: [],
    },
  },
};
