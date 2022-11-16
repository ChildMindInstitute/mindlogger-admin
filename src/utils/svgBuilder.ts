const svgWrapper = document.createElement('noindex');

const svgBuilder = (svg: () => string) => {
  svgWrapper.setAttribute('id', 'svg-sprite');
  svgWrapper.innerHTML = svg();

  return svgWrapper;
};

export default svgBuilder;
