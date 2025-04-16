import { fireEvent, screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { mockedAppletId } from 'shared/mock';
import { getPreloadedState } from 'shared/tests/getPreloadedState';
import { Roles } from 'shared/consts';

import { HeaderOptions } from './HeaderOptions';

const mockUseNavigate = vi.fn();
const mockedUseParams = () => ({ appletId: mockedAppletId });

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUseNavigate,
  useParams: () => mockedUseParams(),
}));

describe('HeaderOptions', () => {
  beforeEach(() => {
    renderWithProviders(<HeaderOptions />, { preloadedState: getPreloadedState() });
  });

  test('should open Export dialog when option is pressed', () => {
    fireEvent.click(screen.getByTestId('header-option-export-button'));

    expect(screen.queryByTestId('export-data-settings')).toBeInTheDocument();
  });

  test('should contain link to settings page', () => {
    expect(screen.getByTestId('header-option-settings-link')).toHaveAttribute(
      'href',
      `/dashboard/${mockedAppletId}/settings`,
    );
  });
});
describe('should show or hide header buttons depending on role', () => {
  test.each`
    canEdit  | canAccessData | role                 | description
    ${true}  | ${true}       | ${Roles.Manager}     | ${'header for Manager'}
    ${true}  | ${true}       | ${Roles.SuperAdmin}  | ${'header for SuperAdmin'}
    ${true}  | ${true}       | ${Roles.Owner}       | ${'header for Owner'}
    ${false} | ${false}      | ${Roles.Coordinator} | ${'header for Coordinator'}
    ${true}  | ${false}      | ${Roles.Editor}      | ${'header for Editor'}
    ${false} | ${false}      | ${Roles.Respondent}  | ${'header for Respondent'}
    ${false} | ${true}       | ${Roles.Reviewer}    | ${'header for Reviewer'}
  `('$description', async ({ canEdit, canAccessData, role }) => {
    renderWithProviders(<HeaderOptions />, {
      preloadedState: getPreloadedState(role),
    });

    const settingsButton = screen.queryAllByTestId('header-option-settings-link')[0];
    canEdit ? expect(settingsButton).toBeDefined() : expect(settingsButton).toBe(undefined);

    const exportButton = screen.queryAllByTestId('header-option-export-button')[0];
    canAccessData ? expect(exportButton).toBeDefined() : expect(exportButton).toBe(undefined);
  });
});
