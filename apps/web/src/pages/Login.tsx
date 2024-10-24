import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import { useRedirectIfLoggedIn } from '../auth/AuthProvider';
import { Box, Card, Stack } from '@mui/joy';
import { SignInWithGoogleButton } from '../auth/SignInWithGoogleButton';

const auth = getAuth();

const Login = () => {
  useRedirectIfLoggedIn();

  const loginWithGoogle = (response: google.accounts.id.CredentialResponse) => {
    const credential = GoogleAuthProvider.credential(response.credential);
    return signInWithCredential(auth, credential).catch((e) => {
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
