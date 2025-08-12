// eslint-disable no-console
import { checkIfShouldLogging } from './logger';

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
    console.log(
      `[ExportTemplate] Starting export for ${fileName} with ${data.length} rows of data`,
    );

    try {
      const sampleSize = Math.min(5, data.length);
      const sampleItems = data.slice(0, sampleSize);
      const estimatedItemSize = sampleItems.length > 0 ? JSON.stringify(sampleItems[0]).length : 0;
      const estimatedTotalSize = estimatedItemSize * data.length;

      console.log(
        `[ExportTemplate] Estimated data size for ${fileName}: ~${Math.round(
          estimatedTotalSize / 1024,
        )} KB` + ` (${data.length} items, ~${estimatedItemSize} bytes per item)`,
      );

      if (estimatedTotalSize > 50 * 1024 * 1024) {
        // 50MB
        console.warn(
          `[ExportTemplate] Warning: Large data set detected for ${fileName}. ` +
            `Estimated size: ${Math.round(estimatedTotalSize / (1024 * 1024))} MB`,
        );
      }

      if (data.length > 0) {
        const firstItem = data[0] as Record<string, unknown>;
        const lastItem = data[data.length - 1] as Record<string, unknown>;
        console.log(`[ExportTemplate] First item keys: ${Object.keys(firstItem).join(', ')}`);
        console.log(`[ExportTemplate] Last item keys: ${Object.keys(lastItem).join(', ')}`);

        const firstItemKeys = Object.keys(firstItem).sort().join(',');
        const lastItemKeys = Object.keys(lastItem).sort().join(',');

        if (firstItemKeys !== lastItemKeys) {
          console.warn(
            `[ExportTemplate] Warning: Inconsistent data structure detected in ${fileName}. ` +
              `First and last items have different keys.`,
          );
        }
      }
    } catch (sizeError) {
      console.error(`[ExportTemplate] Error analyzing data size: ${sizeError}`);
    }
  }

  try {
    if (shouldLogDataInDebugMode) {
      console.log(`[ExportTemplate] Dynamically importing xlsx library`);
    }

    const { writeFile, utils } = await import('xlsx');

    if (shouldLogDataInDebugMode) {
      console.log(`[ExportTemplate] Creating worksheet for ${fileName}`);

      // Log memory usage if available
      if (typeof window !== 'undefined' && window.performance) {
        try {
          // Chrome-specific memory API - use type assertion for safety
          const perf = window.performance as any;
          if (perf.memory) {
            console.log(
              `[ExportTemplate] Current memory usage: ${Math.round(
                perf.memory.usedJSHeapSize / (1024 * 1024),
              )}MB ` + `/ ${Math.round(perf.memory.jsHeapSizeLimit / (1024 * 1024))}MB`,
            );
          }
        } catch (memoryError) {
          // Silently ignore - memory API might not be available in all browsers
        }
      }
    }

    // Track worksheet creation time for performance monitoring
    const worksheetStartTime = Date.now();

    try {
      const workSheet = defaultData ? utils.aoa_to_sheet([defaultData]) : utils.json_to_sheet(data);

      if (shouldLogDataInDebugMode) {
        const worksheetCreationTime = Date.now() - worksheetStartTime;
        console.log(
          `[ExportTemplate] Worksheet created successfully for ${fileName} in ${worksheetCreationTime}ms`,
        );

        // Check worksheet dimensions
        if (workSheet['!ref']) {
          console.log(`[ExportTemplate] Worksheet dimensions: ${workSheet['!ref']}`);
        }
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
          console.error(`[ExportTemplate] Error writing file ${fileName}:`, writeError);
          if (writeError instanceof Error) {
            console.error(
              `[ExportTemplate] Error details: ${writeError.name}: ${writeError.message}`,
            );

            if (shouldLogDataInDebugMode) {
              console.error(`[ExportTemplate] Stack trace: ${writeError.stack}`);

              // Log more detailed error information based on error type
              if (
                writeError.name === 'QuotaExceededError' ||
                writeError.message.includes('quota') ||
                writeError.message.includes('storage')
              ) {
                console.error(
                  `[ExportTemplate] Storage quota error detected. This may be due to insufficient disk space.`,
                );
              }

              if (writeError.message.includes('permission')) {
                console.error(
                  `[ExportTemplate] Permission error detected. Check file system permissions.`,
                );
              }

              console.error(
                `[ExportTemplate] Data statistics: Size=${data.length}, Sample keys=${
                  data[0] ? Object.keys(data[0]).slice(0, 5).join(', ') : 'N/A'
                }`,
              );
            }
          }
        }
        setTimeout(() => {
          resolve(true);
        });
      });
    } catch (worksheetError) {
      console.error(`[ExportTemplate] Error creating worksheet for ${fileName}:`, worksheetError);
      if (worksheetError instanceof Error) {
        console.error(
          `[ExportTemplate] Worksheet error details: ${worksheetError.name}: ${worksheetError.message}`,
        );

        if (shouldLogDataInDebugMode) {
          console.error(`[ExportTemplate] Worksheet error stack: ${worksheetError.stack}`);

          // Check for RangeError specifically
          if (worksheetError.name === 'RangeError') {
            if (worksheetError.message.includes('array length')) {
              console.error(
                `[ExportTemplate] Invalid array length detected. This may be due to data exceeding size limits.`,
              );

              // Try to identify which part of the data might be causing the issue
              try {
                let problematicIndex = -1;
                let maxLength = 0;

                // Sample data to find potentially problematic items
                const sampleStep = Math.max(1, Math.floor(data.length / 10));
                for (let i = 0; i < data.length; i += sampleStep) {
                  const itemString = JSON.stringify(data[i]);
                  if (itemString.length > maxLength) {
                    maxLength = itemString.length;
                    problematicIndex = i;
                  }
                }

                if (problematicIndex >= 0) {
                  console.error(
                    `[ExportTemplate] Potentially problematic item found at index ${problematicIndex} ` +
                      `with size ${maxLength} bytes`,
                  );
                }
              } catch (analysisError) {
                console.error(
                  `[ExportTemplate] Error analyzing problematic data: ${analysisError}`,
                );
              }
            }
          }
        }
      }
      throw worksheetError; // Re-throw to be caught by the outer try-catch
    }
  } catch (error) {
    console.error(`[ExportTemplate] Critical error in exportTemplate for ${fileName}:`, error);
    if (error instanceof Error) {
      console.error(`[ExportTemplate] Error details: ${error.name}: ${error.message}`);
      if (shouldLogDataInDebugMode) {
        console.error(`[ExportTemplate] Stack trace: ${error.stack}`);
        console.error(
          `[ExportTemplate] Data statistics: Size=${data.length}, Sample keys=${
            data[0] ? Object.keys(data[0]).slice(0, 5).join(', ') : 'N/A'
          }`,
        );
      }
    }

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
