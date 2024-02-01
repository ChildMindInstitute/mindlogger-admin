// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { FormProvider, useForm } from 'react-hook-form';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils';
import { mockedAppletId } from 'shared/mock';
import { page } from 'resources';
import * as reduxHooks from 'redux/store/hooks';
import { library } from 'redux/modules';

import { Activity } from './Activity';
import { AppletUiType, LibraryForm } from '../Applet.types';

const dataTestid = 'library-applet-activity';
const mockDispatch = jest.fn();

const mockedNormalActivity = {
  name: 'New Activity 1',
  items: [
    {
      question: { en: 'Lorem ipsum is placeholder text commonly used in the graphic...' },
      responseType: 'singleSelect',
      responseValues: {
        options: [
          { text: 'Yes', value: 0 },
          { text: 'No', value: 1 },
        ],
      },
      name: 'Item',
    },
  ],
  key: 'fa5f7c95-91b5-4da0-b4f9-c24deed2ac11',
};

const mockedPerformanceTask = {
  name: 'ABTrails',
  items: [
    {
      question: { en: 'ABTrails' },
      responseType: 'ABTrails',
    },
  ],
  key: 'fa5f7c95-91b5-4da0-b4f9-c24deed2ac11',
};

const FormComponent = ({ children }) => {
  const methods = useForm<LibraryForm>({
    defaultValues: { [mockedAppletId]: [] },
    mode: 'onChange',
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};

const renderComponent = ({ activity, search, uiType, route, routePath }) =>
  renderWithProviders(
    <FormComponent>
      <Activity
        appletId={mockedAppletId}
        activity={activity}
        search={search}
        uiType={uiType}
        data-testid={dataTestid}
      />
    </FormComponent>,
    {
      route,
      routePath,
    },
  );

jest.mock('../Item/Item.styles', () => ({
  ...jest.requireActual('../Item/Item.styles'),
  StyledMdPreview: ({ modelValue, 'data-testid': dataTestid }) => (
    <div data-testid={dataTestid}>{modelValue}</div>
  ),
}));

describe('Activity Component', () => {
  beforeEach(() => {
    jest.spyOn(reduxHooks, 'useAppDispatch').mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders normal activity', async () => {
    const setAddToBuilderBtnDisabledMock = jest.spyOn(
      library.actions,
      'setAddToBuilderBtnDisabled',
    );

    renderComponent({
      activity: mockedNormalActivity,
      search: '',
      uiType: AppletUiType.Cart,
      route: '/library/cart',
      routePath: page.libraryCart,
    });

    const activityCheckboxContainer = screen.getByTestId(`${dataTestid}-checkbox`);
    expect(activityCheckboxContainer).toBeInTheDocument();
    expect(screen.getByText('New Activity 1')).toBeInTheDocument();

    const activityCheckbox = activityCheckboxContainer.querySelector('input[type="checkbox"]');
    await userEvent.click(activityCheckbox);

    expect(activityCheckboxContainer).toHaveClass('Mui-checked');
    expect(setAddToBuilderBtnDisabledMock).toHaveBeenCalledWith(false);

    await userEvent.click(activityCheckbox);
    expect(activityCheckboxContainer).not.toHaveClass('Mui-checked');

    const activityHeader = screen.getByTestId(`${dataTestid}-header`);
    expect(activityHeader).toBeInTheDocument();

    const activityItemsRegex = new RegExp(`${dataTestid}-item-\\d+$`);
    expect(screen.queryAllByTestId(activityItemsRegex)).toHaveLength(0);

    await userEvent.click(activityHeader);

    expect(screen.queryAllByTestId(activityItemsRegex)).toHaveLength(1);
    expect(
      screen.getByText('Lorem ipsum is placeholder text commonly used in the graphic...'),
    ).toBeInTheDocument();
  });

  test('renders performance task', async () => {
    const setAddToBuilderBtnDisabledMock = jest.spyOn(
      library.actions,
      'setAddToBuilderBtnDisabled',
    );

    renderComponent({
      activity: mockedPerformanceTask,
      search: '',
      uiType: AppletUiType.Cart,
      route: '/library/cart',
      routePath: page.libraryCart,
    });

    const activityCheckboxContainer = screen.getByTestId(`${dataTestid}-checkbox`) as HTMLElement;
    expect(activityCheckboxContainer).toBeInTheDocument();
    expect(screen.getByText('ABTrails')).toBeInTheDocument();

    const activityCheckbox = activityCheckboxContainer.querySelector('input[type="checkbox"]');
    await userEvent.click(activityCheckbox);

    expect(setAddToBuilderBtnDisabledMock).toHaveBeenCalledWith(false);
  });
});
