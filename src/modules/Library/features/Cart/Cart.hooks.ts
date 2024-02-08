import { STORAGE_SELECTED_KEY } from 'modules/Library/consts';
import { library } from 'modules/Library/state';
import { useAppDispatch } from 'redux/store';

export const useClearCart = () => {
  const dispatch = useAppDispatch();

  return () => {
    sessionStorage.removeItem(STORAGE_SELECTED_KEY);
    dispatch(library.thunk.postAppletsToCart([]));
  };
};
