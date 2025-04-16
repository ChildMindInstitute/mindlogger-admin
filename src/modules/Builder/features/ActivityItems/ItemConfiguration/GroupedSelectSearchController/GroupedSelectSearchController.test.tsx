import { useForm } from 'react-hook-form';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Fragment } from 'react';

import { ItemResponseType } from 'shared/consts';
import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { getIsMobileOnly, getIsWebOnly } from 'shared/utils';

import { GroupedSelectSearchController } from './GroupedSelectSearchController';
import { ItemsOptionGroup } from '../ItemConfiguration.types';

const dataTestid = 'builder-activity-items-item-configuration-response-type';
const options: ItemsOptionGroup[] = [
  {
    groupName: 'select',
    groupOptions: [
      { value: ItemResponseType.SingleSelection, icon: <Fragment /> },
      { value: ItemResponseType.MultipleSelection, icon: <Fragment /> },
    ],
  },
  {
    groupName: 'webOnly',
    groupOptions: [{ value: ItemResponseType.PhrasalTemplate, icon: <Fragment /> }],
  },
  {
    groupName: 'mobileOnly',
    groupOptions: [
      { value: ItemResponseType.Audio, icon: <Fragment /> },
      { value: ItemResponseType.Drawing, icon: <Fragment /> },
      { value: ItemResponseType.Geolocation, icon: <Fragment /> },
      { value: ItemResponseType.Photo, icon: <Fragment /> },
      { value: ItemResponseType.Video, icon: <Fragment /> },
    ],
  },
  {
    groupName: 'input',
    groupOptions: [{ value: ItemResponseType.Text, icon: <Fragment /> }],
  },
];

const FormComponent = () => {
  const { control, setValue } = useForm();

  const props = {
    control,
    name: 'responseType',
    options,
    setValue,
    fieldName: 'activity.0.item.0',
    checkIfSelectChangePopupIsVisible: vi.fn(),
  };

  return <GroupedSelectSearchController {...props} />;
};

describe('GroupedSelectSearchController', () => {
  const selectLabel = /Item Type/i;

  beforeEach(() => {
    renderWithProviders(<FormComponent />);
  });

  test('renders labels for client-specific responseTypes', async () => {
    const selectEl = await screen.findByLabelText(selectLabel);
    await userEvent.click(selectEl);
    const popoverMenu = await screen.findByTestId('popover-menu');

    options.forEach(({ groupOptions }) => {
      groupOptions.forEach(({ value }) => {
        const option = within(popoverMenu).getByTestId(`${dataTestid}-option-${value}`);

        getIsMobileOnly(value)
          ? expect(within(option).getByTestId('mobile-only-label')).toBeInTheDocument()
          : expect(within(option).queryByTestId('mobile-only-label')).not.toBeInTheDocument();

        getIsWebOnly(value)
          ? expect(within(option).getByTestId('web-only-label')).toBeInTheDocument()
          : expect(within(option).queryByTestId('web-only-label')).not.toBeInTheDocument();
      });
    });
  });

  test('renders component with search functionality', async () => {
    const itemConfiguration = screen.getByTestId(dataTestid);
    const inputElement = itemConfiguration.querySelector('input');
    const selectEl = await screen.findByLabelText(selectLabel);

    expect(inputElement).toBeInTheDocument();
    expect(inputElement?.value).toBe('');
    expect(selectEl).toBeInTheDocument();

    await userEvent.click(selectEl);

    const popoverMenu = await screen.findByTestId('popover-menu');
    expect(popoverMenu).toBeInTheDocument();

    expect(within(popoverMenu).getByTestId(`${dataTestid}-search`)).toBeInTheDocument();

    options.forEach(({ groupName }) => {
      expect(
        within(popoverMenu).getByTestId(`${dataTestid}-group-${groupName}`),
      ).toBeInTheDocument();
    });

    // test select 'photo' item type
    const photoOption = within(popoverMenu).getByTestId(`${dataTestid}-option-photo`);

    // test tooltip visibility
    await userEvent.hover(photoOption);
    const tooltip = await screen.findByTestId('tooltip-selection-presentation');
    expect(tooltip).toBeVisible();
    await userEvent.unhover(photoOption);
    expect(tooltip).not.toBeVisible();

    await userEvent.click(photoOption);

    expect(popoverMenu).not.toBeInTheDocument(); // popover is not visible
    expect(inputElement?.value).toBe('photo'); // check input value

    // test search
    await userEvent.click(selectEl);
    const search = await screen.findByTestId(`${dataTestid}-search`);
    expect(search).toBeInTheDocument();

    const searchInput = search.querySelector('input');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await userEvent.type(searchInput!, 'searchhhh'); // not found

    const emptySearch = await screen.findByTestId(`${dataTestid}-empty-search`);
    expect(emptySearch).toBeInTheDocument();
    expect(
      screen.getByText(
        /No match was found for 'searchhhh'. Try a different search word or phrase./,
      ),
    ).toBeInTheDocument();

    const clearButton = screen.getByTestId('clear-button');
    expect(clearButton).toBeInTheDocument();
    await userEvent.click(clearButton); // clear input

    expect(emptySearch).not.toBeInTheDocument();

    const searchValue = 'sing';
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await userEvent.type(searchInput!, searchValue);

    const singleSelect = screen.getByTestId(`${dataTestid}-option-singleSelect`);
    expect(singleSelect.querySelector('.highlighted-text')).toHaveTextContent(
      new RegExp(`^${searchValue}$`, 'i'),
    );
  });
});
