import { fireEvent, screen } from '@testing-library/react';

import { DATA_TESTID_EXPORT_DATA_SETTINGS_POPUP } from 'shared/features/AppletSettings/ExportDataSetting/ExportDataSetting.const';
import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { HeaderOptions } from './HeaderOptions';

const testId = 'test-applet-id';
const mockUseNavigate = jest.fn();
const mockedUseParams = () => ({ appletId: testId });

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUseNavigate,
  useParams: () => mockedUseParams(),
}));

describe('HeaderOptions', () => {
  beforeEach(() => {
    renderWithProviders(<HeaderOptions />);
  });

  test('should open Export dialog when option is pressed', () => {
    fireEvent.click(screen.getByTestId('header-option-export-button'));

    expect(screen.queryByTestId(DATA_TESTID_EXPORT_DATA_SETTINGS_POPUP)).toBeInTheDocument();
  });

  test('should contain link to settings page', () => {
    expect(screen.getByTestId('header-option-settings-link')).toHaveAttribute(
      'href',
      `/dashboard/${testId}/settings`,
    );
  });
});
