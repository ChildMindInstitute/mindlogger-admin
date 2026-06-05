// eslint-disable no-console
import { checkIfShouldLogging } from './logger';
import {
  logDataAnalysis,
  logMemoryUsage,
  logWorksheetCreated,
  logWorksheetError,
  logWriteError,
  logCriticalError,
} from './exportTemplate.logging';

export const exportTemplate = async <T extends unknown[]>({
  data,
  fileName,
  isXlsx,
  defaultData,
}: {
  data: T;
  fileName: string;
  isXlsx?: boolean;
  defaultData?: string[] | null;
}) => {
  const shouldLogDataInDebugMode = checkIfShouldLogging();

  if (shouldLogDataInDebugMode) {
    logDataAnalysis(fileName, data);
  }

  try {
    if (shouldLogDataInDebugMode) {
      console.log(`[ExportTemplate] Dynamically importing xlsx library`);
    }

    const { writeFile, utils } = await import('xlsx');

    if (shouldLogDataInDebugMode) {
      console.log(`[ExportTemplate] Creating worksheet for ${fileName}`);
      logMemoryUsage();
    }

    // Track worksheet creation time for performance monitoring
    const worksheetStartTime = Date.now();

    try {
      const workSheet = defaultData ? utils.aoa_to_sheet([defaultData]) : utils.json_to_sheet(data);

      if (shouldLogDataInDebugMode) {
        logWorksheetCreated(fileName, workSheet, Date.now() - worksheetStartTime);
      }

      const workBook = utils.book_new();
      utils.book_append_sheet(workBook, workSheet, 'Sheet1');

      if (shouldLogDataInDebugMode) {
        console.log(`[ExportTemplate] Writing file ${fileName}${isXlsx ? '.xlsx' : '.csv'}`);
      }

      return new Promise((resolve) => {
        try {
          // Track file writing time
          const writeStartTime = Date.now();

          writeFile(workBook, `${fileName}${isXlsx ? '.xlsx' : '.csv'}`);

          if (shouldLogDataInDebugMode) {
            const writeTime = Date.now() - writeStartTime;
            console.log(
              `[ExportTemplate] Successfully wrote file ${fileName}${
                isXlsx ? '.xlsx' : '.csv'
              } in ${writeTime}ms`,
            );
          }
        } catch (writeError) {
          logWriteError(fileName, writeError, data, shouldLogDataInDebugMode);
        }
        setTimeout(() => {
          resolve(true);
        });
      });
    } catch (worksheetError) {
      logWorksheetError(fileName, worksheetError, data, shouldLogDataInDebugMode);
      throw worksheetError; // Re-throw to be caught by the outer try-catch
    }
  } catch (error) {
    logCriticalError(fileName, error, data, shouldLogDataInDebugMode);

    return true;
  }
};

export const convertJsonToCsv = async (data: unknown[]) => {
  if (checkIfShouldLogging()) {
    console.log(`[ConvertJsonToCsv] Converting data with ${data.length} rows`);
  }

  try {
    const { utils } = await import('xlsx');

    if (checkIfShouldLogging()) {
      console.log(`[ConvertJsonToCsv] Creating sheet from JSON data`);
    }

    const result = utils.sheet_to_csv(utils.json_to_sheet(data));

    if (checkIfShouldLogging()) {
      console.log(`[ConvertJsonToCsv] Successfully converted JSON to CSV`);
    }

    return result;
  } catch (error) {
    console.error(`[ConvertJsonToCsv] Error converting JSON to CSV:`, error);

    if (error instanceof Error) {
      console.error(`[ConvertJsonToCsv] Error details: ${error.name}: ${error.message}`);
      if (checkIfShouldLogging()) {
        console.error(`[ConvertJsonToCsv] Stack trace: ${error.stack}`);
      }
    }

    throw error;
  }
};
