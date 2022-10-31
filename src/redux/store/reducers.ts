import * as modules from 'redux/modules';

const { base, ...customModules } = modules;

export default Object.values(customModules).reduce(
  (reducers, module) =>
    module.slice
      ? {
          ...reducers,
          [module.slice.name]: module.slice.reducer,
        }
      : reducers,
  {},
);
