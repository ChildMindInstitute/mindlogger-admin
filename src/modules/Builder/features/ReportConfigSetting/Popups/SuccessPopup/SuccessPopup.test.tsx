import { fireEvent, screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils';

import { SuccessPopup } from './SuccessPopup';

const onCloseMock = jest.fn();

describe('SuccessPopup', () => {
  test('should render', () => {
    renderWithProviders(<SuccessPopup popupVisible={true} onClose={onCloseMock} />);

    expect(
      screen.getByTestId('builder-applet-settings-report-config-setting-success-popup'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Report configuration has been updated successfully.'),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText('Ok'));

    expect(onCloseMock).toBeCalled();
  });
});
