import { Checkbox, CheckboxProps } from '@mui/material';

import { Svg } from 'shared/components';
import { variables } from 'shared/styles';

export const ActivityCheckbox = (props: CheckboxProps) => (
  <Checkbox
    icon={
      <Svg
        id="add-circle"
        fill={
          props.disabled
            ? variables.palette.on_surface_variant_alfa16
            : variables.palette.on_surface_variant
        }
      />
    }
    checkedIcon={<Svg id="check-circle" fill={variables.palette.green} />}
    sx={{ p: 0, m: 0, pointerEvents: 'none' }}
    tabIndex={-1}
    {...props}
  />
);
