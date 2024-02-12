// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { createRef } from 'react';

import { generatePath } from 'react-router-dom';
import { screen, fireEvent, waitFor } from '@testing-library/react';

import { page } from 'resources';
import { getEntityKey, renderWithAppletFormData } from 'shared/utils';
import { mockedParams, mockedAppletFormData, mockIntersectionObserver } from 'shared/mock';
import { getNewActivity, getNewActivityItem } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.utils';

import { ActivityItems } from './ActivityItems';

const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));
jest.mock('modules/Builder/hooks/useDataPreloader', () => ({
  useDataPreloader: ({ data }) => ({ data, isPending: false }),
}));

const mockedNewItem = getNewActivityItem();
const mockedNewActivity = getNewActivity({ name: 'New Activity' });
const mockedAppletFormDataWithNewActivity = {
  ...mockedAppletFormData,
  activities: [mockedNewActivity],
};
const mockedAppletFormDataWithNewItem = {
  ...mockedAppletFormData,
  activities: [{ ...mockedNewActivity, items: [mockedNewItem] }],
};

const mockedAddItemTestId = 'builder-activity-items-add-item';
const mockedActivityItemTestid = 'builder-activity-items-item';

const renderActivityItems = (formData = mockedAppletFormDataWithNewActivity, options) => {
  const ref = createRef();

  renderWithAppletFormData({
    children: <ActivityItems />,
    appletFormData: formData,
    options: {
      routePath: page.builderAppletActivityItems,
      route: generatePath(page.builderAppletActivityItems, {
        appletId: formData.id,
        activityId: getEntityKey(formData.activities[0]),
      }),
      ...options,
    },
    formRef: ref,
  });

  return ref;
};
const renderActivityItemsWithItem = (formData = mockedAppletFormDataWithNewItem) =>
  renderActivityItems(formData, {
    route: generatePath(page.builderAppletActivityItem, {
      ...mockedParams,
      activityId: getEntityKey(formData.activities[0]),
      itemId: getEntityKey(formData.activities[0].items[0]),
    }),
    routePath: page.builderAppletActivityItem,
  });
const getActivityItemUrl = (itemId) =>
  generatePath(itemId ? page.builderAppletActivityItem : page.builderAppletActivityItems, {
    ...mockedParams,
    activityId: mockedNewActivity.key,
    ...(itemId && { itemId }),
  });

describe('Activity Items', () => {
  beforeEach(() => {
    mockIntersectionObserver();
  });

  test('Is rendered correctly', async () => {
    const ref = renderActivityItems();

    expect(ref.current.getValues('activities.0')).toStrictEqual(mockedNewActivity);
    expect(screen.getByText('At least 1 item is required.')).toBeVisible();
    expect(screen.getByTestId(mockedAddItemTestId)).toBeVisible();
  });

  test('Click on Add Item', async () => {
    renderActivityItems();

    const addItem = screen.getByTestId(mockedAddItemTestId);
    fireEvent.click(addItem);

    await waitFor(() => {
      const item = screen.getByTestId(`${mockedActivityItemTestid}-0`);
      expect(item).toBeVisible();
      expect(item).toHaveTextContent('Item');
      expect(screen.getByTestId(`${mockedActivityItemTestid}-0-dots`)).toBeVisible();
    });

    fireEvent.click(addItem);

    await waitFor(() => {
      const items = screen.getAllByTestId(/^builder-activity-items-item-\d+$/);
      expect(items).toHaveLength(2);
    });
  });

  describe('Actions on hover', () => {
    test('Duplicate', async () => {
      renderActivityItems();

      const addItem = screen.getByTestId(mockedAddItemTestId);
      fireEvent.click(addItem);

      await waitFor(() => expect(screen.getByTestId(`${mockedActivityItemTestid}-0`)).toBeVisible());

      const hoverableItem = screen.getByTestId(`${mockedActivityItemTestid}-0`).querySelector('div');

      fireEvent.mouseEnter(hoverableItem);

      const duplicate = screen.getByTestId(`${mockedActivityItemTestid}-0-duplicate`);
      expect(duplicate).toBeVisible();

      fireEvent.click(duplicate);

      await waitFor(() => {
        const duplicatedItem = screen.getByTestId(`${mockedActivityItemTestid}-1`);
        expect(duplicatedItem).toBeVisible();
        expect(duplicatedItem).toHaveTextContent('Item_1');
      });

      const duplicatedHoverableItem = screen.getByTestId(`${mockedActivityItemTestid}-1`).querySelector('div');
      fireEvent.mouseEnter(duplicatedHoverableItem);
      fireEvent.click(screen.getByTestId(`${mockedActivityItemTestid}-1-duplicate`));

      await waitFor(() => {
        const duplicatedItem = screen.getByTestId(`${mockedActivityItemTestid}-2`);
        expect(duplicatedItem).toBeVisible();
        expect(duplicatedItem).toHaveTextContent('Item_2');
      });
    });

    test('Hide', async () => {
      const ref = renderActivityItems();

      const addItem = screen.getByTestId(mockedAddItemTestId);
      fireEvent.click(addItem);

      await waitFor(() => expect(screen.getByTestId(`${mockedActivityItemTestid}-0`)).toBeVisible());

      const hoverableItem = screen.getByTestId(`${mockedActivityItemTestid}-0`).querySelector('div');

      fireEvent.mouseEnter(hoverableItem);

      const hide = screen.getByTestId(`${mockedActivityItemTestid}-0-hide`);
      expect(hide).toBeVisible();

      fireEvent.click(hide);

      expect(ref.current.getValues('activities.0.items.0.isHidden')).toBeTruthy();
      fireEvent.mouseLeave(hoverableItem);

      const show = screen.getByTestId(`${mockedActivityItemTestid}-0-hide`);
      expect(show).toBeVisible();
      expect(show.querySelector('svg')).toHaveClass('svg-visibility-off');
    });

    test('Remove', async () => {
      const ref = renderActivityItems();

      const addItem = screen.getByTestId(mockedAddItemTestId);
      fireEvent.click(addItem);

      await waitFor(() => expect(screen.getByTestId(`${mockedActivityItemTestid}-0`)).toBeVisible());

      const hoverableItem = screen.getByTestId(`${mockedActivityItemTestid}-0`).querySelector('div');

      fireEvent.mouseEnter(hoverableItem);

      const remove = screen.getByTestId(`${mockedActivityItemTestid}-0-remove`);
      expect(remove).toBeVisible();

      fireEvent.click(remove);

      await waitFor(() => {
        const modal = screen.getByTestId('builder-activity-items-delete-item-popup');
        expect(modal).toBeVisible();
      });

      const confirmRemove = screen.getByTestId('builder-activity-items-delete-item-popup-submit-button');
      fireEvent.click(confirmRemove);

      expect(ref.current.getValues('activities.0.items')).toEqual([]);
      expect(screen.queryAllByTestId(/^builder-activity-items-item-\d+$/)).toHaveLength(0);
    });

    test('Insert', async () => {
      renderActivityItems();

      const addItem = screen.getByTestId(mockedAddItemTestId);
      fireEvent.click(addItem);

      await waitFor(() => expect(screen.getByTestId(`${mockedActivityItemTestid}-0`)).toBeVisible());

      expect(screen.queryByTestId(`${mockedActivityItemTestid}-0-insert-0`)).not.toBeInTheDocument();

      fireEvent.click(addItem);

      await waitFor(() => expect(screen.getByTestId(`${mockedActivityItemTestid}-1`)).toBeVisible());

      const insert = screen.queryByTestId(`${mockedActivityItemTestid}-0-insert-0`);
      fireEvent.mouseEnter(insert);
      fireEvent.click(insert.querySelector('button'));

      await waitFor(() => {
        expect(screen.getByTestId(`${mockedActivityItemTestid}-2`)).toBeVisible();
      });
    });
  });

  describe('Item: becoming active/inactive', () => {
    test('Active on add by default', () => {
      const ref = renderActivityItems();

      const addItem = screen.getByTestId(mockedAddItemTestId);
      fireEvent.click(addItem);

      expect(mockedUseNavigate).toBeCalledWith(getActivityItemUrl(ref.current.getValues('activities.0.items.0.key')));
    });

    test('Active on add if another item is active', () => {
      const ref = renderActivityItemsWithItem();

      const addItem = screen.getByTestId(mockedAddItemTestId);
      fireEvent.click(addItem);

      expect(mockedUseNavigate).toBeCalledWith(getActivityItemUrl(ref.current.getValues('activities.0.items.1.key')));
    });

    test('Active on insert by default', async () => {
      const ref = renderActivityItems();

      const addItem = screen.getByTestId(mockedAddItemTestId);
      fireEvent.click(addItem);
      fireEvent.click(addItem);

      await waitFor(() => expect(screen.getByTestId(`${mockedActivityItemTestid}-1`)).toBeVisible());

      fireEvent.click(screen.getByTestId(`${mockedActivityItemTestid}-0-insert-0`).querySelector('button'));

      expect(mockedUseNavigate).toHaveBeenNthCalledWith(
        3,
        getActivityItemUrl(ref.current.getValues('activities.0.items.1.key')),
      );
    });

    test('Active on insert if another item is active', async () => {
      const ref = renderActivityItemsWithItem();

      const addItem = screen.getByTestId(mockedAddItemTestId);
      fireEvent.click(addItem);

      await waitFor(() => expect(screen.getByTestId(`${mockedActivityItemTestid}-1`)).toBeVisible());

      fireEvent.click(screen.getByTestId(`${mockedActivityItemTestid}-0-insert-0`).querySelector('button'));

      expect(mockedUseNavigate).toHaveBeenNthCalledWith(
        2,
        getActivityItemUrl(ref.current.getValues('activities.0.items.1.key')),
      );
    });

    test('Inactive on delete active item', async () => {
      renderActivityItemsWithItem();

      const addItem = screen.getByTestId(mockedAddItemTestId);
      fireEvent.click(addItem);
      fireEvent.click(addItem);

      await waitFor(() => expect(screen.getByTestId(`${mockedActivityItemTestid}-0`)).toBeVisible());

      const hoverableItem = screen.getByTestId(`${mockedActivityItemTestid}-0`).querySelector('div');

      fireEvent.mouseEnter(hoverableItem);

      const remove = screen.getByTestId(`${mockedActivityItemTestid}-0-remove`);
      expect(remove).toBeVisible();

      fireEvent.click(remove);

      await waitFor(() => {
        const modal = screen.getByTestId('builder-activity-items-delete-item-popup');
        expect(modal).toBeVisible();
      });

      const confirmRemove = screen.getByTestId('builder-activity-items-delete-item-popup-submit-button');
      fireEvent.click(confirmRemove);

      expect(mockedUseNavigate).nthCalledWith(3, getActivityItemUrl());
    });

    test('Active on click item', async () => {
      const ref = renderActivityItemsWithItem();

      const addItem = screen.getByTestId(mockedAddItemTestId);
      fireEvent.click(addItem);

      await waitFor(() => {
        screen.getByTestId(`${mockedActivityItemTestid}-0`);
      });

      fireEvent.click(screen.getByTestId(`${mockedActivityItemTestid}-0`).querySelector('div'));

      expect(mockedUseNavigate).nthCalledWith(2, getActivityItemUrl(ref.current.getValues('activities.0.items.0.key')));
    });
  });

  describe('Delete Item Popups', () => {
    test('Item is in conditional row', async () => {
      const ref = renderActivityItems(mockedAppletFormData);

      fireEvent.click(screen.getByTestId(mockedAddItemTestId));

      await waitFor(() => {
        screen.getAllByTestId(`${mockedActivityItemTestid}-0`);
      });

      ref.current.setValue('activities.0.conditionalLogic', [
        { itemKey: ref.current.getValues('activities.0.items.0.key') },
      ]);

      fireEvent.mouseEnter(screen.getByTestId(`${mockedActivityItemTestid}-0`).querySelector('div'));

      const removes = screen.getAllByTestId(`${mockedActivityItemTestid}-0-remove`);
      fireEvent.click(removes[0]);

      await waitFor(() => {
        const popup = screen.getByTestId('builder-activity-items-delete-item-popup');
        expect(popup).toBeVisible();
        expect(popup).toHaveTextContent(
          /Are you sure you want to delete the Item Item\? It will also remove the Conditional\(s\) below/,
        );
      });
    });

    test('Item is in summary row', async () => {
      const ref = renderActivityItems(mockedAppletFormData);

      fireEvent.click(screen.getByTestId(mockedAddItemTestId));

      await waitFor(() => {
        screen.getAllByTestId(`${mockedActivityItemTestid}-0`);
      });

      ref.current.setValue('activities.0.conditionalLogic', [
        { conditions: [{ itemName: ref.current.getValues('activities.0.items.0.key') }] },
      ]);

      fireEvent.mouseEnter(screen.getByTestId(`${mockedActivityItemTestid}-0`).querySelector('div'));

      const removes = screen.getAllByTestId(`${mockedActivityItemTestid}-0-remove`);
      fireEvent.click(removes[0]);

      await waitFor(() => {
        const popup = screen.getByTestId('builder-activity-items-delete-item-popup');
        expect(popup).toBeVisible();
        expect(popup).toHaveTextContent(
          /Are you sure you want to delete the Item Item\? It will also remove the Conditional\(s\) below/,
        );
      });
    });

    test('Item name is in variables', async () => {
      const ref = renderActivityItems(mockedAppletFormData);

      const addItem = screen.getByTestId(mockedAddItemTestId);
      fireEvent.click(addItem);
      fireEvent.click(addItem);

      await waitFor(() => {
        screen.getAllByTestId(`${mockedActivityItemTestid}-1`);
      });

      ref.current.setValue('activities.0.items.1.name', 'Item2');
      ref.current.setValue('activities.0.items.1.question', '[[Item]]');

      fireEvent.mouseEnter(screen.getByTestId(`${mockedActivityItemTestid}-0`).querySelector('div'));

      const removes = screen.getAllByTestId(`${mockedActivityItemTestid}-0-remove`);
      fireEvent.click(removes[0]);

      await waitFor(() => {
        const popup = screen.getByTestId('builder-activity-items-delete-item-popup');
        expect(popup).toBeVisible();
        expect(popup).toHaveTextContent(/By deleting Item, it will cause Item2 to fail/);
      });
    });
  });
});
