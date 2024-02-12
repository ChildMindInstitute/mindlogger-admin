import { useAppDispatch } from 'redux/store';
import { STORAGE_SELECTED_KEY } from 'modules/Library/consts';
import { library } from 'modules/Library/state';

export const useClearCart = () => {
  const dispatch = useAppDispatch();

  return () => {
    sessionStorage.removeItem(STORAGE_SELECTED_KEY);
    dispatch(library.thunk.postAppletsToCart([]));
  };
};
