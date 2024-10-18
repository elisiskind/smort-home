import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';

import { useState } from 'react';
import { Stack } from '@mui/system';
import { useRedirectIfLoggedIn } from '../auth/AuthProvider';
import { Box, Card, useTheme } from '@mui/joy';
import { SignInWithGoogleButton } from '../auth/SignInWithGoogleButton';

type View = 'signIn' | 'signUp';
const link = {
  color: '#1976d2',
  textDecoration: 'underline',
  cursor: 'pointer',
};

const auth = getAuth();

const Login = () => {
  useRedirectIfLoggedIn();
  const { palette } = useTheme();
  const [signInOrUp, setSignInOrUp] = useState<View>('signUp');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const loginWithGoogle = (response: google.accounts.id.CredentialResponse) => {
    setError(false);
    const credential = GoogleAuthProvider.credential(response.credential);
    return signInWithCredential(auth, credential).catch((e) => {
      setError(true);
      console.error(e);
    });
  };

  return (
    <Box
      height={'100vh'}
      width={'100vw'}
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      <Card
        sx={{
          width: '50%',
          minWidth: '300px',
          maxWidth: '90%',
          padding: 6,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Stack
          gap={2}
          alignItems={'center'}
          width={500}
          alignContent={'stretch'}
        >
          <SignInWithGoogleButton loginWithGoogle={loginWithGoogle} />
        </Stack>
      </Card>
    </Box>
  );
};

export default Login;
