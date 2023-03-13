import { useTranslation } from 'react-i18next';

import theme from 'shared/styles/theme';

import { StyledTooltipText } from './TooltipComponents.styles';
import { SelectionOptionProps } from './TooltipComponents.types';

export const SelectionOption = ({ optionNumber }: SelectionOptionProps) => {
  const { t } = useTranslation();

  return (
    <StyledTooltipText sx={{ ml: theme.spacing(1) }}>{`${t(
      'option',
    )} ${optionNumber}`}</StyledTooltipText>
  );
};
