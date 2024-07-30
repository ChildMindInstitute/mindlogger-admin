import { getMatchOptions } from './ConfigurationPopup.utils';
import { Project } from './ConfigurationPopup.types';

describe('getMatchOptions', () => {
  test('should return an empty array when the input is an empty array', () => {
    const projects: Project[] = [];
    const result = getMatchOptions(projects);
    expect(result).toEqual([]);
  });

  test('should correctly map the project properties to the expected format', () => {
    const projects: Project[] = [
      { id: '1', name: 'Project One' },
      { id: '2', name: 'Project Two' },
    ];

    const expected = [
      { labelKey: 'Project One', value: '1' },
      { labelKey: 'Project Two', value: '2' },
    ];

    const result = getMatchOptions(projects);
    expect(result).toEqual(expected);
  });

  test('should handle projects with similar names', () => {
    const projects: Project[] = [
      { id: '3', name: 'Duplicate' },
      { id: '4', name: 'Duplicate' },
    ];

    const expected = [
      { labelKey: 'Duplicate', value: '3' },
      { labelKey: 'Duplicate', value: '4' },
    ];

    const result = getMatchOptions(projects);
    expect(result).toEqual(expected);
  });
});
