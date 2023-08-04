import get from 'lodash.get';

export const mapPostCartItems = <T>(payload: T) => ({
  result: get(payload, ['result', 'cartItems'], []),
  count: get(payload, ['result', 'cartItems', 'length'], 0),
});
