// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useForm } from 'react-hook-form';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { GroupedSelectSearchController } from './GroupedSelectSearchController';

const dataTestid = 'builder-activity-items-item-configuration-response-type';
const options = [
  {
    groupName: 'select',
    groupOptions: [
      {
        value: 'singleSelect',
        icon: null,
      },
      {
        value: 'multiSelect',
        icon: null,
      },
    ],
  },

  {
    groupName: 'input',
    groupOptions: [
      {
        value: 'text',
        icon: null,
      },

      {
        value: 'photo',
        icon: null,
        isMobileOnly: true,
      },
    ],
  },
];

const FormComponent = () => {
  const { control } = useForm();

  const props = {
    control,
    name: 'responseType',
    options,
    checkIfSelectChangePopupIsVisible: jest.fn(),
  };

  return <GroupedSelectSearchController {...props} />;
};

describe('GroupedSelectSearchController', () => {
  test('renders component with search functionality', async () => {
    renderWithProviders(<FormComponent />);

    const itemConfiguration = screen.getByTestId(dataTestid);
    const inputElement = itemConfiguration.querySelector('input');

    expect(inputElement).toBeInTheDocument();
    expect(inputElement.value).toBe('');

    const selectLabel = /Item Type/i;
    const selectEl = await screen.findByLabelText(selectLabel);

    expect(selectEl).toBeInTheDocument();
    await userEvent.click(selectEl);

    const popoverMenu = await screen.findByTestId('popover-menu');
    expect(popoverMenu).toBeInTheDocument();

    expect(within(popoverMenu).getByTestId(`${dataTestid}-search`)).toBeInTheDocument();

    options.forEach(({ groupName, groupOptions }) => {
      expect(
        within(popoverMenu).getByTestId(`${dataTestid}-group-${groupName}`),
      ).toBeInTheDocument();

      groupOptions.forEach(({ value, isMobileOnly }) => {
        const option = within(popoverMenu).getByTestId(`${dataTestid}-option-${value}`);
        expect(option).toBeInTheDocument();

        isMobileOnly
          ? expect(within(option).getByTestId('mobile-only-label')).toBeInTheDocument()
          : expect(within(option).queryByTestId('mobile-only-label')).not.toBeInTheDocument();
      });
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
    expect(inputElement.value).toBe('photo'); // check input value

    // test search
    await userEvent.click(selectEl);
    const search = await screen.findByTestId(`${dataTestid}-search`);
    expect(search).toBeInTheDocument();

    const searchInput = search.querySelector('input');
    await userEvent.type(searchInput, 'searchhhh'); // not found

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
    await userEvent.type(searchInput, searchValue);

    const singleSelect = screen.getByTestId(`${dataTestid}-option-singleSelect`);
    expect(singleSelect.querySelector('.highlighted-text')).toHaveTextContent(
      new RegExp(`^${searchValue}$`, 'i'),
    );
  });
});
