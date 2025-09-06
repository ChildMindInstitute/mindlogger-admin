import { useMemo } from 'react';

import { DataTable } from './DataTable';
import { DataTableProps } from './DataTable.types';
import { VirtualizedDataTable } from './VirtualizedDataTable';

export const VIRTUALIZATION_THRESHOLD = 30;

export interface SmartDataTableProps extends DataTableProps {
  /**
   * Force virtualization regardless of data size
   * @default false
   */
  forceVirtualization?: boolean;

  /**
   * Custom threshold to determine when to use virtualization
   * @default VIRTUALIZATION_THRESHOLD (30)
   */
  virtualizationThreshold?: number;
}

/**
 * SmartDataTable automatically chooses between regular DataTable and VirtualizedDataTable
 * based on the size of the dataset to optimize performance
 */
export const SmartDataTable = ({
  data,
  forceVirtualization = false,
  virtualizationThreshold = VIRTUALIZATION_THRESHOLD,
  ...props
}: SmartDataTableProps) => {
  const shouldUseVirtualization = useMemo(() => {
    if (forceVirtualization) return true;

    return data && data.length > virtualizationThreshold;
  }, [data, forceVirtualization, virtualizationThreshold]);

  if (shouldUseVirtualization) {
    return <VirtualizedDataTable data={data} {...props} />;
  }

  return <DataTable data={data} {...props} />;
};
