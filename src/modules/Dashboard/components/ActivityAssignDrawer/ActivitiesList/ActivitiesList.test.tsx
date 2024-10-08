import { render, screen } from '@testing-library/react';

import { mockedAppletData } from 'shared/mock';
import { hydrateActivityFlows } from 'modules/Dashboard/utils';
import { Activity, ActivityFlow } from 'redux/modules';

import { ActivitiesList } from './ActivitiesList';

const mockActivities = mockedAppletData.activities as unknown as Activity[];
const mockFlows = hydrateActivityFlows(
  mockedAppletData.activityFlows as unknown as ActivityFlow[],
  mockActivities,
);

const mockTestId = 'test-id';

describe('ActivitiesList component', () => {
  it('renders the list of activities & flows', () => {
    render(
      <ActivitiesList
        activities={mockActivities}
        flows={mockFlows}
        data-testid={mockTestId}
        activityIds={[]}
        flowIds={[]}
      />,
    );

    const activityItems = screen.getAllByTestId(`${mockTestId}-activity-item`);
    expect(activityItems).toHaveLength(mockActivities.length);
    const flowItems = screen.getAllByTestId(`${mockTestId}-flow-item`);
    expect(flowItems).toHaveLength(mockFlows.length);
  });

  it('renders the list of activities & flows with checkboxes checked', () => {
    const activityIds = [String(mockActivities[0].id)];
    const flowIds = [String(mockFlows[0].id)];

    render(
      <ActivitiesList
        activities={mockActivities}
        flows={mockFlows}
        data-testid={mockTestId}
        activityIds={activityIds}
        flowIds={flowIds}
      />,
    );

    // Check if the checkboxes are checked for the specified activity and flow IDs
    activityIds.forEach((id) => {
      const checkbox = screen
        .getByTestId(`${mockTestId}-activity-checkbox-${id}`)
        .querySelector('input');
      expect(checkbox).toBeChecked();
    });

    flowIds.forEach((id) => {
      const checkbox = screen
        .getByTestId(`${mockTestId}-flow-checkbox-${id}`)
        .querySelector('input');
      expect(checkbox).toBeChecked();
    });
  });
});
