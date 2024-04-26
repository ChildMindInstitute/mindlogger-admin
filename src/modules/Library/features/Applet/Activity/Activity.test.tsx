// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { FormProvider, useForm } from 'react-hook-form';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
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
      question: { en: 'Single Select' },
      responseType: 'singleSelect',
      responseValues: {
        options: [
          { text: 'Yes', value: 0 },
          { text: 'No', value: 1 },
        ],
      },
      name: 'Item1',
    },
    {
      question: { en: 'Multi Select' },
      responseType: 'multiSelection',
      responseValues: {
        options: [
          { text: 'option 1', value: 0 },
          { text: 'option 2', value: 1 },
        ],
      },
      name: 'Item2',
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

    const activityItemsRegex = new RegExp(`${dataTestid}-item-\\d+$`);
    expect(screen.queryAllByTestId(activityItemsRegex)).toHaveLength(0);

    const activityHeader = screen.getByTestId(`${dataTestid}-header`);
    expect(activityHeader).toBeInTheDocument();

    await userEvent.click(activityHeader);

    const items = screen.queryAllByTestId(activityItemsRegex);
    expect(items).toHaveLength(2);

    items.forEach((item, index) => {
      const textContent = item.textContent;
      expect(textContent).toEqual(mockedNormalActivity.items[index].question.en);

      const activityItemCheckboxRegex = new RegExp(`${dataTestid}-item-\\d+-checkbox$`);
      const itemCheckboxContainer = within(item).getByTestId(activityItemCheckboxRegex);
      expect(itemCheckboxContainer).toBeInTheDocument();
      expect(itemCheckboxContainer).not.toHaveClass('Mui-checked');
    });

    const activityCheckbox = activityCheckboxContainer.querySelector('input[type="checkbox"]');
    await userEvent.click(activityCheckbox); // select activity

    expect(activityCheckboxContainer).toHaveClass('Mui-checked');
    expect(setAddToBuilderBtnDisabledMock).toHaveBeenCalledWith(false);

    items.forEach((item) => {
      const activityItemCheckboxRegex = new RegExp(`${dataTestid}-item-\\d+-checkbox$`);
      const itemCheckboxContainer = within(item).getByTestId(activityItemCheckboxRegex);
      expect(itemCheckboxContainer).toHaveClass('Mui-checked');
    });

    await userEvent.click(activityCheckbox); // unselect activity
    expect(activityCheckboxContainer).not.toHaveClass('Mui-checked');

    // select one item - actvity checkbox should be indeterminate
    const item0CheckboxContainer = screen.getByTestId(`${dataTestid}-item-0-checkbox`);
    const item0Checkbox = item0CheckboxContainer.querySelector('input[type="checkbox"]');
    await userEvent.click(item0Checkbox);

    expect(activityCheckboxContainer).not.toHaveClass('Mui-checked');
    expect(activityCheckboxContainer).toHaveClass('MuiCheckbox-indeterminate');
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
