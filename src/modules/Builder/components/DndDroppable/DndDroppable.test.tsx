import { render, act, cleanup, waitFor } from '@testing-library/react';
import { Droppable } from 'react-beautiful-dnd';

import { DndDroppable } from '.';

const renderComponent = () => <DndDroppable droppableId="droppableId">{() => <></>}</DndDroppable>;

jest.mock('react-beautiful-dnd', () => ({
  Droppable: vi.fn().mockImplementation(({ children }) => <>{children}</>),
}));

describe('DndDroppable', () => {
  afterEach(cleanup);

  test('renders nothing initially', () => {
    const { container } = render(renderComponent());
    expect(container.firstChild).toBeNull();
  });

  test('renders Droppable component after animation frame', async () => {
    await act(async () => {
      render(renderComponent());

      await new Promise((resolve) => requestAnimationFrame(resolve));
    });
    await waitFor(() => expect(Droppable).toHaveBeenCalled());
  });
});
