// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useNavigate, useParams } from 'react-router-dom';

import { useIsServerConfigured } from 'shared/hooks/useIsServerConfigured';
import { applet } from 'redux/modules';

import { LorisIntegration } from './LorisIntegration';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock('shared/hooks/useIsServerConfigured', () => ({
  useIsServerConfigured: jest.fn(),
}));

jest.mock('redux/modules', () => ({
  applet: {
    useAppletData: jest.fn(),
  },
}));

describe('LorisIntegration', () => {
  const navigate = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(navigate);
    useParams.mockReturnValue({ appletId: 'appletId' });
  });

  test('should render the LorisIntegration component with server not configured', () => {
    useIsServerConfigured.mockReturnValue(false);
    applet.useAppletData.mockReturnValue({ result: { integrations: [] } });

    render(<LorisIntegration />);

    expect(screen.getByText('LORIS')).toBeInTheDocument();
    expect(screen.getByText('Report Server Status: Not connected.')).toBeInTheDocument();
    expect(
      screen.getByText(
        'This integration will allow you to decrypt and upload responses from this applet to your LORIS database.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByTestId('loris-integration-description')).toBeInTheDocument();
    expect(screen.getByText('Connect')).toBeInTheDocument();
  });

  test('should render the LorisIntegration component with server configured and integration enabled', () => {
    useIsServerConfigured.mockReturnValue(true);
    applet.useAppletData.mockReturnValue({
      result: { integrations: ['Loris'] },
    });

    render(<LorisIntegration />);

    expect(screen.getByText('LORIS')).toBeInTheDocument();
    expect(screen.getByText('Report Server Status: Connected.')).toBeInTheDocument();
    expect(
      screen.getByText(
        'This integration will allow you to decrypt and upload responses from this applet to your LORIS database.',
      ),
    );
    expect(screen.getByText('Disconnect from LORIS')).toBeInTheDocument();
    expect(screen.getByText('Upload')).toBeInTheDocument();
  });

  test('should show ConfigurationPopup when connect button is clicked', async () => {
    useIsServerConfigured.mockReturnValue(true);
    applet.useAppletData.mockReturnValue({ result: { integrations: [] } });

    render(<LorisIntegration />);

    await userEvent.click(screen.getByTestId('loris-integration-connect-button'));

    expect(screen.getByTestId('loris-configuration-popup')).toBeInTheDocument();
    expect(screen.getByText('LORIS Configuration')).toBeInTheDocument();
  });

  test('should show DisconnectionPopup when disconnect text is clicked', async () => {
    useIsServerConfigured.mockReturnValue(true);
    applet.useAppletData.mockReturnValue({
      result: { integrations: ['Loris'] },
    });

    render(<LorisIntegration />);

    await userEvent.click(screen.getByTestId('loris-integration-disconnect-button'));

    expect(screen.getByTestId('loris-disconnection-popup')).toBeInTheDocument();
    expect(screen.getByText('LORIS Configuration')).toBeInTheDocument();
  });

  test('should show UploadPopup when upload button is clicked', async () => {
    useIsServerConfigured.mockReturnValue(true);
    applet.useAppletData.mockReturnValue({
      result: { integrations: ['Loris'] },
    });

    render(<LorisIntegration />);

    await userEvent.click(screen.getByTestId('loris-integration-upload-button'));

    expect(screen.getByTestId('loris-upload-popup')).toBeInTheDocument();
    expect(screen.getByText('LORIS Data Upload')).toBeInTheDocument();
  });

  test('should redirect to report configuration when Report Configuration link is clicked', async () => {
    useIsServerConfigured.mockReturnValue(false);
    applet.useAppletData.mockReturnValue({ result: { integrations: [] } });

    render(<LorisIntegration />);

    await userEvent.click(screen.getByText('Report Configuration'));
    expect(navigate).toHaveBeenCalledWith('/builder/appletId/settings/report-configuration');
  });
});
