import { normal } from 'color-blend';

import { variables } from 'shared/styles/variables';

export const convertColorToRGBA = (color: string) => {
  const div = document.createElement('div');
  div.style.backgroundColor = color;
  document.body.appendChild(div);
  let rgba = getComputedStyle(div).getPropertyValue('background-color');
  div.remove();

  if (rgba.indexOf('rgba') === -1) {
    rgba = rgba.replace(')', ', 1)');
  }
  const matchedRgba = rgba.match(/[.\d]+/g) as RegExpMatchArray;

  if (matchedRgba) {
    const [r, g, b, a] = matchedRgba.map((color) => +color);

    return {
      r,
      g,
      b,
      a,
    };
  }
};

export const blendColorsNormal = (mainColor: string, overlayColor: string) => {
  const mainColorRGBA = convertColorToRGBA(mainColor);
  const overlayColorRGBA = convertColorToRGBA(overlayColor);

  if (mainColorRGBA && overlayColorRGBA) {
    const { r, g, b, a } = normal(mainColorRGBA, overlayColorRGBA);

    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
};

export const tableRowHoverColor = blendColorsNormal(
  variables.palette.surface,
  variables.palette.on_surface_alfa12,
);
