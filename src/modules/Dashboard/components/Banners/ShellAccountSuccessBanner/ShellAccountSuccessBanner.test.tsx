import { fireEvent } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
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
const mockedUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));
const route = `/dashboard/${mockedAppletId}/add-user`;
const routePath = page.appletAddUser;

describe('ShellAccountSuccessBanner', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should render', () => {
    const { getByTestId, getByText } = renderWithProviders(
      <ShellAccountSuccessBanner {...props} />,
    );

    expect(getByTestId(dataTestid)).toBeInTheDocument();
    expect(
      getByText('Shell account was successfully created and is available on the tab.'),
    ).toBeInTheDocument();
    expect(getByText(props.id)).toBeInTheDocument();
  });

  test('clicking the close button hides the banner', () => {
    const { getByTitle } = renderWithProviders(<ShellAccountSuccessBanner {...props} />);

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

    const button = getAllByRole('button');
    fireEvent.click(button[0]);

    expect(mockedUseNavigate).toBeCalledWith(`/dashboard/${mockedAppletId}/respondents`);
    expect(mockDispatch).nthCalledWith(1, {
      payload: { key: 'ShellAccountSuccessBanner' },
      type: 'banners/removeBanner',
    });
  });
});
