import { createBrowserRouter } from 'react-router-dom';
import { LoginRequired } from './auth/AuthProvider';
import { App } from './App';
import Login from './pages/Login';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <LoginRequired>
        <App />
      </LoginRequired>
    ),
  },
  {
    path: '/login',
    element: <Login />,
  },
]);
