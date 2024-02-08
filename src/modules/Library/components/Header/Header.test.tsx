// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils';

import { Header } from './Header';
import { RightButtonType } from './Header.types';

const rightButtonCallback = jest.fn();
const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

const preloadedState = {
  library: {
    cartApplets: {
      data: { count: 4 },
    },
  },
};

describe('Header component tests', () => {
  test(' should show the back button when isBackButtonVisible is true', async () => {
    renderWithProviders(<Header isBackButtonVisible={true} />);

    const backButton = screen.getByTestId('library-back-button');
    expect(backButton).toBeVisible();

    await userEvent.click(backButton);
    expect(mockedUseNavigate).toBeCalledWith('/library');
  });

  test('should do not show the back button when isBackButtonVisible is false', () => {
    renderWithProviders(<Header isBackButtonVisible={false} />);

    const backButton = screen.queryByTestId('library-back-button');
    expect(backButton).toBeNull();
  });

  test('should render the search input when handleSearch is provided', () => {
    const handleSearch = jest.fn();
    renderWithProviders(<Header handleSearch={handleSearch} />);

    const searchInput = screen.getByTestId('library-search');
    expect(searchInput).toBeVisible();
  });

  test('should render the cart button when rightButtonType is Cart', () => {
    renderWithProviders(<Header rightButtonType={RightButtonType.Cart} />, { preloadedState });

    const appletsCountElement = screen.getByTestId('library-cart-applets-count');
    const expectedText = '4 Applets';

    expect(appletsCountElement).toHaveTextContent(expectedText);

    const cartButton = screen.getByTestId('library-cart-button');
    expect(cartButton).toBeVisible();
  });

  test('should render the builder button when rightButtonType is not Cart', () => {
    renderWithProviders(<Header rightButtonType={RightButtonType.Builder} />);

    const builderButton = screen.getByTestId('library-add-to-builder');
    expect(builderButton).toBeVisible();
  });

  test('should call the rightButtonCallback when the cart button is clicked', async () => {
    renderWithProviders(<Header rightButtonType={RightButtonType.Cart} rightButtonCallback={rightButtonCallback} />);

    const cartButton = screen.getByTestId('library-cart-button');
    await userEvent.click(cartButton);
    expect(rightButtonCallback).toHaveBeenCalled();
  });

  test('should call the rightButtonCallback when the builder button is clicked', async () => {
    renderWithProviders(<Header rightButtonType={RightButtonType.Builder} rightButtonCallback={rightButtonCallback} />);

    const builderButton = screen.getByTestId('library-add-to-builder');
    await userEvent.click(builderButton);
    expect(rightButtonCallback).toHaveBeenCalled();
  });
});
