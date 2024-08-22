import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import * as encryptionFunctions from 'shared/utils/encryption';
import { mockedApplet, mockedEncryption, mockedPassword } from 'shared/mock';

import { ArbitraryWarningPopup } from './ArbitraryWarningPopup';
import { SUPPORT_LINK } from './ArbitraryWarningPopup.const';

const dataTestId = 'arbitrary-warning-popup';
const mockedOnSubmit = jest.fn();
const mockedOnClose = jest.fn();
const mockedAppletName = 'Applet Name';
const renderComponent = () =>
  renderWithProviders(
    <ArbitraryWarningPopup
      isOpen={true}
      onSubmit={mockedOnSubmit}
      onClose={mockedOnClose}
      appletId={mockedApplet.id}
      appletName={mockedAppletName}
      encryption={mockedEncryption}
      data-testid={dataTestId}
    />,
  );

describe('ArbitraryWarningPopup', () => {
  test('renders first screen correctly', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const windowOpenMock = jest.spyOn(window, 'open').mockImplementation(() => {});
    renderComponent();

    // first screen content
    expect(screen.getByText('Warning: Arbitrary Server is Connected')).toBeInTheDocument();
    expect(screen.getByText(mockedAppletName).closest('p')).toHaveTextContent(
      'Your applet Applet Name is currently connected to an arbitrary server for data storage. If you proceed with the ownership transfer without contacting us, your applet will lose its arbitrary server configurations, and all data it subsequently collects will be stored on MindLogger servers from this point forward. In order to transfer the ownership of the applet while retaining the arbitrary server configuration, please reach out to the MindLogger support team by clicking the button below.',
    );

    // first screen buttons
    const firstScreenLeftButton = screen.getByTestId(`${dataTestId}-left-button`);
    const firstScreenRightButton = screen.getByTestId(`${dataTestId}-submit-button`);
    expect(firstScreenLeftButton).toHaveTextContent('Contact Support');
    expect(firstScreenRightButton).toHaveTextContent('I wish to proceed anyway');

    await userEvent.click(firstScreenLeftButton);
    expect(windowOpenMock).toHaveBeenCalledWith(SUPPORT_LINK, '_blank', 'noopener,noreferrer');
  });

  test('renders second screen correctly', async () => {
    renderComponent();

    const firstScreenRightButton = screen.getByTestId(`${dataTestId}-submit-button`);
    await userEvent.click(firstScreenRightButton);

    // second screen content
    expect(screen.getByTestId(`${dataTestId}-title`)).toHaveTextContent('Transfer Ownership');
    expect(screen.getByText(mockedAppletName).closest('p')).toHaveTextContent(
      'Again, proceeding with the ownership transfer will cause this applet to lose its arbitrary server configurations, and all data it subsequently collects will be stored on MindLogger servers from this point forward. To proceed with the ownership transfer for your applet Applet Name and break its arbitrary server connections, please re-enter the password of your applet below.',
    );
    const appletPasswordInput = screen.getByTestId(`${dataTestId}-enter-password-input`);
    expect(appletPasswordInput).toBeInTheDocument();

    // second screen buttons
    const secondScreenLeftButton = screen.getByTestId(`${dataTestId}-left-button`);
    const secondScreenRightButton = screen.getByTestId(`${dataTestId}-submit-button`);
    expect(secondScreenLeftButton).toHaveTextContent('Back');
    expect(secondScreenRightButton).toHaveTextContent('Transfer Ownership');

    // back to the first screen on 'Back' button click
    await userEvent.click(secondScreenLeftButton);
    expect(screen.getByText('Warning: Arbitrary Server is Connected')).toBeInTheDocument();
    await userEvent.click(firstScreenRightButton);

    // 'Transfer Ownership' button click without entering of the Applet password
    await userEvent.click(secondScreenRightButton);
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  test('transfer ownership successfully if Applet password is correct', async () => {
    const getPublicKeyMock = () =>
      Buffer.from(JSON.parse(mockedApplet?.encryption?.publicKey || ''));
    jest.spyOn(encryptionFunctions, 'getAppletEncryptionInfo').mockReturnValue(
      Promise.resolve({
        getPublicKey: getPublicKeyMock,
      }),
    );
    renderComponent();

    const firstScreenRightButton = screen.getByTestId(`${dataTestId}-submit-button`);
    await userEvent.click(firstScreenRightButton);
    const secondScreenRightButton = screen.getByTestId(`${dataTestId}-submit-button`);
    const appletPasswordInput = screen.getByTestId(`${dataTestId}-enter-password-input`);

    await userEvent.type(appletPasswordInput, mockedPassword);
    await userEvent.click(secondScreenRightButton);

    expect(mockedOnSubmit).toHaveBeenCalled();
  });
});
