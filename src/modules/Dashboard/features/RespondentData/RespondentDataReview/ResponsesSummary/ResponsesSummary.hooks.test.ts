import { renderHook } from '@testing-library/react';
import * as routerDom from 'react-router-dom';

import { renderHookWithProviders } from 'shared/utils/renderHookWithProviders';
import { useRespondentLabel } from 'shared/hooks';
import { users } from 'redux/modules';

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
    const res = {
      secretUserId: 'secret123',
      nickname: '',
    };

    users.useRespondent = jest.fn().mockReturnValue({ result: res });
    users.useSubject = jest.fn().mockReturnValue({ details: undefined });

    const { result: respondent } = renderHook(() => useRespondentLabel({ hideLabel: true }));

    const { result } = renderHookWithProviders(() =>
      useResponsesSummary({ endDatetime, createdAt, identifier, version }),
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
        content: respondent.current,
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
