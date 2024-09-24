import { ChipOwnProps } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Chip, ChipShape, Svg } from 'shared/components';

export const FlowChip = ({ size = 'medium' }: Pick<ChipOwnProps, 'size'>) => {
  const { t } = useTranslation('app');

  return (
    <Chip
      color="primary"
      size={size}
      icon={<Svg aria-hidden id="multiple-activities" height={18} width={18} />}
      shape={ChipShape.Rectangular}
      title={t('flowChip')}
    />
  );
};
