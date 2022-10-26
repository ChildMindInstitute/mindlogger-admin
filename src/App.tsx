import { ThemeProvider } from '@mui/material/styles';
import theme from 'styles/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">App component</div>
    </ThemeProvider>
  );
}

export default App;
