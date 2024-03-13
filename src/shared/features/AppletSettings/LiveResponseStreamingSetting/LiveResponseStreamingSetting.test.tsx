// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { createRef } from 'react';
import { fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { asyncTimeout, renderWithAppletFormData } from 'shared/utils';
import { CHANGE_DEBOUNCE_VALUE } from 'shared/consts';

import { LiveResponseStreamingSetting } from './LiveResponseStreamingSetting';

const dataTestid = 'applet-settings-live-response-streaming';
const descriptionText = 'Send responses to a server of your choice, as they are being entered.';
const labelText = 'Enable streaming of response data';
const enterServerInfoText = 'Please enter your server information:';
const ipAddressFieldName = 'streamIpAddress';
const portFieldName = 'streamPort';
const mockedIpAddress = '192.168.1.1';
const mockedPort = 8080;

describe('LiveResponseStreamingSetting', () => {
  test('should render and apply changes correctly ', async () => {
    const { getByText, getByTestId, queryByText, queryByTestId } = renderWithAppletFormData({
      children: <LiveResponseStreamingSetting />,
      appletFormData: {
        streamEnabled: false,
        streamPort: null,
        streamIpAddress: null,
      },
    });

    const description = getByText(descriptionText);
    const label = getByText(labelText);

    expect(description).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(queryByText(enterServerInfoText)).not.toBeInTheDocument();
    expect(queryByTestId(`${dataTestid}-ip-address`)).not.toBeInTheDocument();
    expect(queryByTestId(`${dataTestid}-port`)).not.toBeInTheDocument();

    const checkbox = getByTestId(dataTestid);
    await userEvent.click(checkbox);

    expect(getByTestId(`${dataTestid}-ip-address`)).toBeInTheDocument();
    expect(getByTestId(`${dataTestid}-port`)).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(queryByText(enterServerInfoText)).toBeInTheDocument();
  });

  test('should handle IP address and port changes', async () => {
    const newMockedIpAddress = '100.100.2.2';
    const newMockedPort = 2500;
    const ref = createRef();

    const { getByTestId, getByLabelText } = renderWithAppletFormData({
      children: <LiveResponseStreamingSetting />,
      appletFormData: {
        streamEnabled: true,
        streamPort: mockedPort,
        streamIpAddress: mockedIpAddress,
      },
      formRef: ref,
    });

    expect(ref.current.getValues(ipAddressFieldName)).toBe(mockedIpAddress);
    expect(ref.current.getValues(portFieldName)).toBe(mockedPort);

    const checkbox = getByTestId(dataTestid);
    await userEvent.click(checkbox);

    expect(ref.current.getValues(ipAddressFieldName)).toBeNull();
    expect(ref.current.getValues(portFieldName)).toBeNull();

    await userEvent.click(checkbox);

    const ipAddressInput = getByLabelText('Default IP Address');
    await userEvent.type(ipAddressInput, newMockedIpAddress);
    await asyncTimeout(CHANGE_DEBOUNCE_VALUE);

    expect(ref.current.getValues(ipAddressFieldName)).toBe(newMockedIpAddress);

    const portInput = getByLabelText('Default Port');
    await userEvent.type(portInput, `${newMockedPort}`);
    await asyncTimeout(CHANGE_DEBOUNCE_VALUE);

    expect(ref.current.getValues(portFieldName)).toBe(newMockedPort);
  });

  test('should handle input fields errors', async () => {
    const wrongMockedIpAddress = '100..2.2';
    const wrongMockedPort = '999999d';
    const ref = createRef();

    const { getByTestId, getByLabelText, findByText } = renderWithAppletFormData({
      children: <LiveResponseStreamingSetting />,
      appletFormData: {
        streamEnabled: false,
        streamPort: null,
        streamIpAddress: null,
      },
      formRef: ref,
    });

    const checkbox = getByTestId(dataTestid);
    await userEvent.click(checkbox);

    const ipAddressInput = getByLabelText('Default IP Address');
    await userEvent.type(ipAddressInput, wrongMockedIpAddress);
    await asyncTimeout(CHANGE_DEBOUNCE_VALUE);

    expect(ref.current.getValues(ipAddressFieldName)).toBe(wrongMockedIpAddress);

    fireEvent.blur(ipAddressInput);

    const apiAddressError = await findByText('Invalid IP Address');
    expect(apiAddressError).toBeInTheDocument();

    const portInput = getByLabelText('Default Port');
    await userEvent.type(portInput, `${wrongMockedPort}`);
    await asyncTimeout(CHANGE_DEBOUNCE_VALUE);

    expect(ref.current.getValues(portFieldName)).toBe(wrongMockedPort);

    fireEvent.blur(ipAddressInput);

    const invalidPortError = await findByText('Invalid Port');
    expect(invalidPortError).toBeInTheDocument();
  });
});
