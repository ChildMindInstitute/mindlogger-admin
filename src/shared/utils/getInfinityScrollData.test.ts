import { getInfinityScrollData } from './getInfinityScrollData';

describe('getInfinityScrollData', () => {
  const action = vi.fn((nextPage: number) => nextPage);

  test.each`
    action    | totalSize | listSize | limit | isLoading | expectedCalls | expectedArgument | description
    ${action} | ${30}     | ${5}     | ${10} | ${true}   | ${0}          | ${0}             | ${'"action" should not be called if "isFetching" is true'}
    ${action} | ${0}      | ${5}     | ${10} | ${true}   | ${0}          | ${0}             | ${'"action" should not be called if "totalSize" is 0'}
    ${action} | ${30}     | ${30}    | ${10} | ${true}   | ${0}          | ${0}             | ${'"action" should not be called if "totalSize" is equal to "listSize"'}
    ${action} | ${20}     | ${5}     | ${10} | ${false}  | ${1}          | ${1}             | ${'"action" should be called after executing "loadNextPage" function'}
    ${action} | ${50}     | ${9}     | ${10} | ${false}  | ${1}          | ${1}             | ${'"action" should be called with an argument "1" if  ("limit" < "listSize")'}
    ${action} | ${50}     | ${19}    | ${10} | ${false}  | ${1}          | ${2}             | ${'"action" should be called with an argument "2" if  ("limit" <= "listSize" < "limit" * 2)'}
    ${action} | ${50}     | ${20}    | ${10} | ${false}  | ${1}          | ${3}             | ${'"action" should be called with an argument "3" if  ("limit" <= "listSize" <= "limit" * 2)'}
  `(
    '$description',
    async ({ action, totalSize, listSize, limit, isLoading, expectedCalls, expectedArgument }) => {
      const { loadNextPage } = getInfinityScrollData({
        action,
        totalSize,
        listSize,
        limit,
        isLoading,
      });

      await loadNextPage();

      expect(action).toBeCalledTimes(expectedCalls);

      if (expectedCalls && expectedArgument) {
        expect(action).toBeCalledWith(expectedArgument);
      }
    },
  );
});
