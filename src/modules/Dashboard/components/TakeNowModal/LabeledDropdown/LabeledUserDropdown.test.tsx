import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { LabeledUserDropdown } from 'modules/Dashboard/components/TakeNowModal/LabeledDropdown/LabeledUserDropdown';
import { renderWithProviders } from 'shared/utils/renderWithProviders';

describe('LabeledUserDropdown', () => {
  const dataTestId = 'test';

  test('Shows label', () => {
    const { queryByText } = renderWithProviders(
      <LabeledUserDropdown
        label="Test Label"
        tooltip="Test Tooltip"
        name="test"
        options={[]}
        value={null}
        placeholder=""
        onChange={jest.fn()}
        data-testid={dataTestId}
      />,
    );

    expect(queryByText('Test Label')).toBeInTheDocument();
  });

  test('Shows tooltip on hover', async () => {
    const { queryByText, getByTestId } = renderWithProviders(
      <LabeledUserDropdown
        label="Test Label"
        tooltip="Test Tooltip"
        name="test"
        options={[]}
        value={null}
        placeholder=""
        onChange={jest.fn()}
        data-testid={dataTestId}
      />,
    );

    expect(queryByText('Test Tooltip')).not.toBeInTheDocument();
    const tooltipIcon = getByTestId(`${dataTestId}-tooltip-icon`);
    await userEvent.hover(tooltipIcon);
    expect(await screen.findByText('Test Tooltip')).toBeInTheDocument();
  });

  test('Shows placeholder', () => {
    const { queryByPlaceholderText } = renderWithProviders(
      <LabeledUserDropdown
        label="Test Label"
        tooltip="Test Tooltip"
        name="test"
        options={[]}
        value={null}
        placeholder="Test Placeholder"
        onChange={jest.fn()}
        data-testid={dataTestId}
      />,
    );

    expect(queryByPlaceholderText('Test Placeholder')).toBeInTheDocument();
  });

  test('Uses value if provided', () => {
    const testValue = { id: 'id', nickname: 'nickname', secretId: 'secretId' };

    const { queryByDisplayValue } = renderWithProviders(
      <LabeledUserDropdown
        label="Test Label"
        tooltip="Test Tooltip"
        name="test"
        options={[]}
        value={testValue}
        placeholder=""
        onChange={jest.fn()}
        data-testid={dataTestId}
      />,
    );

    expect(
      queryByDisplayValue(`${testValue.secretId} (${testValue.nickname})`),
    ).toBeInTheDocument();
  });

  test('Renders value correctly without nickname', () => {
    const testValue = { id: 'id', secretId: 'secretId' };

    const { queryByDisplayValue } = renderWithProviders(
      <LabeledUserDropdown
        label="Test Label"
        tooltip="Test Tooltip"
        name="test"
        options={[]}
        value={testValue}
        placeholder=""
        onChange={jest.fn()}
        data-testid={dataTestId}
      />,
    );

    expect(queryByDisplayValue(testValue.secretId)).toBeInTheDocument();
  });
});
