import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';

import { mockedAppletData } from 'shared/mock';
import { hydrateActivityFlows } from 'modules/Dashboard/utils';
import { ActivityAssignFormValues } from 'modules/Dashboard/components/ActivityAssignDrawer/ActivityAssignDrawer.types';
import { Activity, ActivityFlow } from 'redux/modules';

import { ActivitiesList } from './ActivitiesList';

const mockActivities = mockedAppletData.activities as unknown as Activity[];
const mockFlows = hydrateActivityFlows(
  mockedAppletData.activityFlows as unknown as ActivityFlow[],
  mockActivities,
);

const mockTestId = 'test-id';

const ActivitiesListTest = (
  defaultValues: Pick<ActivityAssignFormValues, 'activityIds' | 'flowIds'>,
) => {
  const { control } = useForm<ActivityAssignFormValues>({
    defaultValues,
  });

  return (
    <ActivitiesList
      activities={mockActivities}
      flows={mockFlows}
      control={control}
      data-testid={mockTestId}
    />
  );
};

describe('ActivitiesList component', () => {
  it('renders the list of activities & flows', () => {
    render(<ActivitiesListTest activityIds={[]} flowIds={[]} />);

    const activityItems = screen.getAllByTestId(`${mockTestId}-activity-item`);
    expect(activityItems).toHaveLength(mockActivities.length);
    const flowItems = screen.getAllByTestId(`${mockTestId}-flow-item`);
    expect(flowItems).toHaveLength(mockFlows.length);
  });

  it('renders the list of activities & flows with checkboxes checked', () => {
    const activityIds = [String(mockActivities[0].id)];
    const flowIds = [String(mockFlows[0].id)];

    render(<ActivitiesListTest activityIds={activityIds} flowIds={flowIds} />);

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
