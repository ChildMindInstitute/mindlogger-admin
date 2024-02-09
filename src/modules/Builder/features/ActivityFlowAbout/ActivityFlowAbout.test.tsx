// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { createRef } from 'react';

import { screen, fireEvent, waitFor } from '@testing-library/react';
import { generatePath } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { getNewActivityFlow } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.utils';
import { page } from 'resources';
import { mockedAppletFormData } from 'shared/mock';
import { getEntityKey, renderWithAppletFormData } from 'shared/utils';

import { ActivityFlowAbout } from './ActivityFlowAbout';

const mockedFlowsTestid = 'builder-activity-flows-about';

const mockedAppletFormDataWithEmptyFlow = {
  ...mockedAppletFormData,
  activityFlows: [
    {
      ...getNewActivityFlow(),
      items: mockedAppletFormData.activities.map((activity) => ({
        key: uuidv4(),
        activityKey: getEntityKey(activity),
      })),
    },
  ],
};
const mockedAppletFormDataWithTwoFlows = {
  ...mockedAppletFormData,
  activityFlows: [
    mockedAppletFormData.activityFlows[0],
    {
      ...mockedAppletFormData.activityFlows[0],
      id: uuidv4(),
      name: 'second flow',
    },
  ],
};
const renderActivityFlowAbout = (formData = mockedAppletFormData) => {
  const ref = createRef();

  renderWithAppletFormData({
    children: <ActivityFlowAbout />,
    formRef: ref,
    appletFormData: formData,
    options: {
      routePath: page.builderAppletActivityFlowItemAbout,
      route: generatePath(page.builderAppletActivityFlowItemAbout, {
        appletId: formData.id,
        activityFlowId: getEntityKey(formData.activityFlows[0]),
      }),
    },
  });

  return ref;
};
const renderNewActivityFlowAbout = () => renderActivityFlowAbout(mockedAppletFormDataWithEmptyFlow);
const renderActivityFlowAboutWithTwoFlows = () => renderActivityFlowAbout(mockedAppletFormDataWithTwoFlows);

describe('ActivityFlowAbout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test.each`
    testId                                  | hasLabel | label                                   | tooltip                                                           | description
    ${`${mockedFlowsTestid}-name`}          | ${true}  | ${'Activity Flow Name'}                 | ${''}                                                             | ${'New Activity Flow: Name'}
    ${`${mockedFlowsTestid}-description`}   | ${true}  | ${'Activity Flow Description'}          | ${''}                                                             | ${'New Activity Flow: Description'}
    ${`${mockedFlowsTestid}-single-report`} | ${false} | ${'Combine reports into a single file'} | ${''}                                                             | ${'New Activity Flow: Combine Reports'}
    ${`${mockedFlowsTestid}-hide-badge`}    | ${false} | ${'Hide badge'}                         | ${'The Activity Flow identifier will be hidden from Respondents'} | ${'New Activity Flow: Hide Badge'}
  `('$description', async ({ testId, hasLabel, label, tooltip }) => {
    renderNewActivityFlowAbout();

    const field = screen.getByTestId(testId);

    expect(field).toBeVisible();

    const fieldLabel = hasLabel ? field.querySelector('label') : field;
    expect(fieldLabel).toHaveTextContent(label);

    if (tooltip) {
      expect(field.querySelector('span[aria-label]')).toHaveAttribute('aria-label', tooltip);
    }
  });

  test.each`
    testId                                  | attribute           | value    | description
    ${`${mockedFlowsTestid}-name`}          | ${'name'}           | ${'af1'} | ${'Existing Activity Flow: Name'}
    ${`${mockedFlowsTestid}-description`}   | ${'description'}    | ${'afd'} | ${'Existing Activity Flow: Description'}
    ${`${mockedFlowsTestid}-single-report`} | ${'isSingleReport'} | ${false} | ${'Existing Activity Flow: Combine Reports'}
    ${`${mockedFlowsTestid}-hide-badge`}    | ${'hideBadge'}      | ${false} | ${'Existing Activity Flow: Hide Badge'}
  `('$description', ({ testId, attribute, value }) => {
    const ref = renderActivityFlowAbout();

    const field = screen.getByTestId(testId);

    expect(field).toBeVisible();

    expect(ref.current.getValues(`activityFlows.0.${attribute}`)).toEqual(value);
  });

  test.each`
    testId                                  | attribute           | inputType     | value                          | description
    ${`${mockedFlowsTestid}-name`}          | ${'name'}           | ${'input'}    | ${'Activity Flow Name'}        | ${'Change Activity Flow: Name'}
    ${`${mockedFlowsTestid}-description`}   | ${'description'}    | ${'textarea'} | ${'Activity Flow Description'} | ${'Change Activity Flow: Description'}
    ${`${mockedFlowsTestid}-single-report`} | ${'isSingleReport'} | ${''}         | ${true}                        | ${'Change Activity Flow: Combine Reports'}
    ${`${mockedFlowsTestid}-hide-badge`}    | ${'hideBadge'}      | ${''}         | ${true}                        | ${'Change Activity Flow: Hide Badge'}
  `('$description', ({ testId, attribute, inputType, value }) => {
    const ref = renderActivityFlowAbout();

    const field = screen.getByTestId(testId);

    inputType ? fireEvent.change(field.querySelector(inputType), { target: { value } }) : fireEvent.click(field);

    expect(ref.current.getValues(`activityFlows.0.${attribute}`)).toEqual(value);
  });

  test.each`
    testId                                | inputType     | value | error                                      | description
    ${`${mockedFlowsTestid}-name`}        | ${'input'}    | ${''} | ${'Activity Flow Name is required'}        | ${'Validations: Name is required'}
    ${`${mockedFlowsTestid}-description`} | ${'textarea'} | ${''} | ${'Activity Flow Description is required'} | ${'Validations: Description is required'}
  `('$description', async ({ testId, inputType, value, error }) => {
    const ref = renderNewActivityFlowAbout();

    const field = screen.getByTestId(testId);
    fireEvent.change(field.querySelector(inputType), { target: { value } });

    await ref.current.trigger('activityFlows');

    await waitFor(() => {
      expect(screen.getByText(error)).toBeVisible();
    });
  });

  test('Validations: activity flow with existing name', async () => {
    const ref = renderActivityFlowAboutWithTwoFlows();

    fireEvent.change(screen.getByTestId(`${mockedFlowsTestid}-name`).querySelector('input'), {
      target: { value: 'second flow' },
    });

    await ref.current.trigger('activityFlows');

    await waitFor(() => {
      expect(screen.getByText('That Activity Flow Name is already in use. Please use a different name')).toBeVisible();
    });
  });
});
