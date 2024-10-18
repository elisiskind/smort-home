import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.tsx';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './store';
import { CssBaseline } from '@mui/joy';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CssBaseline />
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
