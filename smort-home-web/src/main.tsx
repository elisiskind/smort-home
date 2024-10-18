import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './store';
import { CssBaseline } from '@mui/joy';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AuthProvider } from './auth/AuthProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CssBaseline />
    <Provider store={store}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </Provider>
  </StrictMode>,
);
