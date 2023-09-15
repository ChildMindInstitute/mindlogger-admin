import { Themes } from 'modules/Builder/api';

import { StyledCircle } from './AboutApplet.styles';

export const getColorThemeOptions = (themes: Themes) =>
  themes.map(({ id, name, primaryColor }) => ({
    value: id,
    labelKey: name,
    icon: <StyledCircle bgColor={primaryColor} />,
  }));
