// eslint-disable no-console

/** Logs initial data size estimates and structure consistency checks. */
export const logDataAnalysis = (fileName: string, data: unknown[]) => {
  console.log(`[ExportTemplate] Starting export for ${fileName} with ${data.length} rows of data`);

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
};

/** Logs current browser memory usage (Chrome-specific). */
export const logMemoryUsage = () => {
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
};

/** Logs worksheet creation timing and dimensions. */
export const logWorksheetCreated = (
  fileName: string,
  workSheet: { '!ref'?: string },
  worksheetCreationTime: number,
) => {
  console.log(
    `[ExportTemplate] Worksheet created successfully for ${fileName} in ${worksheetCreationTime}ms`,
  );

  // Check worksheet dimensions
  if (workSheet['!ref']) {
    console.log(`[ExportTemplate] Worksheet dimensions: ${workSheet['!ref']}`);
  }
};

/** Logs detailed write-error diagnostics. */
export const logWriteError = (
  fileName: string,
  writeError: unknown,
  data: unknown[],
  shouldLogDataInDebugMode: boolean,
) => {
  console.error(`[ExportTemplate] Error writing file ${fileName}:`, writeError);
  if (writeError instanceof Error) {
    console.error(`[ExportTemplate] Error details: ${writeError.name}: ${writeError.message}`);

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
        console.error(`[ExportTemplate] Permission error detected. Check file system permissions.`);
      }

      console.error(
        `[ExportTemplate] Data statistics: Size=${data.length}, Sample keys=${
          data[0] ? Object.keys(data[0]).slice(0, 5).join(', ') : 'N/A'
        }`,
      );
    }
  }
};

/** Logs detailed worksheet-creation error diagnostics. */
export const logWorksheetError = (
  fileName: string,
  worksheetError: unknown,
  data: unknown[],
  shouldLogDataInDebugMode: boolean,
) => {
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
            console.error(`[ExportTemplate] Error analyzing problematic data: ${analysisError}`);
          }
        }
      }
    }
  }
};

/** Logs critical top-level error diagnostics. */
export const logCriticalError = (
  fileName: string,
  error: unknown,
  data: unknown[],
  shouldLogDataInDebugMode: boolean,
) => {
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
};
