import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
} from 'react';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { routes } from '../routes';
import { LoadingPage } from '../components/LoadingPage';
import { Box } from '@mui/joy';
import { auth } from '../firebase';

const allowedUsers = ['elisiskind@gmail.com', 'bessiestein@gmail.com'];

interface User {
  name: string | null;
  email: string | null;
  uid: string;
  profileImage: string | null;
}

type AuthState =
  | { loggedIn: false }
  | {
      loggedIn: true;
      user: User;
      logout: () => void;
    };

// Not exported because we only will use it through the useAuth hook.
const AuthContext = createContext<null | AuthState>(null);

/*
 This hook encapsulates all the logic associated with auth, exposing only whether we are logged in or not, and the
 current user. However, before using this, check to see if any of the other exported hooks or components in this file
 will do what you need.
*/
export const useAuth = () => {
  const auth = useContext(AuthContext);
  if (auth === null) {
    throw new Error('Must be inside AuthProvider to use useAuth hook');
  }
  return auth;
};

// Not exported because we will only use it through the useLoggedInAuth hook.
const LoggedInContext = createContext<{
  user: User;
  logout: () => void;
} | null>(null);

/*
 Similar to useAuth, except only can be used within <LoginRequired>, that way we have a compile time guarantee that the
 user id is set.
 */
export const useLoggedInAuth = () => {
  const loggedInUser = useContext(LoggedInContext);
  if (loggedInUser === null) {
    throw new Error('Must be inside LoginRequired to use useLoggedInAuth hook');
  }
  return loggedInUser;
};

/*
 This provider encapsulates all auth logic, calling the two hooks above and also preventing the "loading" state from
 needing to be handled by child components.
 */
export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <LoadingPage />;
  }

  const parsedUser = error
    ? null
    : user
      ? {
          uid: user.uid,
          email:
            user.email ??
            user.providerData.find((p) => p.email !== null)?.email ??
            null,
          name:
            user.displayName ??
            user.providerData.find((p) => p.displayName !== null)
              ?.displayName ??
            null,
          profileImage: user.photoURL,
        }
      : null;

  const loginState: AuthState = parsedUser
    ? {
        loggedIn: true,
        user: parsedUser,
        logout: () => auth.signOut(),
      }
    : {
        loggedIn: false,
      };

  return (
    <AuthContext.Provider value={loginState}>{children}</AuthContext.Provider>
  );
};

// Use this for pages like /login where you only should be on that route if you are not currenty logged in.
export const useRedirectIfLoggedIn = () => {
  const { loggedIn } = useAuth();
  const navigate = useNavigate();
  const { redirect } = useParams();

  useEffect(() => {
    if (loggedIn) {
      navigate(redirect ?? '/');
    }
  }, [loggedIn, navigate]);
};

// Wrap components in this if you want to require the user to login to see the content.
export const LoginRequired = ({ children }: PropsWithChildren) => {
  const auth = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.loggedIn) {
      navigate(`${routes.LOGIN}?redirect_auth=${pathname}`);
    }
  }, [auth, navigate, pathname]);

  return auth.loggedIn ? (
    allowedUsers.includes(auth.user.email ?? '') ? (
      <LoggedInContext.Provider
        value={{ user: auth.user, logout: auth.logout }}
      >
        {children}
      </LoggedInContext.Provider>
    ) : (
      <Box>Sorry, you are not authorized to access this page.</Box>
    )
  ) : (
    <LoadingPage />
  );
};
