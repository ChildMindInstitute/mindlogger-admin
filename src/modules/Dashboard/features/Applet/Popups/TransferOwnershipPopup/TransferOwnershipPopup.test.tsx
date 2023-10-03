import { fireEvent, waitFor, screen } from '@testing-library/react';
import axios from 'axios';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { Applet } from 'api';

import { TransferOwnershipPopup } from '.';

const email = 'test@gmail.com';
const mockedApplet = {
  id: '2e46fa32-ea7c-4a76-b49b-1c97d795bb9a',
  displayName: 'displayName',
  encryption: {
    publicKey:
      '[61,30,213,174,162,231,7,138,60,189,252,133,200,126,46,221,248,99,20,44,236,54,122,36,99,234,19,86,239,145,78,16,224,164,162,173,70,1,222,109,178,222,246,8,155,183,103,34,63,83,174,175,106,42,166,14,175,58,21,152,153,242,65,246,81,138,232,37,92,10,100,61,68,61,75,37,94,202,43,43,121,87,145,144,37,134,123,162,8,230,170,246,25,253,96,43,91,0,11,106,140,126,70,59,246,145,199,90,95,9,218,127,180,122,46,0,167,193,183,164,96,53,27,104,91,232,206,65]',
    prime:
      '[142,53,84,26,33,215,174,82,178,158,65,41,36,152,127,139,197,84,90,109,103,78,94,198,149,47,225,230,115,130,194,200,81,168,101,114,98,61,177,75,5,177,145,221,227,162,65,164,108,175,141,135,195,231,15,60,128,194,133,208,69,128,254,215,114,154,198,158,109,213,187,214,158,249,206,122,105,179,103,3,182,125,47,178,49,40,174,108,200,234,147,92,166,82,149,188,194,204,56,232,83,74,155,128,101,255,174,173,116,143,235,160,156,12,125,136,25,12,107,22,160,16,138,212,164,236,224,235]',
    base: '[2]',
    accountId: '8a1f6b52-a00f-4adb-83be-461bc2e4f119',
  },
} as Applet;
const preloadedState = {
  popups: {
    data: {
      applet: mockedApplet,
      encryption: null,
      popupProps: undefined,
      deletePopupVisible: false,
      duplicatePopupsVisible: false,
      transferOwnershipPopupVisible: true,
      publishConcealPopupVisible: false,
    },
  },
};

const fakeSuccessRequest = () => new Promise((res) => res(null));

describe('TransferOwnershipPopup component tests', () => {
  const mockedAxios = axios.create();

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('TransferOwnershipPopup should appear success text', async () => {
    jest.spyOn(mockedAxios, 'post').mockImplementation(fakeSuccessRequest);

    renderWithProviders(<TransferOwnershipPopup />, {
      preloadedState,
    });

    fireEvent.change(screen.getByLabelText(/Owner email/), {
      target: { value: email },
    });
    fireEvent.click(screen.getByText('Confirm'));
    await waitFor(() => {
      const el = screen.getByText('Your request has been successfully sent to', { exact: false });
      expect(el.textContent).toEqual(
        'Your request has been successfully sent to test@gmail.com. Please wait for receiver to accept your request.',
      );
    });
  });
});
