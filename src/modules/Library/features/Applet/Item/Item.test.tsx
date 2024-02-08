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

import { Item } from './Item';
import { AppletUiType, LibraryForm } from '../Applet.types';

const dataTestid = 'activity-item';
const mockDispatch = jest.fn();

jest.mock('./Item.styles', () => ({
  ...jest.requireActual('./Item.styles'),
  StyledMdPreview: ({ modelValue, 'data-testid': dataTestid }) => <div data-testid={dataTestid}>{modelValue}</div>,
}));

const FormComponent = ({ children }) => {
  const methods = useForm<LibraryForm>({
    defaultValues: { [mockedAppletId]: [] },
    mode: 'onChange',
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};

const singleSelectionItem = {
  question: {
    en: 'Single Selection Item',
  },
  responseType: 'singleSelect',
  responseValues: {
    options: [
      {
        text: 'option 1',
      },
      {
        text: 'option 2',
      },
    ],
  },
  name: 'Item',
};

const ItemComponent = (
  <FormComponent>
    <Item
      item={singleSelectionItem}
      appletId={mockedAppletId}
      activityName={'mockedActivityName'}
      activityKey={'mockedActivityKey'}
      search={''}
      uiType={AppletUiType.Cart}
      data-testid={dataTestid}
    />
  </FormComponent>
);

describe('Item', () => {
  beforeEach(() => {
    jest.spyOn(reduxHooks, 'useAppDispatch').mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders checkbox and header', async () => {
    const setAddToBuilderBtnDisabledMock = jest.spyOn(library.actions, 'setAddToBuilderBtnDisabled');

    renderWithProviders(ItemComponent, {
      route: '/library/cart',
      routePath: page.libraryCart,
    });

    const item = screen.getByTestId(dataTestid);
    expect(item).toBeInTheDocument();

    const itemHeader = screen.getByTestId(`${dataTestid}-header`);
    expect(itemHeader).toBeInTheDocument();

    expect(screen.queryAllByTestId(/^item-option-\d+$/)).toHaveLength(0);

    await userEvent.click(itemHeader);

    const options = screen.getAllByTestId(/^item-option-\d+$/);
    expect(options).toHaveLength(2);

    options.forEach((option, index) => {
      const textContent = option.textContent;
      expect(textContent).toEqual(singleSelectionItem.responseValues.options[index].text);
    });

    const itemCheckboxContainer = screen.getByTestId(`${dataTestid}-checkbox`);
    expect(itemCheckboxContainer).toBeInTheDocument();

    const itemCheckbox = itemCheckboxContainer.querySelector('input[type="checkbox"]');
    expect(itemCheckbox).toBeInTheDocument();

    // select activity item
    await userEvent.click(itemCheckbox);
    expect(setAddToBuilderBtnDisabledMock).toHaveBeenCalledWith(false);

    // unselect activity item
    await userEvent.click(itemCheckbox);
    expect(setAddToBuilderBtnDisabledMock).toHaveBeenCalledWith(true);
  });
});
