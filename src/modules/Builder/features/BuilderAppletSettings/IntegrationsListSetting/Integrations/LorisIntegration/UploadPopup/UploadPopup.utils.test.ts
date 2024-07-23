import { filteredData } from './UploadPopup.utils';

describe('filteredData', () => {
  test('should return an empty array when there are no visits', () => {
    const form = { visitsForm: [] };
    expect(filteredData(form)).toEqual([]);
  });

  test('should return an empty array when no activities are selected', () => {
    const form = {
      visitsForm: [
        {
          userId: 'userId1',
          secretUserId: 'secretUserId1',
          activities: [
            {
              activityId: 'activityId1',
              activityName: 'activityName1',
              answerId: 'answerId1',
              version: '1.0',
              completedDate: '2022-01-01',
              visit: '',
              selected: false,
            },
          ],
        },
      ],
    };
    expect(filteredData(form)).toEqual([]);
  });

  test('should handle multiple users with mixed selected and unselected activities', () => {
    const form = {
      visitsForm: [
        {
          userId: 'userId1',
          secretUserId: 'secretUserId1',
          activities: [
            {
              activityId: 'activityId1',
              activityName: 'activityName1',
              answerId: 'answerId1',
              version: '1.0',
              completedDate: '2022-01-01',
              visit: '',
              visits: [],
              selected: false,
            },
            {
              activityId: 'activityId2',
              activityName: 'activityName2',
              answerId: 'answerId2',
              version: '1.0',
              completedDate: '2022-01-01',
              visit: 'V1',
              visits: [],
              selected: true,
            },
          ],
        },
        {
          userId: 'userId2',
          secretUserId: 'secretUserId2',
          activities: [
            {
              activityId: 'activityId2',
              activityName: 'activityName2',
              answerId: 'answerId2',
              version: '1.0',
              completedDate: '2022-01-01',
              visit: 'V2',
              visits: [],
              selected: true,
            },
          ],
        },
      ],
    };

    const expectedOutput = [
      {
        userId: 'userId1',
        secretUserId: 'secretUserId1',
        activities: [
          {
            activityId: 'activityId2',
            activityName: 'activityName2',
            answerId: 'answerId2',
            version: '1.0',
            completedDate: '2022-01-01',
            visit: 'V1',
          },
        ],
      },
      {
        secretUserId: 'secretUserId2',
        userId: 'userId2',
        activities: [
          {
            activityId: 'activityId2',
            activityName: 'activityName2',
            answerId: 'answerId2',
            completedDate: '2022-01-01',
            version: '1.0',
            visit: 'V2',
          },
        ],
      },
    ];

    expect(filteredData(form)).toEqual(expectedOutput);
  });
});
