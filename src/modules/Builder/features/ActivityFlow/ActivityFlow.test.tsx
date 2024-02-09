// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { createRef } from 'react';

import { fireEvent, screen, waitFor } from '@testing-library/react';
import { generatePath } from 'react-router-dom';

import { page } from 'resources';
import { mockedAppletFormData } from 'shared/mock';
import { renderWithAppletFormData } from 'shared/utils';

import { ActivityFlow } from './ActivityFlow';

const mockedFlowTestid = 'builder-activity-flows-flow';

const mockedAppletFormDataWithNoFlows = {
  ...mockedAppletFormData,
  activityFlows: [],
};

const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

const renderActivityFlow = (formData) => {
  const ref = createRef();

  renderWithAppletFormData({
    children: <ActivityFlow />,
    formRef: ref,
    appletFormData: formData,
    options: {
      routePath: page.builderAppletActivityFlow,
      route: generatePath(page.builderAppletActivityFlow, { appletId: mockedAppletFormData.id }),
    },
  });

  return ref;
};

describe('ActivityFlow', () => {
  test('Empty page', () => {
    renderActivityFlow(mockedAppletFormDataWithNoFlows);

    expect(screen.getByText('Create an Activity Flow to order the sequence of Activities.')).toBeVisible();
    expect(screen.getByTestId('builder-activity-flows-add')).toBeVisible();
  });

  test('Add activity flow', async () => {
    const ref = renderActivityFlow(mockedAppletFormDataWithNoFlows);

    fireEvent.click(screen.getByTestId('builder-activity-flows-add'));

    expect(mockedUseNavigate).toBeCalledWith(
      `/builder/${mockedAppletFormData.id}/activity-flows/${ref.current.getValues('activityFlows.0.key')}`,
    );

    const activityFlowData = ref.current.getValues('activityFlows.0');

    expect(ref.current.getValues('activityFlows.0')).toStrictEqual({
      key: activityFlowData.key,
      name: '',
      description: '',
      isSingleReport: false,
      hideBadge: false,
      isHidden: false,
      items: activityFlowData.items,
    });

    await waitFor(() => {
      expect(screen.getByTestId(`${mockedFlowTestid}-0`)).toBeVisible();
      expect(screen.getByTestId(`${mockedFlowTestid}-0-dots`)).toBeVisible();
    });

    fireEvent.mouseEnter(screen.getByTestId(`${mockedFlowTestid}-0`).querySelector('div'));

    [
      `${mockedFlowTestid}-0-edit`,
      `${mockedFlowTestid}-0-duplicate`,
      `${mockedFlowTestid}-0-hide`,
      `${mockedFlowTestid}-0-remove`,
      `${mockedFlowTestid}-0-dnd`,
    ].forEach((testId) => {
      expect(screen.getByTestId(testId)).toBeVisible();
    });
  });

  test('Remove activity flow', async () => {
    const ref = renderActivityFlow();

    expect(ref.current.getValues('activityFlows')).toHaveLength(1);

    await waitFor(() => {
      screen.getByTestId(`${mockedFlowTestid}-0`);
    });

    fireEvent.click(screen.getByTestId(`${mockedFlowTestid}-0-remove`));

    expect(screen.getByTestId('builder-activity-flows-remove-popup')).toBeVisible();
    fireEvent.click(screen.getByTestId('builder-activity-flows-remove-popup-submit-button'));

    expect(screen.queryByTestId(`${mockedFlowTestid}-0`)).not.toBeInTheDocument();
    expect(ref.current.getValues('activityFlows')).toEqual([]);
  });

  test('Edit activity flow', async () => {
    renderActivityFlow();

    await waitFor(() => {
      screen.getByTestId(`${mockedFlowTestid}-0`);
    });

    fireEvent.click(screen.getByTestId(`${mockedFlowTestid}-0-edit`));

    expect(mockedUseNavigate).toBeCalledWith(
      `/builder/${mockedAppletFormData.id}/activity-flows/${mockedAppletFormData.activityFlows[0].id}`,
    );
  });

  test('Duplicate activity flow', async () => {
    const ref = renderActivityFlow();

    await waitFor(() => {
      screen.getByTestId(`${mockedFlowTestid}-0`);
    });

    fireEvent.click(screen.getByTestId(`${mockedFlowTestid}-0-duplicate`));

    const activityFlowData = ref.current.getValues('activityFlows.0');
    const duplicatedActivityFlowData = ref.current.getValues('activityFlows.1');
    /* eslint no-underscore-dangle: 0 */
    expect(ref.current.getValues('activityFlows.1')).toStrictEqual({
      ...activityFlowData,
      id: undefined,
      _id: duplicatedActivityFlowData._id,
      key: duplicatedActivityFlowData.key,
      name: `${activityFlowData.name} (1)`,
      items: activityFlowData.items.map((item, index) => ({
        ...item,
        id: undefined,
        key: duplicatedActivityFlowData.items[index].key,
      })),
    });
  });

  test('Hide activity flow', async () => {
    const ref = renderActivityFlow();

    expect(ref.current.getValues('activityFlows.0.isHidden')).toEqual(false);

    await waitFor(() => {
      screen.getByTestId(`${mockedFlowTestid}-0`);
    });

    fireEvent.click(screen.getByTestId(`${mockedFlowTestid}-0-hide`));

    expect(ref.current.getValues('activityFlows.0.isHidden')).toEqual(true);
    expect(screen.getByTestId(`${mockedFlowTestid}-0-hide`)).toBeVisible();
  });
});
