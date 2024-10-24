import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { config } from '../config';

interface SignInWithGoogleButtonProps {
  loginWithGoogle: (response: google.accounts.id.CredentialResponse) => void;
}

export const SignInWithGoogleButton = ({
  loginWithGoogle,
}: SignInWithGoogleButtonProps) => {
  return (
    <GoogleOAuthProvider clientId={config.googleClientId}>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          if (credentialResponse.credential && credentialResponse.select_by) {
            loginWithGoogle({
              credential: credentialResponse.credential,
              select_by: credentialResponse.select_by,
            });
          }
        }}
      />
    </GoogleOAuthProvider>
  );
};
