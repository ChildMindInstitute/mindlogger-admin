import { fireEvent, screen, waitFor } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { mockedApplet } from 'shared/mock';
import { IntegrationTypes } from 'shared/consts';

import { DisconnectionPopup } from './DisconnectionPopup';
import { PopupProps } from '../ProlificIntegration.types';
import { deleteProlificIntegration } from '../ProlificIntegration.utils';

jest.mock('../ProlificIntegration.utils', () => ({
  deleteProlificIntegration: jest.fn(),
}));

type DisconnectionPopupProps = PopupProps;

const preloadedStateWithIntegration = {
  applet: {
    applet: {
      data: {
        result: {
          ...mockedApplet,
          integrations: [
            {
              integrationType: 'PROLIFIC' as IntegrationTypes,
              configuration: {},
            },
          ],
        },
      },
    },
  },
};

const defaultApplet = preloadedStateWithIntegration.applet.applet.data.result;

describe('ProlificIntegration', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should render the DisconnectionPopup', () => {
    const defaultProps: DisconnectionPopupProps = {
      open: true,
      onClose: jest.fn(),
      applet: defaultApplet,
      updateAppletData: jest.fn(),
    };

    renderWithProviders(<DisconnectionPopup {...defaultProps} />);

    expect(screen.getByTestId('prolific-disconnect-popup')).toBeInTheDocument();
    expect(screen.getByText('Disconnect from Prolific')).toBeInTheDocument();
    expect(screen.getByText('Delete Prolific API Token')).toBeInTheDocument();
    expect(screen.getByTestId('prolific-deletion-warning')).toBeInTheDocument();

    expect(screen.queryByTestId('prolific-configuration-popup')).toBeNull();
  });

  test('should close popup and update applet when clicking delete', async () => {
    (deleteProlificIntegration as jest.Mock).mockResolvedValue({});

    const onClose = jest.fn();
    const updateAppletData = jest.fn();

    renderWithProviders(
      <DisconnectionPopup
        onClose={onClose}
        updateAppletData={updateAppletData}
        applet={defaultApplet}
        open={true}
      />,
    );
    const closeButton = screen.getByRole('button', { name: /Delete Prolific API Token/i });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
      expect(updateAppletData).toHaveBeenCalled();
    });
  });
});
