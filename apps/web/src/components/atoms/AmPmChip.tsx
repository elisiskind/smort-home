import { Typography } from '@mui/joy';
import { PropsWithChildren } from 'react';

interface AmPmChipProps {
  selected: boolean;
}

export const AmPmChip = ({
  children,
  selected,
}: PropsWithChildren<AmPmChipProps>) => {
  return (
    <Typography
      fontFamily={'share tech mono'}
      fontSize={18}
      textColor={selected ? undefined : 'background.level3'}
    >
      {children}
    </Typography>
  );
};
