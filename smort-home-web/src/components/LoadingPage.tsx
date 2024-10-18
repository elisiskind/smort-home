import { Box, CircularProgress } from '@mui/joy';

export const LoadingPage = () => {
  return (
    <Box
      width={'100vw'}
      height={'100vh'}
      display={'flex'}
      alignItems={'center'}
      justifyContent={'center'}
    >
      <CircularProgress size={'lg'} />
    </Box>
  );
};
