// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen } from '@testing-library/react';

import { ItemResponseType } from 'shared/consts';

import { mockedTestid, renderItemConfigurationByType } from '../__mocks__';

const mockedDrawingTestid = `${mockedTestid}-drawing`;

const renderDrawing = () => renderItemConfigurationByType(ItemResponseType.Drawing);

describe('Item Configuration: Drawing', () => {
  test('Is rendered correctly', () => {
    renderDrawing();

    expect(screen.getByTestId(mockedDrawingTestid)).toBeVisible();

    const title = screen.getByTestId(`${mockedDrawingTestid}-title`);
    expect(title).toBeVisible();
    expect(title).toHaveTextContent('Drawing');

    expect(screen.getByTestId(`${mockedDrawingTestid}-example`)).toBeVisible();
    expect(screen.getByTestId(`${mockedDrawingTestid}-background`)).toBeVisible();
  });
});
