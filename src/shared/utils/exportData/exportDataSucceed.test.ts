/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { exportDataSucceed } from './exportDataSucceed';
import * as prepareDataUtils from './prepareData';
import * as exportTemplateUtils from '../exportTemplate';
import * as exportCsvZipUtils from './exportCsvZip';
import * as exportMediaZipUtils from './exportMediaZip';

describe('exportDataSucceed', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2000-01-01'));
  });
  beforeEach(() => {
    jest
      .spyOn(prepareDataUtils, 'prepareData')
      .mockReturnValue(Promise.resolve(prepareDataUtils.getDefaultExportData()));
    jest.spyOn(exportTemplateUtils, 'exportTemplate').mockImplementation();
    jest.spyOn(exportCsvZipUtils, 'exportCsvZip').mockImplementation();
    jest.spyOn(exportMediaZipUtils, 'exportMediaZip').mockImplementation();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  const mockedGetDecryptedAnswers = jest.fn();
  const mockedExportData = {
    activities: [],
    answers: [],
  };

  test('check actions with empty data', async () => {
    await exportDataSucceed({ getDecryptedAnswers: mockedGetDecryptedAnswers, suffix: '' })(
      undefined,
    );

    expect(prepareDataUtils.prepareData).not.toHaveBeenCalled();
  });
  test('check actions with default data', async () => {
    await exportDataSucceed({ getDecryptedAnswers: mockedGetDecryptedAnswers, suffix: '-test' })(
      mockedExportData,
    );

    expect(prepareDataUtils.prepareData).toHaveBeenCalledWith(
      mockedExportData,
      mockedGetDecryptedAnswers,
    );
    expect(exportTemplateUtils.exportTemplate).toHaveBeenCalledTimes(2);
    expect(exportTemplateUtils.exportTemplate).toHaveBeenNthCalledWith(1, {
      data: [],
      defaultData: [
        'id',
        'activity_scheduled_time',
        'activity_start_time',
        'activity_end_time',
        'flag',
        'secret_user_id',
        'userId',
        'activity_id',
        'activity_name',
        'activity_flow',
        'item',
        'response',
        'prompt',
        'options',
        'version',
        'rawScore',
        'reviewing_id',
      ],
      fileName: 'report-test',
    });
    expect(exportTemplateUtils.exportTemplate).toHaveBeenNthCalledWith(2, {
      data: [],
      defaultData: [
        'id',
        'activity_scheduled_time',
        'activity_start_time',
        'activity_end_time',
        'press_next_time',
        'press_back_time',
        'press_undo_time',
        'press_skip_time',
        'press_done_time',
        'response_option_selection_time',
        'secret_user_id',
        'user_id',
        'activity_id',
        'activity_flow',
        'activity_name',
        'item',
        'prompt',
        'response',
        'options',
        'version',
      ],
      fileName: 'activity_user_journey-test',
    });
    expect(exportCsvZipUtils.exportCsvZip).toHaveBeenCalledTimes(4);
    expect(exportCsvZipUtils.exportCsvZip).toHaveBeenNthCalledWith(
      1,
      [],
      'drawing-responses-Sat Jan 01 2000-test.zip',
    );
    expect(exportCsvZipUtils.exportCsvZip).toHaveBeenNthCalledWith(
      2,
      [],
      'stability-tracker-responses-Sat Jan 01 2000-test.zip',
    );
    expect(exportCsvZipUtils.exportCsvZip).toHaveBeenNthCalledWith(
      3,
      [],
      'trails-responses-Sat Jan 01 2000-test.zip',
    );
    expect(exportCsvZipUtils.exportCsvZip).toHaveBeenNthCalledWith(
      4,
      [],
      'flanker-responses-Sat Jan 01 2000-test.zip',
    );
    expect(exportMediaZipUtils.exportMediaZip).toHaveBeenCalledTimes(1);
    expect(exportMediaZipUtils.exportMediaZip).toHaveBeenNthCalledWith(
      1,
      [],
      'media-responses-Sat Jan 01 2000-test.zip',
    );
  });
  test("should set 'null' for defaultData in exportTemplate", async () => {
    const reportData = [{ id: 'test' }];
    const activityJourneyData = [{ id: 'test' }];
    jest.spyOn(prepareDataUtils, 'prepareData').mockReturnValue(
      Promise.resolve({
        ...prepareDataUtils.getDefaultExportData(),
        reportData,
        activityJourneyData,
      }),
    );
    await exportDataSucceed({ getDecryptedAnswers: mockedGetDecryptedAnswers, suffix: '' })(
      mockedExportData,
    );

    expect(exportTemplateUtils.exportTemplate).toHaveBeenNthCalledWith(1, {
      data: reportData,
      defaultData: null,
      fileName: 'report',
    });
    expect(exportTemplateUtils.exportTemplate).toHaveBeenNthCalledWith(2, {
      data: activityJourneyData,
      defaultData: null,
      fileName: 'activity_user_journey',
    });
  });
});
