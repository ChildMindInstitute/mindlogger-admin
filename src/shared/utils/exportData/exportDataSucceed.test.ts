/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { exportEncryptedDataSucceed, exportDecryptedDataSucceed } from './exportDataSucceed';
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
      .spyOn(prepareDataUtils, 'prepareEncryptedData')
      .mockReturnValue(Promise.resolve(prepareDataUtils.getDefaultExportData()));
    jest
      .spyOn(prepareDataUtils, 'prepareDecryptedData')
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
  const mockedDecryptedExportData = [
    {
      decryptedAnswers: [],
      decryptedEvents: [],
    },
  ];

  const checkCommonActions = () => {
    expect(exportTemplateUtils.exportTemplate).toHaveBeenCalledTimes(2);
    expect(exportTemplateUtils.exportTemplate).toHaveBeenNthCalledWith(1, {
      data: [],
      defaultData: [
        'id',
        'activity_flow_submission_id',
        'activity_scheduled_time',
        'activity_start_time',
        'activity_end_time',
        'flag',
        'secret_user_id',
        'userId',
        'source_user_subject_id',
        'source_user_secret_id',
        'source_user_nickname',
        'source_user_relation',
        'source_user_tag',
        'target_user_subject_id',
        'target_user_secret_id',
        'target_user_nickname',
        'target_user_tag',
        'input_user_subject_id',
        'input_user_secret_id',
        'input_user_nickname',
        'activity_id',
        'activity_name',
        'activity_flow_id',
        'activity_flow_name',
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
        'activity_flow_submission_id',
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
        'source_user_subject_id',
        'source_user_secret_id',
        'source_user_nickname',
        'source_user_relation',
        'source_user_tag',
        'target_user_subject_id',
        'target_user_secret_id',
        'target_user_nickname',
        'target_user_tag',
        'input_user_subject_id',
        'input_user_secret_id',
        'input_user_nickname',
        'activity_id',
        'activity_flow_id',
        'activity_flow_name',
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
  };

  const reportData = [{ id: 'test' }];
  const activityJourneyData = [{ id: 'test' }];
  const checkExportTemplateDefaultData = () => {
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
  };

  test('exportEncryptedDataSucceed: check actions with empty data', async () => {
    await exportEncryptedDataSucceed({
      getDecryptedAnswers: mockedGetDecryptedAnswers,
      suffix: '',
    })(undefined);

    expect(prepareDataUtils.prepareEncryptedData).not.toHaveBeenCalled();
  });

  test('exportDecryptedDataSucceed: check actions with empty data', async () => {
    await exportDecryptedDataSucceed({
      suffix: '',
    })(undefined);

    expect(prepareDataUtils.prepareDecryptedData).not.toHaveBeenCalled();
  });

  test('exportEncryptedDataSucceed: check actions with default data', async () => {
    await exportEncryptedDataSucceed({
      getDecryptedAnswers: mockedGetDecryptedAnswers,
      suffix: '-test',
    })(mockedExportData);

    expect(prepareDataUtils.prepareEncryptedData).toHaveBeenCalledWith(
      mockedExportData,
      mockedGetDecryptedAnswers,
      undefined,
    );

    checkCommonActions();
  });

  test('exportDecryptedDataSucceed: check actions with default data', async () => {
    await exportDecryptedDataSucceed({
      suffix: '-test',
    })(mockedDecryptedExportData);

    expect(prepareDataUtils.prepareDecryptedData).toHaveBeenCalledWith(
      mockedDecryptedExportData,
      undefined,
    );

    checkCommonActions();
  });

  test("exportEncryptedDataSucceed: should set 'null' for defaultData in exportTemplate", async () => {
    jest.spyOn(prepareDataUtils, 'prepareEncryptedData').mockReturnValue(
      Promise.resolve({
        ...prepareDataUtils.getDefaultExportData(),
        reportData,
        activityJourneyData,
      }),
    );
    await exportEncryptedDataSucceed({
      getDecryptedAnswers: mockedGetDecryptedAnswers,
      suffix: '',
    })(mockedExportData);

    checkExportTemplateDefaultData();
  });

  test("exportDecryptedDataSucceed: should set 'null' for defaultData in exportTemplate", async () => {
    const reportData = [{ id: 'test' }];
    const activityJourneyData = [{ id: 'test' }];
    jest.spyOn(prepareDataUtils, 'prepareDecryptedData').mockReturnValue(
      Promise.resolve({
        ...prepareDataUtils.getDefaultExportData(),
        reportData,
        activityJourneyData,
      }),
    );
    await exportDecryptedDataSucceed({
      suffix: '',
    })(mockedDecryptedExportData);

    checkExportTemplateDefaultData();
  });
});
