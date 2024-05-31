// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { CorrectPress } from 'modules/Builder/types';
import { HeadCell } from 'shared/types';

import {
  getExportData,
  getRoundBlocks,
  getSequencesData,
  getSequencesHeadCells,
  getStimulusObject,
  getTableFromSequences,
  getUploadedTableRows,
} from './BlockSequencesContent.utils';

describe('getSequencesData', () => {
  test('should return default export table and default table rows', () => {
    const stimulusTrials = [
      {
        id: '1',
        image: 'https://example.com/uploads/media/image1.jpg',
        text: 'text1',
        value: CorrectPress.Right,
      },
      {
        id: '2',
        image: 'https://example.com/uploads/media/image2.jpg',
        text: 'text2',
        value: CorrectPress.Left,
      },
    ];

    const result = getSequencesData(stimulusTrials);

    expect(result.defaultExportTable).toEqual([
      {
        'Block 1': 'text1',
        'Block 2': 'text1',
        'Block 3': 'text1',
        'Block 4': 'text1',
      },
      {
        'Block 1': 'text2',
        'Block 2': 'text2',
        'Block 3': 'text2',
        'Block 4': 'text2',
      },
    ]);

    expect(result.defaultTableRows).toEqual([
      {
        'block-1': {
          content: expect.any(Function),
          value: 'text1',
        },
        'block-2': {
          content: expect.any(Function),
          value: 'text1',
        },
        'block-3': {
          content: expect.any(Function),
          value: 'text1',
        },
        'block-4': {
          content: expect.any(Function),
          value: 'text1',
        },
      },
      {
        'block-1': {
          content: expect.any(Function),
          value: 'text2',
        },
        'block-2': {
          content: expect.any(Function),
          value: 'text2',
        },
        'block-3': {
          content: expect.any(Function),
          value: 'text2',
        },
        'block-4': {
          content: expect.any(Function),
          value: 'text2',
        },
      },
    ]);
  });

  test('should return empty default export table and default table rows when stimulusTrials is empty', () => {
    const stimulusTrials = [];

    const result = getSequencesData(stimulusTrials);

    expect(result.defaultExportTable).toEqual([]);
    expect(result.defaultTableRows).toEqual([]);
  });
});

describe('getSequencesHeadCells', () => {
  test('should return head cells from uploaded data', () => {
    const uploadedData = [{ 'Column One': 'value1', 'Column Two': 'value2' }];
    const expected: HeadCell[] = [
      { id: 'column-one', label: 'Column One' },
      { id: 'column-two', label: 'Column Two' },
    ];

    expect(getSequencesHeadCells(uploadedData)).toEqual(expected);
  });

  test('should return default head cells when no data is uploaded', () => {
    const expected: HeadCell[] = [
      { id: 'block-1', label: 'Block 1' },
      { id: 'block-2', label: 'Block 2' },
      { id: 'block-3', label: 'Block 3' },
      { id: 'block-4', label: 'Block 4' },
    ];

    expect(getSequencesHeadCells()).toEqual(expected);
  });
});

describe('getUploadedTableRows', () => {
  test('should return processed rows from uploaded data', () => {
    const uploadedData = [
      { 'Column One': { text: 'value1' }, 'Column Two': { text: 'value2' } },
      { 'Column One': { text: 'value3' }, 'Column Two': { text: 'value4' } },
    ];

    const expected = [
      {
        'Column One': {
          content: expect.any(Function),
          value: 'value1',
        },
        'Column Two': {
          content: expect.any(Function),
          value: 'value2',
        },
      },
      {
        'Column One': {
          content: expect.any(Function),
          value: 'value3',
        },
        'Column Two': {
          content: expect.any(Function),
          value: 'value4',
        },
      },
    ];

    expect(getUploadedTableRows(uploadedData)).toEqual(expected);
  });

  test('should return undefined when no data is uploaded', () => {
    expect(getUploadedTableRows()).toBeUndefined();
  });

  test('should handle empty uploaded data', () => {
    const uploadedData = [];
    expect(getUploadedTableRows(uploadedData)).toEqual([]);
  });

  test('should handle objects with missing text properties', () => {
    const uploadedData = [{ 'Column One': { text: 'value1' }, 'Column Two': {} }];
    expect(getUploadedTableRows(uploadedData)).toEqual([
      {
        'Column One': {
          content: expect.any(Function),
          value: 'value1',
        },
        'Column Two': {
          content: expect.any(Function),
          value: undefined,
        },
      },
    ]);
  });
});

describe('getStimulusObject', () => {
  const stimulusTrials = [
    {
      id: '1',
      image: 'https://example.com/uploads/media/image1.jpg',
      text: 'text1',
      value: CorrectPress.Right,
    },
    {
      id: '2',
      image: 'https://example.com/uploads/media/image2.jpg',
      text: 'text2',
      value: CorrectPress.Left,
    },
  ];

  test('should return with image keys and id values', () => {
    expect(getStimulusObject(stimulusTrials, 'imageKey')).toEqual({
      text1: '1',
      text2: '2',
    });
  });

  test('should return with id keys and text/image values', () => {
    expect(getStimulusObject(stimulusTrials, 'idKey')).toEqual({
      '1': 'text1',
      '2': 'text2',
    });
  });

  test('should handle empty stimulusTrials', () => {
    expect(getStimulusObject([], 'imageKey')).toEqual({});
  });

  test('should handle undefined stimulusTrials', () => {
    expect(getStimulusObject(undefined, 'imageKey')).toEqual(undefined);
  });
});

describe('getRoundBlocks', () => {
  const stimulusTrials = [];

  test('should return undefined when no uploaded data is provided', () => {
    expect(getRoundBlocks(stimulusTrials)).toBeUndefined();
    expect(getRoundBlocks(stimulusTrials, null)).toBeUndefined();
    expect(getRoundBlocks(stimulusTrials, [])).toBeUndefined();
  });

  test('should process uploaded data correctly', () => {
    const uploadedData = [
      { 'Column One': { id: 'id1-1' }, 'Column Two': { id: 'id2-1' } },
      { 'Column One': { id: 'id1-2' }, 'Column Two': { id: 'id2-2' } },
      { 'Column One': { id: 'id1-3' }, 'Column Two': { id: 'id2-3' } },
    ];

    const expected = [
      {
        order: ['id1-1', 'id1-2', 'id1-3'],
        name: 'Column One',
      },
      {
        order: ['id2-1', 'id2-2', 'id2-3'],
        name: 'Column Two',
      },
    ];

    expect(getRoundBlocks(stimulusTrials, uploadedData)).toEqual(expected);
  });

  test('should handle uploaded data with missing ids', () => {
    const uploadedData = [
      { 'Column One': { id: 'id1-1' }, 'Column Two': { id: 'id2-1' } },
      { 'Column One': {}, 'Column Two': { id: 'id2-2' } },
      { 'Column One': { id: 'id1-3' }, 'Column Two': {} },
    ];

    const expected = [
      {
        order: ['id1-1', undefined, 'id1-3'],
        name: 'Column One',
      },
      {
        order: ['id2-1', 'id2-2', undefined],
        name: 'Column Two',
      },
    ];

    expect(getRoundBlocks(stimulusTrials, uploadedData)).toEqual(expected);
  });
});

describe('getTableFromSequences', () => {
  const stimulusTrials = [
    {
      id: 'id1',
      image: '',
      text: 'text1',
      value: CorrectPress.Right,
    },
    {
      id: 'id2',
      image: 'https://example.com/uploads/media/image2.jpg',
      text: '',
      value: CorrectPress.Left,
    },
  ];

  test('should return undefined when no block sequences are provided', () => {
    expect(getTableFromSequences(stimulusTrials, [])).toBeUndefined();
    expect(getTableFromSequences(stimulusTrials, null)).toBeUndefined();
    expect(getTableFromSequences(stimulusTrials, undefined)).toBeUndefined();
  });

  test('should process block sequences correctly', () => {
    const blockSequences = [
      {
        name: 'Block1',
        order: ['id1', 'id2', 'id3'],
      },
      {
        name: 'Block2',
        order: ['id3', 'id1', 'id2'],
      },
    ];

    expect(getTableFromSequences(stimulusTrials, blockSequences)).toEqual([
      {
        Block1: {
          id: 'id1',
          text: 'text1',
        },
        Block2: {
          id: 'id3',
          text: undefined,
        },
      },
      {
        Block1: {
          id: 'id2',
          text: 'image2.jpg',
        },
        Block2: {
          id: 'id1',
          text: 'text1',
        },
      },
      {
        Block1: {
          id: 'id3',
          text: undefined,
        },
        Block2: {
          id: 'id2',
          text: 'image2.jpg',
        },
      },
    ]);
  });

  test('should handle block sequences with different lengths', () => {
    const blockSequences = [
      {
        name: 'Block1',
        order: ['id1', 'id2'],
      },
      {
        name: 'Block2',
        order: ['id3', 'id1', 'id2'],
      },
    ];

    expect(getTableFromSequences(stimulusTrials, blockSequences)).toEqual([
      {
        Block1: {
          id: 'id1',
          text: 'text1',
        },
        Block2: {
          id: 'id3',
          text: undefined,
        },
      },
      {
        Block1: {
          id: 'id2',
          text: 'image2.jpg',
        },
        Block2: {
          id: 'id1',
          text: 'text1',
        },
      },
      {
        Block2: {
          id: 'id2',
          text: 'image2.jpg',
        },
      },
    ]);
  });

  test('should handle stimulus trials with missing texts or images', () => {
    const stimulusTrialsWithMissingTexts = [
      { id: 'id1', text: 'Text1' },
      { id: 'id2' },
      { id: 'id3', image: 'Image3' },
    ];

    const blockSequences = [
      {
        name: 'Block1',
        order: ['id1', 'id2', 'id3'],
      },
    ];

    expect(getTableFromSequences(stimulusTrialsWithMissingTexts, blockSequences)).toEqual([
      {
        Block1: {
          id: 'id1',
          text: 'Text1',
        },
      },
      {
        Block1: {
          id: 'id2',
          text: undefined,
        },
      },
      {
        Block1: {
          id: 'id3',
          text: 'Image3',
        },
      },
    ]);
  });
});

describe('getExportData', () => {
  test('should return undefined when no uploaded data is provided', () => {
    expect(getExportData()).toBeUndefined();
    expect(getExportData(null)).toBeUndefined();
    expect(getExportData([])).toEqual([]);
  });

  test('should process uploaded data correctly', () => {
    const uploadedData = [
      { 'Column One': { text: 'value1' }, 'Column Two': { text: 'value2' } },
      { 'Column One': { text: 'value3' }, 'Column Two': { text: 'value4' } },
    ];

    expect(getExportData(uploadedData)).toEqual([
      {
        'Column One': 'value1',
        'Column Two': 'value2',
      },
      {
        'Column One': 'value3',
        'Column Two': 'value4',
      },
    ]);
  });

  test('should handle uploaded data with missing text properties', () => {
    const uploadedData = [
      { 'Column One': { text: 'value1' }, 'Column Two': {} },
      { 'Column One': {}, 'Column Two': { text: 'value2' } },
    ];

    expect(getExportData(uploadedData)).toEqual([
      {
        'Column One': 'value1',
        'Column Two': undefined,
      },
      {
        'Column One': undefined,
        'Column Two': 'value2',
      },
    ]);
  });

  test('should handle empty objects in uploaded data', () => {
    const uploadedData = [{}];

    const expected = [{}];

    expect(getExportData(uploadedData)).toEqual(expected);
  });
});
