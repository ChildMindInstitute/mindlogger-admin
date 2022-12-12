import { fireEvent, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import { act } from 'react-dom/test-utils';

import { renderWithProviders } from 'utils/renderWithProviders';

import { LinkGenerator } from './LinkGenerator';

const response = {
  data: {
    requireLogin: true,
    inviteId: 'inviteId',
  },
};

const fakeRequest = () => new Promise((res) => res(response));

describe('LinkGenerator component tests', () => {
  const mockedAxios = axios.create();

  test('LinkGenerator should generate link', async () => {
    jest.spyOn(mockedAxios, 'post').mockImplementation(fakeRequest);
    renderWithProviders(<LinkGenerator />);

    fireEvent.click(screen.getByTestId('generate-btn'));
    await waitFor(() => expect(screen.queryByTestId('modal')).toBeInTheDocument());
    await waitFor(() => fireEvent.click(screen.getByTestId('generate-with-login')));
    await waitFor(() => expect(screen.getByTestId('generated-input')).toBeInTheDocument());
  });

  test('LinkGenerator should get link', async () => {
    jest
      .spyOn(mockedAxios, 'get')
      .mockImplementation(async () => await act(fakeRequest as () => Promise<void>));
    renderWithProviders(<LinkGenerator />);

    await waitFor(() => expect(screen.getByTestId('generated-input')).toBeInTheDocument());
  });
});
