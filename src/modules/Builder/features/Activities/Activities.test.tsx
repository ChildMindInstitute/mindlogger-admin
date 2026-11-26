// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { createRef } from 'react';
import { generatePath } from 'react-router-dom';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

import { page } from 'resources';
import { mockedAppletFormData, mockedSingleSelectFormValues } from 'shared/mock';
import { banners } from 'shared/state';
import { renderWithAppletFormData } from 'shared/utils/renderWithAppletFormData';
import { BuilderSaveContext } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.context';

import { Activities } from './Activities';
import { PerformanceTasks } from './Activities.types';

const mockedAppletWithNoActivities = {
  ...mockedAppletFormData,
  activities: [],
};

const mockedDescription = 'Description';
const mockedEmptyActivity = {
  name: 'New Activity',
  description: '',
  showAllAtOnce: false,
  isSkippable: false,
  responseIsEditable: true,
  isHidden: false,
  isReviewable: false,
  autoAssign: true,
  items: [],
  scoresAndReports: {
    generateReport: false,
    reports: [],
    showScoreSummary: false,
  },
  conditionalLogic: [],
  subscaleSetting: undefined,
  id: undefined,
  key: uuidv4(),
};
const mockedActivityWithoutName = {
  ...mockedEmptyActivity,
  name: '',
};
const mockedActivityWithItems = {
  ...mockedEmptyActivity,
  items: [mockedSingleSelectFormValues],
};
const mockedActivityWithDescription = {
  ...mockedEmptyActivity,
  description: mockedDescription,
};
const mockedActivityWithItemsAndDescription = {
  ...mockedEmptyActivity,
  description: mockedDescription,
  items: [mockedSingleSelectFormValues],
};

const mockedTestid = 'builder-activities-activity';
const mockedIPadTestid = 'builder-activities-add-perf-task-abtrails';
const mockedMobileTestid = 'builder-activities-add-perf-task-abtrails-mobile';
const mockedFlankerTestid = 'builder-activities-add-perf-task-flanker';
const mockedGyroscopeTestid = 'builder-activities-add-perf-task-gyroscope';
const mockedTouchTestid = 'builder-activities-add-perf-task-touch';
const mockedUnityTestid = 'builder-activities-add-perf-task-unity';

const mockedUseNavigate = vi.fn();

// mock the module
vi.mock('react-router-dom', async () => {
  // pull in the real implementation
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useNavigate: () => mockedUseNavigate,
  };
});

const renderActivities = (formData, preloadedState) => {
  const ref = createRef();

  renderWithAppletFormData({
    children: <Activities />,
    formRef: ref,
    appletFormData: formData,
    options: {
      preloadedState,
      routePath: page.builderAppletActivities,
      route: generatePath(page.builderAppletActivities, { appletId: mockedAppletFormData.id }),
    },
  });

  return ref;
};

const addPerfTask = (perfTaskType) => {
  fireEvent.click(screen.getByTestId('builder-activities-add-perf-task'));

  switch (perfTaskType) {
    case PerformanceTasks.AbTrailsIpad:
      return fireEvent.click(screen.getByTestId(mockedIPadTestid));
    case PerformanceTasks.AbTrailsMobile:
      return fireEvent.click(screen.getByTestId(mockedMobileTestid));
    case PerformanceTasks.Flanker:
      return fireEvent.click(screen.getByTestId(mockedFlankerTestid));
    case PerformanceTasks.Gyroscope:
      return fireEvent.click(screen.getByTestId(mockedGyroscopeTestid));
    case PerformanceTasks.Touch:
      return fireEvent.click(screen.getByTestId(mockedTouchTestid));
    case PerformanceTasks.Unity:
      return fireEvent.click(screen.getByTestId(mockedUnityTestid));
    default:
      return;
  }
};

describe('Activities', () => {
  test('Activities page with no activities', () => {
    renderActivities(mockedAppletWithNoActivities);

    expect(screen.getByText('At least 1 activity is required.')).toBeVisible();
    expect(screen.getByTestId('builder-activities-add-activity')).toBeVisible();
    expect(screen.getByTestId('builder-activities-add-perf-task')).toBeVisible();
  });

  describe('Activity Item is rendered correctly', () => {
    test('Actions', async () => {
      renderActivities(mockedAppletFormData);

      await waitFor(() => {
        expect(screen.getByTestId(`${mockedTestid}-0`)).toBeVisible();
        expect(screen.getByTestId(`${mockedTestid}-0-dots`)).toBeVisible();
      });

      fireEvent.mouseEnter(screen.getByTestId(`${mockedTestid}-0`).querySelector('div'));

      [
        `${mockedTestid}-0-edit`,
        `${mockedTestid}-0-duplicate`,
        `${mockedTestid}-0-hide`,
        `${mockedTestid}-0-remove`,
        `${mockedTestid}-0-dnd`,
      ].forEach((testId) => {
        expect(screen.getByTestId(testId)).toBeVisible();
      });
    });

    test.each`
      activity                                 | name              | items        | activityDescription  | description
      ${mockedActivityWithoutName}             | ${''}             | ${'0 items'} | ${''}                | ${'Empty name/items/description'}
      ${mockedActivityWithDescription}         | ${'New Activity'} | ${'0 items'} | ${mockedDescription} | ${'Filled in description'}
      ${mockedActivityWithItems}               | ${'New Activity'} | ${'1 item'}  | ${''}                | ${'With Items'}
      ${mockedActivityWithItemsAndDescription} | ${'New Activity'} | ${'1 item'}  | ${mockedDescription} | ${'Filled in description and added items'}
    `('$description', async ({ activity, name, items, activityDescription }) => {
      renderActivities({ ...mockedAppletFormData, activities: [activity] });

      await waitFor(() => {
        expect(screen.getByTestId(`${mockedTestid}-0-name`)).toHaveTextContent(name);
        expect(screen.getByTestId(`${mockedTestid}-0-description`)).toHaveTextContent(
          activityDescription,
        );
        expect(screen.getByTestId(`${mockedTestid}-0-items-count`)).toHaveTextContent(items);
      });
    });
  });

  describe('Activity Actions', () => {
    test('Add', async () => {
      const ref = renderActivities(mockedAppletWithNoActivities);

      const addActivity = screen.getByTestId('builder-activities-add-activity');
      fireEvent.click(addActivity);

      expect(mockedUseNavigate).toBeCalledWith(
        `/builder/${mockedAppletFormData.id}/activities/${ref.current.getValues(
          'activities.0.key',
        )}/about`,
      );

      await waitFor(() => {
        expect(screen.getByTestId(`${mockedTestid}-0`)).toBeVisible();
      });

      const addedActivity = ref.current.getValues('activities.0');

      expect(ref.current.getValues('activities.0')).toStrictEqual({
        ...mockedEmptyActivity,
        key: addedActivity.key,
      });
    });

    test('Remove', async () => {
      const ref = renderActivities({ ...mockedAppletFormData, activities: [mockedEmptyActivity] });

      await waitFor(() => {
        expect(screen.getByTestId(`${mockedTestid}-0`)).toBeVisible();
      });

      fireEvent.click(screen.getByTestId(`${mockedTestid}-0-remove`));

      const confirmRemoveModal = screen.getByTestId('builder-activities-delete-activity-popup-0');
      expect(confirmRemoveModal).toBeVisible();

      fireEvent.click(
        screen.getByTestId('builder-activities-delete-activity-popup-0-submit-button'),
      );

      expect(ref.current.getValues('activities')).toEqual([]);
      expect(screen.queryAllByTestId(/^builder-activities-activity-\d+$/)).toEqual([]);
    });

    test('Edit', async () => {
      renderActivities({ ...mockedAppletFormData, activities: [mockedEmptyActivity] });

      await waitFor(() => {
        expect(screen.getByTestId(`${mockedTestid}-0`)).toBeVisible();
      });

      fireEvent.click(screen.getByTestId(`${mockedTestid}-0-edit`));

      expect(mockedUseNavigate).toBeCalledWith(
        `/builder/${mockedAppletFormData.id}/activities/${mockedEmptyActivity.key}/about`,
      );
    });

    test('Duplicate', async () => {
      const ref = renderActivities({
        ...mockedAppletFormData,
        activities: [mockedActivityWithDescription],
      });

      await waitFor(() => {
        expect(screen.getByTestId(`${mockedTestid}-0`)).toBeVisible();
      });

      fireEvent.click(screen.getByTestId(`${mockedTestid}-0-duplicate`));

      await waitFor(() => {
        expect(screen.getByTestId(`${mockedTestid}-1`)).toBeVisible();
      });

      expect(screen.getByTestId(`${mockedTestid}-1-name`)).toHaveTextContent(
        `${mockedEmptyActivity.name} (1)`,
      );
      expect(screen.getByTestId(`${mockedTestid}-1-description`)).toHaveTextContent(
        mockedActivityWithDescription.description,
      );
      expect(screen.getByTestId(`${mockedTestid}-1-items-count`)).toHaveTextContent(
        `${mockedActivityWithDescription.items.length} items`,
      );

      const duplicatedActivity = ref.current.getValues('activities.1');

      /* eslint no-underscore-dangle: 0 */
      expect(duplicatedActivity).toStrictEqual({
        ...ref.current.getValues('activities.0'),
        key: duplicatedActivity.key,
        name: `${mockedActivityWithDescription.name} (1)`,
        _id: duplicatedActivity._id,
      });
    });

    test('Hide', async () => {
      const ref = renderActivities({ ...mockedAppletFormData, activities: [mockedEmptyActivity] });

      await waitFor(() => {
        expect(screen.getByTestId(`${mockedTestid}-0`)).toBeVisible();
      });

      fireEvent.click(screen.getByTestId(`${mockedTestid}-0-hide`));

      expect(screen.getByTestId(`${mockedTestid}-0`)).toBeVisible();

      const hideButton = screen.getByTestId(`${mockedTestid}-0-hide`);
      expect(hideButton).toBeVisible();
      expect(hideButton.querySelector('svg')).toHaveClass('svg-visibility-off');
      expect(ref.current.getValues('activities.0.isHidden')).toEqual(true);
    });

    test('Copy', async () => {
      const copyPopup = 'builder-activities-copy-activity-popup';
      vi.mocked(axios.get).mockResolvedValueOnce({
        data: {
          result: [
            { id: 'target-id', displayName: 'Target', image: '', role: 'editor', type: 'applet' },
          ],
          count: 1,
        },
      });
      vi.mocked(axios.get).mockResolvedValueOnce({ data: { result: { 'target-id': ['editor'] } } });
      vi.mocked(axios.post).mockResolvedValueOnce({
        data: {
          result: {
            displayName: 'Target',
            activities: [{ name: 'A' }, { name: 'New Activity (1)' }],
          },
        },
      });
      const addBannerSpy = vi.spyOn(banners.actions, 'addBanner');
      renderActivities(
        { ...mockedAppletFormData, activities: [{ ...mockedEmptyActivity, id: 'activity-id' }] },
        { workspaces: { currentWorkspace: { data: { ownerId: 'owner-id' } } } },
      );

      await waitFor(() => {
        expect(screen.getByTestId(`${mockedTestid}-0`)).toBeVisible();
      });

      fireEvent.click(screen.getByTestId(`${mockedTestid}-0-copy`));
      await waitFor(() => expect(screen.getByText('Target')).toBeVisible());
      fireEvent.click(screen.getByTestId(`${copyPopup}-radio-0`).querySelector('input'));
      fireEvent.click(screen.getByTestId(`${copyPopup}-submit-button`));

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          `/applets/${mockedAppletFormData.id}/activities/activity-id/copy`,
          { targetAppletId: 'target-id' },
          expect.anything(),
        );
      });

      // The banner uses the copied activity's name from the response
      await waitFor(() => expect(addBannerSpy).toHaveBeenCalled());
      const { children } = addBannerSpy.mock.calls[0][0].bannerProps;
      expect(children.props.values).toEqual({
        activityName: 'New Activity (1)',
        appletName: 'Target',
      });
    });

    test('Copy with unsaved changes saves first', async () => {
      const savePopup = 'builder-activities-save-before-copy-popup';
      const save = vi.fn().mockResolvedValue({ activities: [{ id: 'saved-id', name: 'Saved' }] });
      vi.mocked(axios.get).mockResolvedValueOnce({ data: { result: [], count: 0 } });
      vi.mocked(axios.get).mockResolvedValueOnce({ data: { result: {} } });
      renderWithAppletFormData({
        children: (
          <BuilderSaveContext.Provider value={{ current: { hasFormChanges: true, save } }}>
            <Activities />
          </BuilderSaveContext.Provider>
        ),
        appletFormData: { ...mockedAppletFormData, activities: [mockedEmptyActivity] },
        options: {
          routePath: page.builderAppletActivities,
          route: generatePath(page.builderAppletActivities, { appletId: mockedAppletFormData.id }),
        },
      });

      await waitFor(() => expect(screen.getByTestId(`${mockedTestid}-0`)).toBeVisible());
      fireEvent.click(screen.getByTestId(`${mockedTestid}-0-copy`));
      fireEvent.click(screen.getByTestId(`${savePopup}-submit-button`));

      expect(save).toHaveBeenCalled();
      await waitFor(() =>
        expect(screen.getByTestId('builder-activities-copy-activity-popup')).toBeVisible(),
      );
    });

    test('Copy action is disabled on a new applet', async () => {
      renderWithAppletFormData({
        children: <Activities />,
        appletFormData: { ...mockedAppletFormData, activities: [mockedEmptyActivity] },
        options: {
          routePath: page.builderAppletActivities,
          route: generatePath(page.builderAppletActivities, { appletId: 'new-applet' }),
        },
      });

      await waitFor(() => expect(screen.getByTestId(`${mockedTestid}-0`)).toBeVisible());
      expect(screen.getByTestId(`${mockedTestid}-0-copy`)).toBeDisabled();
    });
  });

  describe('Add Performance Tasks', () => {
    test('Dropdown With Performance Tasks List', () => {
      renderActivities(mockedAppletWithNoActivities);

      fireEvent.click(screen.getByTestId('builder-activities-add-perf-task'));

      [
        mockedIPadTestid,
        mockedMobileTestid,
        mockedFlankerTestid,
        mockedGyroscopeTestid,
        mockedTouchTestid,
      ].forEach((testId) => {
        expect(screen.getByTestId(testId)).toBeVisible();
      });
    });

    test.each`
      perfTaskType                       | shouldNavigate | name                                            | perfTaskDescription                                                                                                   | items        | description
      ${PerformanceTasks.AbTrailsIpad}   | ${false}       | ${'A/B Trails iPad'}                            | ${'A/B Trails'}                                                                                                       | ${'4 items'} | ${'A/B Trails iPad'}
      ${PerformanceTasks.AbTrailsMobile} | ${false}       | ${'A/B Trails Mobile'}                          | ${'A/B Trails'}                                                                                                       | ${'4 items'} | ${'A/B Trails Mobile'}
      ${PerformanceTasks.Flanker}        | ${true}        | ${'Simple & Choice Reaction Time Task Builder'} | ${'This Activity contains Flanker Item. The timestamps collected for an android are not as accurate as iOS devices.'} | ${'9 items'} | ${'Flanker'}
      ${PerformanceTasks.Gyroscope}      | ${true}        | ${'CST Gyroscope'}                              | ${'This Activity contains Stability Tracker (Gyroscope) Item.'}                                                       | ${'5 items'} | ${'CST Gyroscope'}
      ${PerformanceTasks.Touch}          | ${true}        | ${'CST Touch'}                                  | ${'This Activity contains Stability Tracker (Touch) Item.'}                                                           | ${'5 items'} | ${'CST Touch'}
    `(
      '$description',
      async ({ perfTaskType, shouldNavigate, name, perfTaskDescription, items }) => {
        const ref = renderActivities(mockedAppletWithNoActivities);

        addPerfTask(perfTaskType);

        await waitFor(() => {
          expect(screen.getByTestId(`${mockedTestid}-0`)).toBeVisible();
        });

        expect(screen.getByTestId(`${mockedTestid}-0-name`)).toHaveTextContent(name);
        expect(screen.getByTestId(`${mockedTestid}-0-description`)).toHaveTextContent(
          perfTaskDescription,
        );
        expect(screen.getByTestId(`${mockedTestid}-0-items-count`)).toHaveTextContent(items);

        if (shouldNavigate) {
          expect(mockedUseNavigate).toBeCalledWith(
            `/builder/${
              mockedAppletFormData.id
            }/activities/performance-task/${perfTaskType}/${ref.current.getValues(
              'activities.0.key',
            )}`,
          );
        }

        if (!shouldNavigate) {
          expect(screen.queryByTestId(`${mockedTestid}-0-edit`)).not.toBeInTheDocument();
        }
      },
    );
  });
});
