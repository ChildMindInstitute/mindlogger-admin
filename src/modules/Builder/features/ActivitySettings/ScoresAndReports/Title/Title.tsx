import { useFormContext } from 'react-hook-form';

import {
  StyledFlexTopCenter,
  StyledLabelBoldLarge,
  StyledBodyLarge,
  theme,
  variables,
} from 'shared/styles';

import { TitleProps } from './Title.types';

export const Title = ({ title, reportFieldName }: TitleProps) => {
  const { watch } = useFormContext();
  const reportName = reportFieldName ? watch(`${reportFieldName}.name`) : '';

  return (
    <StyledFlexTopCenter sx={{ alignItems: 'baseline' }}>
      <StyledLabelBoldLarge>{title}</StyledLabelBoldLarge>
      <StyledBodyLarge color={variables.palette.on_surface_variant} sx={{ ml: theme.spacing(1.2) }}>
        {reportName}
      </StyledBodyLarge>
    </StyledFlexTopCenter>
  );
};
