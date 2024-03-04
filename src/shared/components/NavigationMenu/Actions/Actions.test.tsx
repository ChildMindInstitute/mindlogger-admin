import { fireEvent, screen } from '@testing-library/react';

import { Roles } from 'shared/consts';
import { DATA_TESTID_EXPORT_DATA_SETTINGS_POPUP } from 'shared/features/AppletSettings/ExportDataSetting/ExportDataSetting.const';
import { getPreloadedState } from 'shared/tests/getPreloadedState';
import { renderWithProviders } from 'shared/utils';

import { Actions } from './Actions';
import { DATA_TESTID_ACTIONS_EXPORT_DATA } from './Actions.const';

describe('NavigationMenu/Actions', () => {
  test.each`
    role                 | description
    ${Roles.Coordinator} | ${'coordinator'}
    ${Roles.Reviewer}    | ${'reviewer'}
    ${Roles.Respondent}  | ${'respondent'}
  `('should not render if user is $description', async ({ role }) => {
    renderWithProviders(<Actions isCompact={false} />, {
      preloadedState: getPreloadedState(role),
    });

    expect(screen.queryByTestId(DATA_TESTID_ACTIONS_EXPORT_DATA)).not.toBeInTheDocument();
  });

  test.each`
    role             | description
    ${Roles.Manager} | ${'manager'}
    ${Roles.Owner}   | ${'owner'}
  `('should render if user is $description', async ({ role }) => {
    renderWithProviders(<Actions isCompact={false} />, {
      preloadedState: getPreloadedState(role),
    });

    expect(screen.queryByTestId(DATA_TESTID_ACTIONS_EXPORT_DATA)).toBeInTheDocument();
  });

  it('should render export settings modal if trigger is clicked', async () => {
    renderWithProviders(<Actions isCompact={false} />, {
      preloadedState: getPreloadedState(Roles.Manager),
    });

    fireEvent.click(screen.getByTestId(DATA_TESTID_ACTIONS_EXPORT_DATA));

    expect(screen.queryByTestId(DATA_TESTID_EXPORT_DATA_SETTINGS_POPUP)).toBeInTheDocument();
  });
});
