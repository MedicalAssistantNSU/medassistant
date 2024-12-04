
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { useRoutes } from 'react-router-dom';
import { useSelector } from 'src/store/Store';
import ScrollToTop from './components/shared/ScrollToTop';
import RTL from './layouts/full/shared/customizer/RTL';
import Router from './routes/Router';
import { AppState } from './store/Store';
import { ThemeSettings } from './theme/Theme';

function App() {
  const routing = useRoutes(Router);
  const theme = ThemeSettings();
  const customizer = useSelector((state: AppState) => state.customizer);
  return (
    <ThemeProvider theme={theme}>
      <RTL direction={customizer.activeDir}>
        <CssBaseline />
        <ScrollToTop>{routing}</ScrollToTop>
      </RTL>
      <Toaster />
    </ThemeProvider>
  );
}

export default App
