import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';

import { store } from 'redux/store';
import { theme } from 'shared/styles';
import { RootComponent } from 'routes/RootComponent';

const App = () => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <RootComponent />
    </ThemeProvider>
  </Provider>
);

export default App;
