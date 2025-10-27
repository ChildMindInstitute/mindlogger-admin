import { handleSearchKeyDown } from './GroupedSelectSearchController.utils';

describe('handleSearchKeyDown', () => {
  let mockEvent: React.KeyboardEvent;

  beforeEach(() => {
    mockEvent = {
      ...new KeyboardEvent('keypress'),
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as unknown as React.KeyboardEvent;
  });

  test('nothing is called if key is escape', () => {
    handleSearchKeyDown({ ...mockEvent, key: 'Escape' });

    expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
    expect(mockEvent.preventDefault).not.toHaveBeenCalled();
  });

  test('stops propagation if key is neither escape or enter', () => {
    handleSearchKeyDown({ ...mockEvent, key: 'Tab' });

    expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
    expect(mockEvent.preventDefault).not.toHaveBeenCalled();
  });

  test('prevents default and stops propagation if key is enter', () => {
    handleSearchKeyDown({ ...mockEvent, key: 'Enter' });

    expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
    expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
  });
});
