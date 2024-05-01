// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { createRef } from 'react';
import { generatePath } from 'react-router-dom';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { v4 as uuidv4 } from 'uuid';

import { page } from 'resources';
import { renderWithAppletFormData } from 'shared/utils/renderWithAppletFormData';
import { mockedAppletFormData } from 'shared/mock';

import { ActivityFlowBuilder } from './ActivityFlowBuilder';

const mockedActivityFlowBuilderTestid = 'builder-activity-flows-builder';

const mockedAppletFormDataWithTwoActivites = {
  ...mockedAppletFormData,
  activities: [
    mockedAppletFormData.activities[0],
    {
      ...mockedAppletFormData.activities[0],
      id: uuidv4(),
      name: 'Another Activity',
    },
  ],
};

const renderActivityFlowBuilder = (formData = mockedAppletFormDataWithTwoActivites) => {
  const ref = createRef();

  renderWithAppletFormData({
    children: <ActivityFlowBuilder />,
    formRef: ref,
    appletFormData: formData,
    options: {
      routePath: page.builderAppletActivityFlowItemBuilder,
      route: generatePath(page.builderAppletActivityFlowItemBuilder, {
        appletId: mockedAppletFormData.id,
        activityFlowId: mockedAppletFormData.activityFlows[0].id,
      }),
    },
  });

  return ref;
};

describe('Activity Flow Builder', () => {
  test('Is rendered correctly', async () => {
    renderActivityFlowBuilder();

    expect(screen.getByTestId(`${mockedActivityFlowBuilderTestid}-header`)).toHaveTextContent(
      'Activity Flow Builder',
    );
    expect(screen.getByTestId(`${mockedActivityFlowBuilderTestid}-add`)).toBeVisible();
    expect(screen.getByTestId(`${mockedActivityFlowBuilderTestid}-clear`)).toBeVisible();

    await waitFor(() => {
      const activities = screen.getAllByTestId(
        new RegExp(`^${mockedActivityFlowBuilderTestid}-flow-\\d+$`),
      );
      expect(activities).toHaveLength(1);
      activities.forEach((activity, index) => {
        expect(activity).toBeVisible();

        const mockedFlowTestid = `${mockedActivityFlowBuilderTestid}-flow-${index}`;
        expect(screen.getByTestId(`${mockedFlowTestid}-dots`)).toBeVisible();

        fireEvent.mouseEnter(activity.querySelector('div'));

        [
          `${mockedFlowTestid}-replace`,
          `${mockedFlowTestid}-duplicate`,
          `${mockedFlowTestid}-remove`,
          `${mockedFlowTestid}-dnd`,
        ].forEach((testId) => {
          expect(screen.getByTestId(testId)).toBeVisible();
        });
      });
    });
  });

  test('Add Activity', async () => {
    const ref = renderActivityFlowBuilder();

    const addActivity = screen.getByTestId(`${mockedActivityFlowBuilderTestid}-add`);
    fireEvent.click(addActivity);

    const selectActivity = screen.getByTestId(`${mockedActivityFlowBuilderTestid}-add-activity-1`);
    fireEvent.click(selectActivity);

    await waitFor(() => {
      const addedActivity = screen.getByTestId(`${mockedActivityFlowBuilderTestid}-flow-1`);
      expect(addedActivity).toBeVisible();
      expect(addedActivity).toHaveTextContent('Another Activity');
    });

    expect(ref.current.getValues('activityFlows.0.items')).toStrictEqual([
      ref.current.getValues('activityFlows.0.items.0'),
      {
        key: ref.current.getValues('activityFlows.0.items.1.key'),
        activityKey: mockedAppletFormDataWithTwoActivites.activities[1].id,
      },
    ]);
  });

  test('Clear Flow', async () => {
    const ref = renderActivityFlowBuilder();

    const clearFlow = screen.getByTestId(`${mockedActivityFlowBuilderTestid}-clear`);
    fireEvent.click(clearFlow);

    await waitFor(() => {
      expect(screen.getByTestId(`${mockedActivityFlowBuilderTestid}-clear-popup`)).toBeVisible();
    });

    fireEvent.click(
      screen.getByTestId(`${mockedActivityFlowBuilderTestid}-clear-popup-submit-button`),
    );

    await waitFor(() => {
      expect(
        screen.queryAllByTestId(new RegExp(`^${mockedActivityFlowBuilderTestid}-flow-\\d+$`)),
      ).toHaveLength(0);
      expect(ref.current.getValues('activityFlows.0.items')).toEqual([]);
      expect(clearFlow).toBeDisabled();
    });
  });

  describe('Flow Actions', () => {
    test('Replace', async () => {
      const ref = renderActivityFlowBuilder();

      const addActivity = screen.getByTestId(`${mockedActivityFlowBuilderTestid}-add`);
      fireEvent.click(addActivity);

      const selectActivity = screen.getByTestId(
        `${mockedActivityFlowBuilderTestid}-add-activity-0`,
      );
      fireEvent.click(selectActivity);

      await waitFor(() => {
        screen.getByTestId(`${mockedActivityFlowBuilderTestid}-flow-1`);
      });

      fireEvent.click(screen.getByTestId(`${mockedActivityFlowBuilderTestid}-flow-0-replace`));
      fireEvent.click(screen.getByTestId(`${mockedActivityFlowBuilderTestid}-add-activity-0`));

      await waitFor(() => {
        expect(ref.current.getValues('activityFlows.0.items.1.activityKey')).toEqual(
          mockedAppletFormDataWithTwoActivites.activities[0].id,
        );
      });
    });

    test('Duplicate', async () => {
      const ref = renderActivityFlowBuilder();

      await waitFor(() => {
        screen.getByTestId(`${mockedActivityFlowBuilderTestid}-flow-0`);
      });

      fireEvent.click(screen.getByTestId(`${mockedActivityFlowBuilderTestid}-flow-0-duplicate`));

      await waitFor(() => {
        screen.getByTestId(`${mockedActivityFlowBuilderTestid}-flow-1`);
      });

      expect(screen.getByTestId(`${mockedActivityFlowBuilderTestid}-flow-1`)).toHaveTextContent(
        'New Activity',
      );
      expect(ref.current.getValues('activityFlows.0.items')).toEqual([
        mockedAppletFormDataWithTwoActivites.activityFlows[0].items[0],
        {
          activityKey: mockedAppletFormDataWithTwoActivites.activityFlows[0].items[0].activityKey,
          key: ref.current.getValues('activityFlows.0.items.1.key'),
        },
      ]);
    });

    test('Remove', async () => {
      const ref = renderActivityFlowBuilder();

      await waitFor(() => {
        screen.getByTestId(`${mockedActivityFlowBuilderTestid}-flow-0`);
      });

      fireEvent.click(screen.getByTestId(`${mockedActivityFlowBuilderTestid}-flow-0-remove`));

      await waitFor(() => {
        expect(screen.getByTestId(`${mockedActivityFlowBuilderTestid}-remove-popup`)).toBeVisible();
      });

      fireEvent.click(
        screen.getByTestId(`${mockedActivityFlowBuilderTestid}-remove-popup-submit-button`),
      );

      await waitFor(() => {
        expect(
          screen.queryAllByTestId(new RegExp(`^${mockedActivityFlowBuilderTestid}-flow-\\d+$`)),
        ).toHaveLength(0);
        expect(ref.current.getValues('activityFlows.0.items')).toEqual([]);
      });
    });
  });
});
