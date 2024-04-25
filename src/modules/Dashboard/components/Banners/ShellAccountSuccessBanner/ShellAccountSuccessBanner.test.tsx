import { fireEvent } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils';
import * as reduxHooks from 'redux/store/hooks';
import { mockedAppletId } from 'shared/mock';
import { page } from 'resources';

import { ShellAccountSuccessBanner } from './ShellAccountSuccessBanner';

const mockOnClose = jest.fn();
const dataTestid = 'success-banner';
const props = {
  id: 'test-id',
  onClose: mockOnClose,
  'data-testid': dataTestid,
};

const route = `/dashboard/${mockedAppletId}/add-user`;
const routePath = page.appletAddUser;

describe('ShellAccountSuccessBanner', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should render', () => {
    const { getByTestId, getByText } = renderWithProviders(
      <ShellAccountSuccessBanner {...props} />,
      { route, routePath },
    );

    expect(getByTestId(dataTestid)).toBeInTheDocument();
    expect(
      getByText('Shell account was successfully created and is available on the tab.'),
    ).toBeInTheDocument();
    expect(getByText(props.id)).toBeInTheDocument();
  });

  test('clicking the close button hides the banner', () => {
    const { getByTitle } = renderWithProviders(<ShellAccountSuccessBanner {...props} />, {
      route,
      routePath,
    });

    const closeButton = getByTitle('Close');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('navigates to Respondents tab and closes the banner on the "Respondents" button click', () => {
    const mockDispatch = jest.fn();
    jest.spyOn(reduxHooks, 'useAppDispatch').mockReturnValue(mockDispatch);
    const { getAllByRole } = renderWithProviders(<ShellAccountSuccessBanner {...props} />, {
      route,
      routePath,
    });

    const link = getAllByRole('link');
    expect(link[0]).toHaveAttribute('href', `/dashboard/${mockedAppletId}/respondents`);
    fireEvent.click(link[0]);

    expect(mockDispatch).nthCalledWith(1, {
      payload: { key: 'ShellAccountSuccessBanner' },
      type: 'banners/removeBanner',
    });
  });
});
