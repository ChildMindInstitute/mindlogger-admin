// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { FormProvider, useForm } from 'react-hook-form';
import { screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils';
import { FeedbackForm } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/Feedback/Feedback.types';

import { ItemPicker } from './ItemPicker';
import { ItemPickerProps } from './ItemPicker.types';

const singleSelect = {
  activityItem: {
    question: {
      en: 'SS',
    },
    responseType: 'singleSelect',
  },
};

const multiSelect = {
  activityItem: {
    question: {
      en: 'MS',
    },
    responseType: 'multiSelect',
  },
};

const slider = {
  activityItem: {
    question: {
      en: 'Slider',
    },
    responseType: 'slider',
  },
};

const text = {
  activityItem: {
    question: {
      en: 'Text',
    },
    responseType: 'text',
  },
};

jest.mock(
  'modules/Dashboard/features/RespondentData/RespondentDataReview/Feedback/AssessmentControllers',
  () => ({
    __esModule: true,
    ...jest.requireActual(
      'modules/Dashboard/features/RespondentData/RespondentDataReview/Feedback/AssessmentControllers',
    ),
    SingleSelectionController: () => <div data-testid="mock-single-selection-controller"></div>,
    MultipleSelectionController: () => <div data-testid="mock-multi-selection-controller"></div>,
    SliderController: () => <div data-testid="mock-slider-controller"></div>,
  }),
);

const FormComponent = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm<FeedbackForm>({
    defaultValues: {
      newNote: '',
      assessmentItems: [
        {
          edited: null,
          itemId: '8bde2601-28ae-4cdd-ac53-016134de847a',
          answers: null,
        },
        {
          edited: null,
          itemId: '447e050e-7576-4e64-a39a-82e874477745',
          answers: [],
        },
        {
          edited: null,
          itemId: 'a99ffccb-c6d2-44bf-b924-ea8e1a78ba50',
          answers: null,
        },
      ],
    },
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};

const getItemPicker = (itemPickerProps: ItemPickerProps) => (
  <FormComponent>
    <ItemPicker {...itemPickerProps} />
  </FormComponent>
);

describe('ItemPicker', () => {
  test('render single select', async () => {
    renderWithProviders(
      getItemPicker({
        activityItem: singleSelect,
        isDisabled: false,
      }),
    );

    const singleSelectController = await screen.findByTestId('mock-single-selection-controller');
    expect(singleSelectController).toBeInTheDocument();
  });

  test('render multi select', async () => {
    renderWithProviders(
      getItemPicker({
        activityItem: multiSelect,
        isDisabled: false,
      }),
    );

    const multiSelectController = await screen.findByTestId('mock-multi-selection-controller');
    expect(multiSelectController).toBeInTheDocument();
  });

  test('render slider', async () => {
    renderWithProviders(
      getItemPicker({
        activityItem: slider,
        isDisabled: false,
      }),
    );

    const sliderController = await screen.findByTestId('mock-slider-controller');
    expect(sliderController).toBeInTheDocument();
  });

  test('render text', () => {
    renderWithProviders(
      getItemPicker({
        activityItem: text,
        isDisabled: false,
      }),
    );

    const element = screen.queryByTestId(/.*/);
    expect(element).not.toBeInTheDocument();
  });
});
