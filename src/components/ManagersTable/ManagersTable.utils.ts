import { FOOTER_HEIGHT, SEARCH_HEIGHT, TABS_HEIGHT, TOP_BAR_HEIGHT } from 'utils/constants';

export const tableHeight = `calc(100vh - ${TOP_BAR_HEIGHT} - ${FOOTER_HEIGHT} - ${TABS_HEIGHT} - ${SEARCH_HEIGHT} - 6.4rem)`;
