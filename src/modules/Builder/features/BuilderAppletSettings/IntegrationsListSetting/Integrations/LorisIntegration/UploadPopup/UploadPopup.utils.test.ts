import { LorisUserAnswerVisit, LorisUsersVisit, LorisUsersVisits } from 'modules/Builder/api';

import { UploadDataForm } from './UploadPopup.types';
import { filteredData, formatData } from './UploadPopup.utils';

describe('formatData', () => {
  test('should return an array with visits as empty array and visit as empty string when activityVisits is empty', () => {
    const input: LorisUsersVisits = {
      activityVisits: {},
      answers: [
        {
          activityId: 'activity1',
          userId: 'user1',
          secretUserId: 'secret1',
          activityName: 'Activity 1',
          answerId: 'answer1',
          version: '1.0.0',
          completedDate: '2024-01-01',
        },
      ],
    };

    const expected: LorisUserAnswerVisit[] = [
      {
        activityId: 'activity1',
        userId: 'user1',
        secretUserId: 'secret1',
        activityName: 'Activity 1',
        answerId: 'answer1',
        version: '1.0.0',
        completedDate: '2024-01-01',
        visits: [],
        visit: '',
        selected: true,
      },
    ];

    expect(formatData(input)).toEqual(expected);
  });

  test('should return an array with visits from activityVisits when they exist', () => {
    const input: LorisUsersVisits = {
      activityVisits: {
        activity1: [
          {
            userId: 'user1',
            visits: ['visit1', 'visit2'],
          },
        ],
      },
      answers: [
        {
          activityId: 'activity1',
          userId: 'user1',
          secretUserId: 'secret1',
          activityName: 'Activity 1',
          answerId: 'answer1',
          version: '1.0.0',
          completedDate: '2024-01-01',
        },
      ],
    };

    const expected: LorisUserAnswerVisit[] = [
      {
        activityId: 'activity1',
        userId: 'user1',
        secretUserId: 'secret1',
        activityName: 'Activity 1',
        answerId: 'answer1',
        version: '1.0.0',
        completedDate: '2024-01-01',
        visits: ['visit1', 'visit2'],
        visit: '',
        selected: true,
      },
    ];

    expect(formatData(input)).toEqual(expected);
  });

  test('should handle multiple answers correctly', () => {
    const input: LorisUsersVisits = {
      activityVisits: {
        activity1: [
          {
            userId: 'user1',
            visits: ['visit1', 'visit2'],
          },
        ],
        activity2: [
          {
            userId: 'user2',
            visits: ['visit3'],
          },
        ],
      },
      answers: [
        {
          activityId: 'activity1',
          userId: 'user1',
          secretUserId: 'secret1',
          activityName: 'Activity 1',
          answerId: 'answer1',
          version: '1.0.0',
          completedDate: '2024-01-01',
        },
        {
          activityId: 'activity2',
          userId: 'user2',
          secretUserId: 'secret2',
          activityName: 'Activity 2',
          answerId: 'answer2',
          version: '1.1.0',
          completedDate: '2024-02-01',
        },
      ],
    };

    const expected: LorisUserAnswerVisit[] = [
      {
        activityId: 'activity1',
        userId: 'user1',
        secretUserId: 'secret1',
        activityName: 'Activity 1',
        answerId: 'answer1',
        version: '1.0.0',
        completedDate: '2024-01-01',
        visits: ['visit1', 'visit2'],
        visit: '',
        selected: true,
      },
      {
        activityId: 'activity2',
        userId: 'user2',
        secretUserId: 'secret2',
        activityName: 'Activity 2',
        answerId: 'answer2',
        version: '1.1.0',
        completedDate: '2024-02-01',
        visits: ['visit3'],
        visit: '',
        selected: true,
      },
    ];

    expect(formatData(input)).toEqual(expected);
  });

  test('should handle answers without corresponding activityVisits', () => {
    const input: LorisUsersVisits = {
      activityVisits: {
        activity1: [
          {
            userId: 'user1',
            visits: ['visit1', 'visit2'],
          },
        ],
      },
      answers: [
        {
          activityId: 'activity1',
          userId: 'user1',
          secretUserId: 'secret1',
          activityName: 'Activity 1',
          answerId: 'answer1',
          version: '1.0.0',
          completedDate: '2024-01-01',
        },
        {
          activityId: 'activity3',
          userId: 'user3',
          secretUserId: 'secret3',
          activityName: 'Activity 3',
          answerId: 'answer3',
          version: '2.0.0',
          completedDate: '2024-03-01',
        },
      ],
    };

    const expected: LorisUserAnswerVisit[] = [
      {
        activityId: 'activity1',
        userId: 'user1',
        secretUserId: 'secret1',
        activityName: 'Activity 1',
        answerId: 'answer1',
        version: '1.0.0',
        completedDate: '2024-01-01',
        visits: ['visit1', 'visit2'],
        visit: '',
        selected: true,
      },
      {
        activityId: 'activity3',
        userId: 'user3',
        secretUserId: 'secret3',
        activityName: 'Activity 3',
        answerId: 'answer3',
        version: '2.0.0',
        completedDate: '2024-03-01',
        visits: [],
        visit: '',
        selected: true,
      },
    ];

    expect(formatData(input)).toEqual(expected);
  });
});

describe('filteredData', () => {
  test('should return an empty array when the visitsForm is empty', () => {
    const form: UploadDataForm = { visitsForm: [] };
    expect(filteredData(form)).toEqual([]);
  });

  test('should filter out activities that are not selected', () => {
    const form: UploadDataForm = {
      visitsForm: [
        {
          userId: 'user1',
          secretUserId: 'secret1',
          activityId: 'activity1',
          activityName: 'Activity 1',
          answerId: 'answer1',
          version: '1.0.0',
          completedDate: '2024-01-01',
          visit: 'visit1',
          selected: false,
        },
        {
          userId: 'user2',
          secretUserId: 'secret2',
          activityId: 'activity2',
          activityName: 'Activity 2',
          answerId: 'answer2',
          version: '2.0.0',
          completedDate: '2024-02-01',
          visit: 'visit2',
          selected: true,
        },
      ],
    };

    const expected: LorisUsersVisit[] = [
      {
        userId: 'user2',
        secretUserId: 'secret2',
        activities: [
          {
            activityId: 'activity2',
            activityName: 'Activity 2',
            answerId: 'answer2',
            version: '2.0.0',
            completedDate: '2024-02-01',
            visit: 'visit2',
          },
        ],
      },
    ];

    expect(filteredData(form)).toEqual(expected);
  });

  test('should group activities by userId', () => {
    const form: UploadDataForm = {
      visitsForm: [
        {
          userId: 'user1',
          secretUserId: 'secret1',
          activityId: 'activity1',
          activityName: 'Activity 1',
          answerId: 'answer1',
          version: '1.0.0',
          completedDate: '2024-01-01',
          visit: 'visit1',
          selected: true,
        },
        {
          userId: 'user1',
          secretUserId: 'secret1',
          activityId: 'activity2',
          activityName: 'Activity 2',
          answerId: 'answer2',
          version: '2.0.0',
          completedDate: '2024-02-01',
          visit: 'visit2',
          selected: true,
        },
      ],
    };

    const expected: LorisUsersVisit[] = [
      {
        userId: 'user1',
        secretUserId: 'secret1',
        activities: [
          {
            activityId: 'activity1',
            activityName: 'Activity 1',
            answerId: 'answer1',
            version: '1.0.0',
            completedDate: '2024-01-01',
            visit: 'visit1',
          },
          {
            activityId: 'activity2',
            activityName: 'Activity 2',
            answerId: 'answer2',
            version: '2.0.0',
            completedDate: '2024-02-01',
            visit: 'visit2',
          },
        ],
      },
    ];

    expect(filteredData(form)).toEqual(expected);
  });

  test('should handle mixed selected and unselected activities correctly', () => {
    const form: UploadDataForm = {
      visitsForm: [
        {
          userId: 'user1',
          secretUserId: 'secret1',
          activityId: 'activity1',
          activityName: 'Activity 1',
          answerId: 'answer1',
          version: '1.0.0',
          completedDate: '2024-01-01',
          visit: 'visit1',
          selected: true,
        },
        {
          userId: 'user1',
          secretUserId: 'secret1',
          activityId: 'activity2',
          activityName: 'Activity 2',
          answerId: 'answer2',
          version: '2.0.0',
          completedDate: '2024-02-01',
          visit: 'visit2',
          selected: false,
        },
        {
          userId: 'user2',
          secretUserId: 'secret2',
          activityId: 'activity3',
          activityName: 'Activity 3',
          answerId: 'answer3',
          version: '3.0.0',
          completedDate: '2024-03-01',
          visit: 'visit3',
          selected: true,
        },
      ],
    };

    const expected: LorisUsersVisit[] = [
      {
        userId: 'user1',
        secretUserId: 'secret1',
        activities: [
          {
            activityId: 'activity1',
            activityName: 'Activity 1',
            answerId: 'answer1',
            version: '1.0.0',
            completedDate: '2024-01-01',
            visit: 'visit1',
          },
        ],
      },
      {
        userId: 'user2',
        secretUserId: 'secret2',
        activities: [
          {
            activityId: 'activity3',
            activityName: 'Activity 3',
            answerId: 'answer3',
            version: '3.0.0',
            completedDate: '2024-03-01',
            visit: 'visit3',
          },
        ],
      },
    ];

    expect(filteredData(form)).toEqual(expected);
  });
});
