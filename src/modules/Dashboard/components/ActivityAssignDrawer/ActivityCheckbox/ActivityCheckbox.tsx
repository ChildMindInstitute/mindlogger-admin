import { Svg } from 'shared/components';
import { variables } from 'shared/styles';

export const ActivityCheckbox = ({ isChecked = false }) =>
  isChecked ? (
    <Svg id="check-circle" fill={variables.palette.green} />
  ) : (
    <Svg id="add-circle" fill={variables.palette.on_surface_variant} />
  );
