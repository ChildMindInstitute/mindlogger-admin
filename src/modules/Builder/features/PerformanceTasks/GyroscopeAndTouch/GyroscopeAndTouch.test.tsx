// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { createRef } from 'react';
import { generatePath } from 'react-router-dom';
import { screen, fireEvent, waitFor } from '@testing-library/react';

import { page } from 'resources';
import { renderWithAppletFormData } from 'shared/utils';
import { GyroscopeOrTouch, PerfTaskType } from 'shared/consts';
import { mockedAppletFormData } from 'shared/mock';

import { GyroscopeAndTouch } from './GyroscopeAndTouch';

const mockedTestid = 'builder-activity-gyroscope-and-touch';

const mockedNewlyAddedGyroscope = {
  name: 'CST Gyroscope',
  description: 'This Activity contains Stability Tracker (Gyroscope) Item.',
  isHidden: false,
  items: [
    {
      name: 'Gyroscope_General_instruction',
      config: {
        removeBackButton: true,
        timer: null,
      },
      question:
        'In this task, you will see a disc that will drift either to the left or right side of the screen.\nYour job will be to keep the disc in the middle of the screen.\nIf the disc is moving to the right, tilt your phone to the left to bring it back to the center.\nIf the disc is moving to the left, tilt your phone to the right to bring the disc back to center.\nDo not let the disc touch the walls to the far left or right of the screen.\nThere will be two phases to this task, a Challenge Phase, and a Focus Phase.',
      responseType: 'message',
      order: 1,
    },
    {
      name: 'Gyroscope_Calibration_Practice_instruction',
      config: {
        removeBackButton: true,
        timer: null,
      },
      question:
        'This is the Challenge Phase.\nThere will be 3 trials.\nEach trial will begin at an easy level, but it will become more difficult to keep the disc at the center of the screen.\nEventually, you will lose control of the disc.\nWhen it hits a wall at the edge of the screen, the trial ends and the disc will be moved back to the center of the screen.\nTry to keep the disc away from the walls for as long as possible on each trial.',
      responseType: 'message',
      order: 2,
    },
    {
      name: 'Gyroscope_Calibration_Practice',
      config: {
        trialsNumber: 3,
        durationMinutes: 5,
        lambdaSlope: 20,
        userInputType: 'gyroscope',
        phase: 'practice',
      },
      responseType: 'stabilityTracker',
      order: 3,
    },
    {
      name: 'Gyroscope_Test_instruction',
      config: {
        removeBackButton: true,
        timer: null,
      },
      question:
        'This is the Focus Phase.\nThis phase will last 5 minutes.\nThe trial will begin at an easy level, and will increase to a level that should not be very difficult.\nYour task will be to focus on keeping the disc in the center of the screen, without letting it drift off center.\nIf you lose control of the disc and it hits a wall, the disc will be moved back to the center of the screen and the task will continue.',
      responseType: 'message',
      order: 4,
    },
    {
      name: 'Gyroscope_Test',
      config: {
        trialsNumber: 3,
        durationMinutes: 5,
        lambdaSlope: 20,
        userInputType: 'gyroscope',
        phase: 'test',
      },
      responseType: 'stabilityTracker',
      order: 5,
    },
  ],
  isPerformanceTask: true,
  performanceTaskType: 'gyroscope',
  id: 'cd64a3f0-64a2-45eb-8532-de2842797eb2',
};
const mockedNewlyAddedTouch = {
  name: 'CST Touch',
  description: 'This Activity contains Stability Tracker (Touch) Item.',
  isHidden: false,
  items: [
    {
      name: 'Touch_General_instruction',
      config: {
        removeBackButton: true,
        timer: null,
      },
      question:
        'In this task, you will see a disc that will drift either to the left or right side of the screen.\nYour job will be to keep the disc in the middle of the screen.\nIf the disc is moving to the right, swipe left of control bar to bring it back to the center.\nIf the disc is moving to the left, swipe right of control bar to bring the disc back to center.\nDo not let the disc touch the walls to the far left or right of the screen.\nThere will be two phases to this task, a Challenge Phase, and a Focus Phase.',
      responseType: 'message',
      order: 1,
    },
    {
      name: 'Touch_Calibration_Practice_instruction',
      config: {
        removeBackButton: true,
        timer: null,
      },
      question:
        'This is the Challenge Phase.\nThere will be 3 trials.\nEach trial will begin at an easy level, but it will become more difficult to keep the disc at the center of the screen.\nEventually, you will lose control of the disc.\nWhen it hits a wall at the edge of the screen, the trial ends and the disc will be moved back to the center of the screen.\nTry to keep the disc away from the walls for as long as possible on each trial.',
      responseType: 'message',
      order: 2,
    },
    {
      name: 'Touch_Calibration_Practice',
      config: {
        trialsNumber: 3,
        durationMinutes: 5,
        lambdaSlope: 20,
        userInputType: 'touch',
        phase: 'practice',
      },
      responseType: 'stabilityTracker',
      order: 3,
    },
    {
      name: 'Touch_Test_instruction',
      config: {
        removeBackButton: true,
        timer: null,
      },
      question:
        'This is the Focus Phase.\nThis phase will last 5 minutes.\nThe trial will begin at an easy level, and will increase to a level that should not be very difficult.\nYour task will be to focus on keeping the disc in the center of the screen, without letting it drift off center.\nIf you lose control of the disc and it hits a wall, the disc will be moved back to the center of the screen and the task will continue.',
      responseType: 'message',
      order: 4,
    },
    {
      name: 'Touch_Test',
      config: {
        trialsNumber: 3,
        durationMinutes: 5,
        lambdaSlope: 20,
        userInputType: 'touch',
        phase: 'test',
      },
      responseType: 'stabilityTracker',
      order: 5,
    },
  ],
  isPerformanceTask: true,
  performanceTaskType: 'touch',
  id: '3f6cb5e7-9981-42c0-b56b-7343af24d3e0',
};

const mockedAppletFormDataWithGyroscope = {
  ...mockedAppletFormData,
  activities: [mockedNewlyAddedGyroscope],
};
const mockedAppletFormDataWithTouch = {
  ...mockedAppletFormData,
  activities: [mockedNewlyAddedTouch],
};

const expandAllPanels = () => {
  const collapseButtons = document.querySelectorAll('.svg-navigate-down');

  collapseButtons.forEach(button => {
    fireEvent.click(button);
  });
};

const renderGyroscopeOrTouch = isGyroscope => {
  const ref = createRef();
  const formData = isGyroscope ? mockedAppletFormDataWithGyroscope : mockedAppletFormDataWithTouch;
  const routePath = isGyroscope ? page.builderAppletGyroscope : page.builderAppletTouch;

  renderWithAppletFormData({
    formRef: ref,
    children: <GyroscopeAndTouch type={isGyroscope ? GyroscopeOrTouch.Gyroscope : GyroscopeOrTouch.Touch} />,
    appletFormData: formData,
    options: {
      routePath,
      route: generatePath(routePath, {
        appletId: formData.id,
        activityId: formData.activities[0].id,
      }),
    },
  });

  return ref;
};

describe('GyroscopeAndTouch', () => {
  describe.each`
    type                      | description
    ${PerfTaskType.Gyroscope} | ${'Gyroscope'}
    ${PerfTaskType.Touch}     | ${'Touch'}
  `('$description', ({ type }) => {
    const isGyroscope = type === PerfTaskType.Gyroscope;

    test('Panels: are rendered correctly', () => {
      renderGyroscopeOrTouch(isGyroscope);

      expect(screen.getByTestId('builder-activity-flanker-common')).toBeVisible();
      expect(screen.getByTestId(mockedTestid)).toBeVisible();
      expect(screen.getByTestId(`${mockedTestid}-overview-instruction`));
      expect(screen.getByTestId(`${mockedTestid}-practice-round-instruction`));
      expect(screen.getByTestId(`${mockedTestid}-test-round-instruction`));
    });

    test('Default Data: is set correctly', () => {
      renderGyroscopeOrTouch(isGyroscope);
      expandAllPanels();

      expect(screen.getByTestId('builder-activity-flanker-name').querySelector('input')).toHaveValue(
        isGyroscope ? 'CST Gyroscope' : 'CST Touch',
      );
      expect(screen.getByTestId('builder-activity-flanker-description').querySelector('textarea')).toHaveTextContent(
        `This Activity contains Stability Tracker (${isGyroscope ? 'Gyroscope' : 'Touch'}) Item.`,
      );

      expect(screen.getByTestId(`${mockedTestid}-number-of-trials`).querySelector('input')).toHaveValue(2);
      expect(screen.getByTestId(`${mockedTestid}-length-of-test`).querySelector('input')).toHaveValue(4);
      expect(screen.getByTestId(`${mockedTestid}-lambda-scope`).querySelector('input')).toHaveValue(19);

      expect(
        screen.getByTestId(`${mockedTestid}-overview-instruction-instruction`).querySelector('textarea'),
      ).toHaveTextContent(
        (isGyroscope ? mockedNewlyAddedGyroscope : mockedNewlyAddedTouch).items[0].question?.replaceAll('\n', ' '),
      );

      expect(
        screen.getByTestId(`${mockedTestid}-practice-round-instruction-instruction`).querySelector('textarea'),
      ).toHaveTextContent(
        (isGyroscope ? mockedNewlyAddedGyroscope : mockedNewlyAddedTouch).items[1].question?.replaceAll('\n', ' '),
      );

      expect(
        screen.getByTestId(`${mockedTestid}-test-round-instruction-instruction`).querySelector('textarea'),
      ).toHaveTextContent(
        (isGyroscope ? mockedNewlyAddedGyroscope : mockedNewlyAddedTouch).items[3].question?.replaceAll('\n', ' '),
      );
    });

    test.each`
      testId                                                      | inputType     | error                                       | description
      ${'builder-activity-flanker-name'}                          | ${'input'}    | ${'Activity Name is required'}              | ${'Validation: Activity Name is required'}
      ${`${mockedTestid}-overview-instruction-instruction`}       | ${'textarea'} | ${'Overview Instruction is required'}       | ${'Validation: Overview Instruction is required'}
      ${`${mockedTestid}-practice-round-instruction-instruction`} | ${'textarea'} | ${'Practice Round Instruction is required'} | ${'Validation: Practice Round Instruction is required'}
      ${`${mockedTestid}-test-round-instruction-instruction`}     | ${'textarea'} | ${'Test Round Instruction is required'}     | ${'Validation: Test Round Instruction is required'}
    `('$description', async ({ testId, inputType, error }) => {
      const ref = renderGyroscopeOrTouch(isGyroscope);
      expandAllPanels();

      const input = screen.getByTestId(testId).querySelector(inputType);
      fireEvent.change(input, { target: { value: '' } });

      await ref.current.trigger('activities.0');

      await waitFor(() => {
        expect(screen.getByText(error)).toBeVisible();
      });
    });
  });
});
