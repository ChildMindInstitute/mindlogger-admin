import { useFieldArray, useFormContext } from 'react-hook-form';

import { AppletFormValues } from 'modules/Builder/pages';
import { StyledClearedButton, StyledFlexTopCenter, theme } from 'shared/styles';
import { Svg } from 'shared/components';

import { SubscaleHeaderContentProps } from './SubscaleHeaderContent.types';

export const SubscaleHeaderContent = ({ index }: SubscaleHeaderContentProps) => {
  const { control } = useFormContext<AppletFormValues>();
  const { remove: removeSubscale } = useFieldArray({
    control,
    name: 'subscales',
  });

  const handleOnLookupTable = () => false;

  return (
    <StyledFlexTopCenter>
      {' '}
      <StyledClearedButton
        sx={{ p: theme.spacing(1), mr: theme.spacing(0.2) }}
        onClick={handleOnLookupTable}
      >
        <Svg id="lookup-table" width="20" height="20" />
      </StyledClearedButton>
      <StyledClearedButton
        sx={{ p: theme.spacing(1), mr: theme.spacing(0.2) }}
        onClick={() => {
          removeSubscale(index);
        }}
      >
        <Svg id="trash" width="20" height="20" />
      </StyledClearedButton>
    </StyledFlexTopCenter>
  );
};
