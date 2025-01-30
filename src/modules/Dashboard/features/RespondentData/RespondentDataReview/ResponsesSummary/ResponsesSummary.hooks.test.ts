import * as routerDom from 'react-router-dom';

import { renderHookWithProviders } from 'shared/utils/renderHookWithProviders';
import { users } from 'redux/modules';
import { getRespondentName } from 'shared/utils';
import { Roles } from 'shared/consts';
import { SubjectDetailsWithDataAccess } from 'modules/Dashboard/types';

import { useResponsesSummary } from './ResponsesSummary.hooks';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

describe('useResponsesSummary', () => {
  const endDatetime = '2024-04-10T10:00:00';
  const createdAt = '2024-04-10T09:00:00';
  const identifier = 'test-identifier';
  const version = '1.0';

  test('should return a correct array with review description objects', () => {
    jest.spyOn(routerDom, 'useParams').mockReturnValue({ respondentId: '123' });
    const res: SubjectDetailsWithDataAccess = {
      secretUserId: 'secret123',
      nickname: 'John Doe',
      firstName: 'John',
      lastName: 'Doe',
      id: '123',
      lastSeen: '2024-04-10T10:00:00',
      userId: '123',
      roles: [Roles.Respondent],
      teamMemberCanViewData: true,
    };

    users.useRespondent = jest.fn().mockReturnValue({ result: res });
    users.useSubject = jest.fn().mockReturnValue({ details: undefined });

    const respondent = res?.nickname
      ? getRespondentName(res.secretUserId, res.nickname, 'comma')
      : '';

    const { result } = renderHookWithProviders(() =>
      useResponsesSummary({ endDatetime, createdAt, identifier, version, sourceSubject: res }),
    );

    expect(result.current).toEqual([
      {
        id: 'review-desc-1',
        title: 'Viewing responses submitted on:',
        content: 'Apr 10, 2024 10:00:00',
      },
      {
        id: 'review-desc-2',
        title: 'Respondent:',
        content: respondent,
      },
      {
        id: 'review-desc-3',
        title: 'Response Identifier:',
        content: identifier,
      },
      {
        id: 'review-desc-4',
        title: 'Version:',
        content: version,
      },
    ]);
  });
});
